import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AppError, type ApiResponse, type AuthTokens } from "@/types/api.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15000,
});

let inMemoryToken: string | null = null;
if (typeof window !== "undefined") {
  inMemoryToken = localStorage.getItem("kiddy_access_token");
}

export const setAccessToken = (token: string | null) => {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("kiddy_access_token", token);
    } else {
      localStorage.removeItem("kiddy_access_token");
    }
  }
};

export const getAccessToken = (): string | null => {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== "undefined") {
    inMemoryToken = localStorage.getItem("kiddy_access_token");
    return inMemoryToken;
  }
  return null;
};

const getDeviceId = (): string => {
  if (typeof window === "undefined") return "server";
  let deviceId = localStorage.getItem("kiddy_device_id");
  if (!deviceId) {
    deviceId = "dev_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("kiddy_device_id", deviceId);
  }
  return deviceId;
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers) {
      config.headers["X-Device-Id"] = getDeviceId();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with Token Refresh Queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: { code?: string; details?: [] } }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      return Promise.reject(
        new AppError(
          "Network error or server unreachable. Please check your internet connection.",
          "NETWORK_ERROR"
        )
      );
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized with token refresh deduplication
    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<ApiResponse<AuthTokens>>(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("kiddy_auth_expired"));
        }
        return Promise.reject(
          new AppError("Session expired. Please log in again.", "UNAUTHORIZED", undefined, 401)
        );
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize backend error
    const message = data?.message || error.message || "An unexpected error occurred";
    const errorCode = data?.error?.code || "INTERNAL_ERROR";
    const details = data?.error?.details;

    return Promise.reject(new AppError(message, errorCode, details, status));
  }
);
