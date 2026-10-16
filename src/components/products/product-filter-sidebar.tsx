"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Sparkles,
  Baby,
  Brain,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Tag,
  PackageCheck,
  Percent,
} from "lucide-react";
import { AGE_GROUPS, SKILL_BENEFITS } from "@/lib/catalog-data";

export interface FilterSidebarProps {
  selectedAges: string[];
  onToggleAge: (age: string) => void;
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  selectedCategories: string[];
  onToggleCategory: (cat: string) => void;
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  priceRange: [number, number];
  onPriceChange: (val: [number, number]) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  specialOffersOnly: boolean;
  onToggleSpecialOffers: (val: boolean) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  availableCategories: { name: string; count: number }[];
  availableBrands: { name: string; count: number }[];
  ageCounts: Record<string, number>;
  skillCounts: Record<string, number>;
  className?: string;
}

export function ProductFilterSidebar({
  selectedAges,
  onToggleAge,
  selectedSkills,
  onToggleSkill,
  selectedCategories,
  onToggleCategory,
  selectedBrands,
  onToggleBrand,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  specialOffersOnly,
  onToggleSpecialOffers,
  onResetFilters,
  activeFilterCount,
  availableCategories,
  availableBrands,
  ageCounts,
  skillCounts,
  className = "",
}: FilterSidebarProps) {
  // Collapsible section state
  const [openSections, setOpenSections] = React.useState({
    age: true,
    skill: true,
    price: true,
    category: true,
    brand: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [localMin, setLocalMin] = React.useState(priceRange[0].toString());
  const [localMax, setLocalMax] = React.useState(priceRange[1].toString());

  React.useEffect(() => {
    setLocalMin(priceRange[0].toString());
    setLocalMax(priceRange[1].toString());
  }, [priceRange]);

  const handleManualPriceApply = () => {
    const min = Math.max(0, parseInt(localMin) || 0);
    const max = Math.min(10000, Math.max(min, parseInt(localMax) || 10000));
    onPriceChange([min, max]);
  };

  return (
    <aside
      className={`w-full bg-card/90 backdrop-blur-xs border border-border/70 rounded-3xl p-5 shadow-xs space-y-6 ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">Smart Filters</h2>
            <p className="text-xs text-muted-foreground">Find by age, skill & price</p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full h-8 px-2.5 font-semibold gap-1 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Reset ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* 1. Filter by Age Group */}
      <div className="border-b border-border/50 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("age")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-amber-500" />
            <span>Age Group</span>
            {selectedAges.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                {selectedAges.length}
              </span>
            )}
          </div>
          {openSections.age ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openSections.age && (
          <div className="mt-3.5 space-y-2">
            {AGE_GROUPS.map((group) => {
              const isChecked = selectedAges.includes(group.id);
              const count = ageCounts[group.id] || 0;
              return (
                <label
                  key={group.id}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                    isChecked
                      ? "bg-amber-500/10 border-amber-500/30 font-medium text-foreground"
                      : "hover:bg-muted/60 border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleAge(group.id)}
                      className="border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-foreground">{group.label}</span>{" "}
                      <span className="text-[11px] opacity-75">({group.subtitle})</span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isChecked
                        ? "bg-amber-500 text-white font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Filter by Skill & Developmental Benefit */}
      <div className="border-b border-border/50 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("skill")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>Skill & Benefit</span>
            {selectedSkills.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">
                {selectedSkills.length}
              </span>
            )}
          </div>
          {openSections.skill ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openSections.skill && (
          <div className="mt-3.5 space-y-1.5">
            {SKILL_BENEFITS.map((skill) => {
              const isChecked = selectedSkills.includes(skill.id);
              const count = skillCounts[skill.id] || 0;
              return (
                <label
                  key={skill.id}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                    isChecked
                      ? "bg-primary/10 border-primary/30 font-medium text-foreground"
                      : "hover:bg-muted/60 border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleSkill(skill.id)}
                    />
                    <span className="text-xs font-medium text-foreground leading-snug">
                      {skill.label}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                      isChecked
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Price Range Slider & Instant Inputs */}
      <div className="border-b border-border/50 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" />
            <span>Price Range (BDT)</span>
          </div>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-4 space-y-4">
            <div className="px-1">
              <Slider
                min={0}
                max={10000}
                step={100}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={(val) => {
                  onPriceChange([val[0], val[1]]);
                }}
                className="py-2"
              />
            </div>

            {/* Instant Inputs */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted/60 rounded-xl px-2.5 py-1.5 border border-border/60 focus-within:border-primary transition-colors">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Min ৳
                </span>
                <input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onBlur={handleManualPriceApply}
                  onKeyDown={(e) => e.key === "Enter" && handleManualPriceApply()}
                  className="w-full bg-transparent text-xs font-bold text-foreground outline-hidden"
                />
              </div>

              <span className="text-muted-foreground text-xs font-bold">—</span>

              <div className="flex-1 bg-muted/60 rounded-xl px-2.5 py-1.5 border border-border/60 focus-within:border-primary transition-colors">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Max ৳
                </span>
                <input
                  type="number"
                  min={priceRange[0]}
                  max={10000}
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onBlur={handleManualPriceApply}
                  onKeyDown={(e) => e.key === "Enter" && handleManualPriceApply()}
                  className="w-full bg-transparent text-xs font-bold text-foreground outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
              <span>৳0</span>
              <span className="font-bold text-foreground">
                ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
              </span>
              <span>৳10,000+</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Filter by Category */}
      <div className="border-b border-border/50 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Department & Category</span>
            {selectedCategories.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-black flex items-center justify-center">
                {selectedCategories.length}
              </span>
            )}
          </div>
          {openSections.category ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openSections.category && (
          <div className="mt-3.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.name);
              return (
                <label
                  key={cat.name}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                    isChecked
                      ? "bg-cyan-500/10 border-cyan-500/30 font-medium text-foreground"
                      : "hover:bg-muted/60 border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleCategory(cat.name)}
                      className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {cat.name}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                      isChecked
                        ? "bg-cyan-500 text-white font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Filter by Brand */}
      <div className="border-b border-border/50 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-purple-500" />
            <span>Trusted Brands</span>
            {selectedBrands.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-black flex items-center justify-center">
                {selectedBrands.length}
              </span>
            )}
          </div>
          {openSections.brand ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openSections.brand && (
          <div className="mt-3.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableBrands.map((b) => {
              const isChecked = selectedBrands.includes(b.name);
              return (
                <label
                  key={b.name}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                    isChecked
                      ? "bg-purple-500/10 border-purple-500/30 font-medium text-foreground"
                      : "hover:bg-muted/60 border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleBrand(b.name)}
                      className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {b.name}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                      isChecked
                        ? "bg-purple-500 text-white font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {b.count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Availability & Special Offers */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-rose-500" />
            <span>Availability & Deals</span>
          </div>
          {openSections.availability ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openSections.availability && (
          <div className="mt-3.5 space-y-2">
            <label
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                inStockOnly
                  ? "bg-emerald-500/10 border-emerald-500/30 font-medium text-foreground"
                  : "hover:bg-muted/60 border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(checked) => onToggleInStock(!!checked)}
                  className="border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <span className="text-xs font-semibold text-foreground">In Stock Only</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </label>

            <label
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                specialOffersOnly
                  ? "bg-rose-500/10 border-rose-500/30 font-medium text-foreground"
                  : "hover:bg-muted/60 border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Checkbox
                  checked={specialOffersOnly}
                  onCheckedChange={(checked) => onToggleSpecialOffers(!!checked)}
                  className="border-rose-500 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                />
                <span className="text-xs font-semibold text-foreground">Special Offers Only</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/15 px-1.5 py-0.5 rounded-md">
                Deals
              </span>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}
