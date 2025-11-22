"use client";

import { analytics } from "@/lib/analytics";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function ListingFilters({
  availableColors,
  availableSizes,
}: {
  availableColors: string[];
  availableSizes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [localMin, setLocalMin] = useState(sp.get("min") || "");
  const [localMax, setLocalMax] = useState(sp.get("max") || "");

  const updateParam = useCallback(
    (key: string, value?: string | null) => {
      const next = new URLSearchParams(sp.toString());
      if (!value) next.delete(key);
      else next.set(key, value);
      router.replace(`${pathname}?${next.toString()}`);
    },
    [router, pathname, sp]
  );

  const current = useMemo(
    () => ({
      color: sp.get("color") || "",
      size: sp.get("size") || "",
      sort: sp.get("sort") || "price-asc",
      min: sp.get("min") || "",
      max: sp.get("max") || "",
      pageSize: sp.get("pageSize") || "24",
    }),
    [sp]
  );

  // Custom button style for active/inactive filters
  const getButtonClasses = (isActive: boolean) => {
    const base = "px-4 py-2 border font-medium text-sm tracking-wide transition-all duration-300";
    const activeStyle = "bg-[#423F3E] border-[#8B4513] text-white"; // Active/Selected
    const inactiveStyle = "bg-[#2B2B2B] border-[#362222] text-gray-300 hover:bg-[#362222] hover:border-[#423F3E]"; // Inactive
    return `${base} ${isActive ? activeStyle : inactiveStyle}`;
  }

  return (
    <aside className="space-y-8">
      <div>
        <label className="block text-sm font-bold mb-3 text-white uppercase tracking-wider">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className={getButtonClasses(!current.color)}
            onClick={() => updateParam("color", null)}
          >
            All
          </button>
          {availableColors.map((c) => (
            <button
              key={c}
              className={getButtonClasses(current.color === c)}
              onClick={() => {
                updateParam("color", c);
                analytics.applyFilter("color", c);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-3 text-white uppercase tracking-wider">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className={getButtonClasses(!current.size)}
            onClick={() => updateParam("size", null)}
          >
            All
          </button>
          {availableSizes.map((s) => (
            <button
              key={s}
              className={getButtonClasses(current.size === s)}
              onClick={() => {
                updateParam("size", s);
                analytics.applyFilter("size", s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-2 text-white uppercase tracking-wider">
            Min Price
          </label>
          <input
            type="number"
            className="w-full border px-3 py-2 text-white font-medium outline-none transition-all duration-300
                       bg-[#2B2B2B] border-[#362222] focus:border-white focus:ring-1 focus:ring-white focus:shadow-lg focus:shadow-black/50"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={() => {
              updateParam("min", localMin || null);
              if (localMin) analytics.applyFilter("price_min", localMin);
            }}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-white uppercase tracking-wider">
            Max Price
          </label>
          <input
            type="number"
            className="w-full border px-3 py-2 text-white font-medium outline-none transition-all duration-300
                       bg-[#2B2B2B] border-[#362222] focus:border-white focus:ring-1 focus:ring-white focus:shadow-lg focus:shadow-black/50"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={() => {
              updateParam("max", localMax || null);
              if (localMax) analytics.applyFilter("price_max", localMax);
            }}
            placeholder="1000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-white uppercase tracking-wider">
          Sort By
        </label>
        <select
          className="w-full border px-3 py-2 text-white font-medium outline-none transition-all duration-300 cursor-pointer
                     bg-[#2B2B2B] border-[#362222] focus:border-white focus:ring-1 focus:ring-white focus:shadow-lg focus:shadow-black/50"
          value={current.sort}
          onChange={(e) => {
            updateParam("sort", e.target.value);
            analytics.applyFilter("sort", e.target.value);
          }}
        >
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>
    </aside>
  );
}