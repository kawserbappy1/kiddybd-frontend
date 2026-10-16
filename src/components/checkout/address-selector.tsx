"use client";

import * as React from "react";
import { BD_LOCATIONS } from "@/lib/bd-locations";
import { CheckCircle2, AlertCircle, MapPin, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AddressData {
  id?: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  streetAddress: string;
  isDefault?: boolean;
}

interface AddressSelectorProps {
  selectedAddress: AddressData;
  onChangeAddress: (address: AddressData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const LOCAL_STORAGE_SAVED_ADDRESSES_KEY = "kiddybd_customer_saved_addresses";

export function AddressSelector({
  selectedAddress,
  onChangeAddress,
  onValidationChange,
}: AddressSelectorProps) {
  const [useSavedAddress, setUseSavedAddress] = React.useState(false);
  const [savedAddresses, setSavedAddresses] = React.useState<AddressData[]>([]);

  // Load previously saved addresses from browser storage on mount (for repeat customers)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY);
      if (stored) {
        const parsed: AddressData[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
          // If customer has a default saved address and form is currently empty, auto-select it
          if (!selectedAddress.fullName && !selectedAddress.phone && parsed[0]) {
            onChangeAddress(parsed[0]);
            setUseSavedAddress(true);
          }
        }
      }
    } catch {
      // LocalStorage error fallback
    }
  }, []);

  // Phone number BD Regex validation: ^01[3-9]\d{8}$
  const isPhoneValid = React.useMemo(() => {
    return /^01[3-9]\d{8}$/.test(selectedAddress.phone.trim());
  }, [selectedAddress.phone]);

  const isNameValid = selectedAddress.fullName.trim().length >= 3;
  const isStreetValid = selectedAddress.streetAddress.trim().length >= 5;
  const isGeoValid =
    !!selectedAddress.division && !!selectedAddress.district && !!selectedAddress.thana;

  const isFormValid = isNameValid && isPhoneValid && isStreetValid && isGeoValid;

  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid);
    }
  }, [isFormValid, onValidationChange]);

  // Derived districts based on chosen division
  const currentDivisionObj = BD_LOCATIONS.divisions.find(
    (d) => d.name === selectedAddress.division
  );
  const availableDistricts = currentDivisionObj ? currentDivisionObj.districts : [];

  // Derived thanas based on chosen district
  const currentDistrictObj = availableDistricts.find(
    (dist) => dist.name === selectedAddress.district
  );
  const availableThanas = currentDistrictObj ? currentDistrictObj.thanas : [];

  const handleDivisionChange = (div: string) => {
    const divObj = BD_LOCATIONS.divisions.find((d) => d.name === div);
    const firstDist = divObj?.districts[0]?.name || "";
    const firstThana = divObj?.districts[0]?.thanas[0] || "";

    onChangeAddress({
      ...selectedAddress,
      division: div,
      district: firstDist,
      thana: firstThana,
    });
  };

  const handleDistrictChange = (dist: string) => {
    const distObj = availableDistricts.find((d) => d.name === dist);
    const firstThana = distObj?.thanas[0] || "";

    onChangeAddress({
      ...selectedAddress,
      district: dist,
      thana: firstThana,
    });
  };

  const handleSelectSaved = (addr: AddressData) => {
    onChangeAddress(addr);
    setUseSavedAddress(true);
  };

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-display text-foreground tracking-tight">
              1. Delivery Address
            </h2>
            <p className="text-xs text-muted-foreground">
              Where should we deliver your parcel?
            </p>
          </div>
        </div>

        {/* Form Validation Pill */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
            isFormValid
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          }`}
        >
          {isFormValid ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Address Valid
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" /> Required Details Needed
            </>
          )}
        </div>
      </div>

      {/* Saved Addresses Selector */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Saved Addresses
            </span>
            <button
              type="button"
              onClick={() => {
                setUseSavedAddress(false);
                onChangeAddress({
                  fullName: "",
                  phone: "",
                  division: "Dhaka",
                  district: "Dhaka",
                  thana: "Gulshan",
                  streetAddress: "",
                });
              }}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Enter New Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => {
              const isSelected =
                useSavedAddress &&
                selectedAddress.fullName === addr.fullName &&
                selectedAddress.streetAddress === addr.streetAddress;

              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSaved(addr)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                      : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        {addr.fullName}
                        {addr.isDefault && (
                          <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5">
                        📞 {addr.phone}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-foreground/80 mt-2 line-clamp-2 leading-relaxed">
                    {addr.streetAddress}, {addr.thana}, {addr.district}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Address Form Inputs */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Full Recipient Name *</span>
              {!isNameValid && selectedAddress.fullName.length > 0 && (
                <span className="text-[10px] text-rose-500 font-normal">Min 3 characters</span>
              )}
            </label>
            <input
              type="text"
              placeholder="e.g. Farzana Islam"
              value={selectedAddress.fullName}
              onChange={(e) => {
                setUseSavedAddress(false);
                onChangeAddress({ ...selectedAddress, fullName: e.target.value });
              }}
              className="w-full h-11 px-4 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs"
            />
          </div>

          {/* Phone Number with BD regex indicator */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Mobile Phone Number *</span>
              {selectedAddress.phone.length > 0 && (
                <span
                  className={`text-[10px] font-bold ${
                    isPhoneValid ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {isPhoneValid ? "✓ Valid BD format" : "Must be 01[3-9]XXXXXXXX (11 digits)"}
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground select-none">
                +88
              </span>
              <input
                type="tel"
                placeholder="01712345678"
                maxLength={11}
                value={selectedAddress.phone}
                onChange={(e) => {
                  setUseSavedAddress(false);
                  const val = e.target.value.replace(/\D/g, "");
                  onChangeAddress({ ...selectedAddress, phone: val });
                }}
                className={`w-full h-11 pl-12 pr-4 rounded-2xl bg-card border text-xs sm:text-sm text-foreground focus:outline-hidden transition-colors shadow-2xs ${
                  selectedAddress.phone.length > 0 && !isPhoneValid
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-border/80 focus:border-primary"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Division, District, Thana Cascading Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Division */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Division *</label>
            <select
              value={selectedAddress.division}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs cursor-pointer"
            >
              {BD_LOCATIONS.divisions.map((div) => (
                <option key={div.name} value={div.name}>
                  {div.name}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">District / City *</label>
            <select
              value={selectedAddress.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs cursor-pointer"
            >
              {availableDistricts.map((dist) => (
                <option key={dist.name} value={dist.name}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thana / Upazila */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Thana / Upazila *</label>
            <select
              value={selectedAddress.thana}
              onChange={(e) =>
                onChangeAddress({ ...selectedAddress, thana: e.target.value })
              }
              className="w-full h-11 px-3.5 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs cursor-pointer"
            >
              {availableThanas.map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
              <option value="Other / Outskirts">Other / Outskirts Area</option>
            </select>
          </div>
        </div>

        {/* Detailed Street Address / House / Road / Landmark */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>Street Address / House / Road / Landmark *</span>
            {!isStreetValid && selectedAddress.streetAddress.length > 0 && (
              <span className="text-[10px] text-rose-500 font-normal">Please provide road/house number</span>
            )}
          </label>
          <textarea
            rows={2}
            placeholder="e.g. House #14, Flat 3B, Road #7, Sector #3 (Near Uttara Friends Club)"
            value={selectedAddress.streetAddress}
            onChange={(e) => {
              setUseSavedAddress(false);
              onChangeAddress({ ...selectedAddress, streetAddress: e.target.value });
            }}
            className="w-full p-3.5 rounded-2xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors shadow-2xs resize-none"
          />
        </div>
      </div>
    </div>
  );
}
