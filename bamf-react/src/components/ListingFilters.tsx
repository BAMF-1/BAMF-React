// components/ListingFilters.tsx
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

  return (
    <aside className="space-y-6">
      <div>
        <label className="block text-sm font-bold mb-3 text-white uppercase tracking-wider">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 border font-medium text-sm tracking-wide transition-all"
            style={{
              backgroundColor: !current.color ? "#362222" : "#2B2B2B",
              borderColor: !current.color ? "#423F3E" : "#362222",
              color: "white",
            }}
            onMouseEnter={(e) =>
              !current.color && (e.currentTarget.style.borderColor = "#423F3E")
            }
            onMouseLeave={(e) =>
              !current.color || (e.currentTarget.style.borderColor = "#362222")
            }
            onClick={() => updateParam("color", null)}
          >
            All
          </button>
          {availableColors.map((c) => (
            <button
              key={c}
              className="px-4 py-2 border font-medium text-sm tracking-wide transition-all"
              style={{
                backgroundColor: current.color === c ? "#362222" : "#2B2B2B",
                borderColor: current.color === c ? "#423F3E" : "#362222",
                color: "white",
              }}
              onMouseEnter={(e) =>
                current.color !== c &&
                (e.currentTarget.style.backgroundColor = "#362222")
              }
              onMouseLeave={(e) =>
                current.color !== c &&
                (e.currentTarget.style.backgroundColor = "#2B2B2B")
              }
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
            className="px-4 py-2 border font-medium text-sm tracking-wide transition-all"
            style={{
              backgroundColor: !current.size ? "#362222" : "#2B2B2B",
              borderColor: !current.size ? "#423F3E" : "#362222",
              color: "white",
            }}
            onMouseEnter={(e) =>
              !current.size && (e.currentTarget.style.borderColor = "#423F3E")
            }
            onMouseLeave={(e) =>
              !current.size || (e.currentTarget.style.borderColor = "#362222")
            }
            onClick={() => updateParam("size", null)}
          >
            All
          </button>
          {availableSizes.map((s) => (
            <button
              key={s}
              className="px-4 py-2 border font-medium text-sm tracking-wide transition-all"
              style={{
                backgroundColor: current.size === s ? "#362222" : "#2B2B2B",
                borderColor: current.size === s ? "#423F3E" : "#362222",
                color: "white",
              }}
              onMouseEnter={(e) =>
                current.size !== s &&
                (e.currentTarget.style.backgroundColor = "#362222")
              }
              onMouseLeave={(e) =>
                current.size !== s &&
                (e.currentTarget.style.backgroundColor = "#2B2B2B")
              }
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
            className="w-full border px-3 py-2 text-white font-medium outline-none focus:border-[#423F3E] transition-colors"
            style={{ backgroundColor: "#2B2B2B", borderColor: "#362222" }}
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
            className="w-full border px-3 py-2 text-white font-medium outline-none focus:border-[#423F3E] transition-colors"
            style={{ backgroundColor: "#2B2B2B", borderColor: "#362222" }}
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
          className="w-full border px-3 py-2 text-white font-medium outline-none focus:border-[#423F3E] transition-colors cursor-pointer"
          style={{ backgroundColor: "#2B2B2B", borderColor: "#362222" }}
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
