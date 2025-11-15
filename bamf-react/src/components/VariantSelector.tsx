'use client';

import { useMemo, useState } from 'react';
import ImageGallery from './ImageGallery';

interface VariantSelectorProps {
  group: {
    name: string;
    variants: Array<{
      sku: string;
      color?: string | null;  // ✅ Make optional
      size?: string | null;   // ✅ Make optional
      price: number;
      inStock: boolean;
      description?: string | null;
      brand?: string | null;
      material?: string | null;
      images?: Array<{
        url: string;
        altText?: string | null;
        isPrimary: boolean;
        sortOrder: number;
      }>;
    }>;
    facets: {
      colors?: Array<{ value: string; count: number }>;  // ✅ Make optional
      sizes?: Array<{ value: string; count: number }>;   // ✅ Make optional
    };
  };
  initialSku?: string;
}

export default function VariantSelector({ group, initialSku }: VariantSelectorProps) {
  // Find initial variant
  const initialVariant = initialSku 
    ? group.variants.find(v => v.sku === initialSku)
    : group.variants[0];

  const [color, setColor] = useState(initialVariant?.color || '');
  const [size, setSize] = useState(initialVariant?.size || '');

  // Get available colors and sizes (handle undefined facets)
  const colorsAvailable = group.facets?.colors?.map(c => c.value) || [];
  const sizesAvailable = group.facets?.sizes?.map(s => s.value) || [];

  // Determine enabled colors based on selected size
  const colorsEnabled = useMemo(() => {
    if (!size) return new Set(colorsAvailable);
    return new Set(
      group.variants
        .filter(v => v.size === size)
        .map(v => v.color)
        .filter((c): c is string => c != null)  // ✅ Filter out nulls
    );
  }, [size, group.variants, colorsAvailable]);

  // Determine enabled sizes based on selected color
  const sizesEnabled = useMemo(() => {
    if (!color) return new Set(sizesAvailable);
    return new Set(
      group.variants
        .filter(v => v.color === color)
        .map(v => v.size)
        .filter((s): s is string => s != null)  // ✅ Filter out nulls
    );
  }, [color, group.variants, sizesAvailable]);

  // Get the resolved variant
  const resolved = useMemo(() => {
    return group.variants.find(v => v.color === color && v.size === size);
  }, [color, size, group.variants]);

  // Get images for current variant (based on color)
  const currentImages = useMemo(() => {
    if (!resolved || !resolved.images) return [];
    return resolved.images;
  }, [resolved]);

  // Display price
  const displayPrice = resolved
    ? `$${resolved.price.toFixed(2)}`
    : group.variants.length > 0
    ? `From $${Math.min(...group.variants.map(v => v.price)).toFixed(2)}`
    : 'N/A';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Image Gallery */}
      <div>
        <ImageGallery 
          images={currentImages} 
          productName={group.name}
        />
      </div>

      {/* Right Column - Product Info */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
        <div className="text-2xl text-white mb-6">{displayPrice}</div>

        {/* Variant Metadata Section */}
        {resolved && (resolved.description || resolved.brand || resolved.material) && (
          <div className="mb-6 space-y-3 border-t border-b border-gray-700 py-4">
            {resolved.brand && (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-400 font-medium">Brand:</span>
                <span className="text-sm text-white">{resolved.brand}</span>
              </div>
            )}
            
            {resolved.material && (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-400 font-medium">Material:</span>
                <span className="text-sm text-white">{resolved.material}</span>
              </div>
            )}
            
            {resolved.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {resolved.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Color Selector */}
        {colorsAvailable.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-300 mb-2">
              Color {color && <span className="text-white">: {color}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {colorsAvailable.map((c) => {
                const isEnabled = colorsEnabled.has(c);
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    disabled={!isEnabled}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-white text-black border-white' 
                        : isEnabled
                        ? 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
                        : 'bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {sizesAvailable.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-300 mb-2">
              Size {size && <span className="text-white">: {size}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizesAvailable.map((s) => {
                const isEnabled = sizesEnabled.has(s);
                const isSelected = size === s;
                return (
                  <button
                    key={s}
                    disabled={!isEnabled}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-white text-black border-white' 
                        : isEnabled
                        ? 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
                        : 'bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock Status */}
        {resolved && (
          <div className="mb-6">
            {resolved.inStock ? (
              <span className="text-green-400 text-sm">✓ In Stock</span>
            ) : (
              <span className="text-red-400 text-sm">✗ Out of Stock</span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        {resolved && (
          <button
            disabled={!resolved.inStock}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              resolved.inStock
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {resolved.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}

        {/* SKU Display */}
        {resolved && (
          <div className="mt-4 text-xs text-gray-500">
            SKU: {resolved.sku}
          </div>
        )}
      </div>
    </div>
  );
}