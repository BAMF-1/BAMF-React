'use client';

import { useMemo, useState } from 'react';
import ImageGallery from './ImageGallery';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-toastify';

interface VariantSelectorProps {
  group: {
    name: string;
    groupSlug: string;
    variants: Array<{
      sku: string;
      color?: string | null;
      size?: string | null;
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
      colors?: Array<{ value: string; count: number }>;
      sizes?: Array<{ value: string; count: number }>;
    };
  };
  initialSku?: string;
}

export default function VariantSelector({ group, initialSku }: VariantSelectorProps) {
  const { addItem } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  // Find initial variant
  const initialVariant = initialSku
    ? group.variants.find(v => v.sku === initialSku)
    : group.variants[0];

  const [color, setColor] = useState(initialVariant?.color || '');
  const [size, setSize] = useState(initialVariant?.size || '');

  // Get available colors and sizes
  const colorsAvailable = group.facets?.colors?.map(c => c.value) || [];
  const sizesAvailable = group.facets?.sizes?.map(s => s.value) || [];

  // Get the resolved variant
  const resolved = useMemo(() => {
    return group.variants.find(v => v.color === color && v.size === size);
  }, [color, size, group.variants]);

  // Get images for current variant
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

  // Handle color change - find a valid size for the new color
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    
    // Check if current size is available for new color
    const variantExists = group.variants.some(v => v.color === newColor && v.size === size);
    
    // If not, find the first available size for this color
    if (!variantExists) {
      const firstAvailableSize = group.variants.find(v => v.color === newColor)?.size;
      if (firstAvailableSize) {
        toast.info(`The selected size is not available in color ${newColor}. Switched to size: ${firstAvailableSize}.`);
        setSize(firstAvailableSize);
      }
    }
  };

  // Handle size change - find a valid color for the new size
  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
    
    // Check if current color is available for new size
    const variantExists = group.variants.some(v => v.size === newSize && v.color === color);
    
    // If not, find the first available color for this size
    if (!variantExists) {
      const firstAvailableColor = group.variants.find(v => v.size === newSize)?.color;
      if (firstAvailableColor) {
        toast.info(`The selected color is not available in size ${newSize}. Switched to color: ${firstAvailableColor}.`);
        setColor(firstAvailableColor);
      }
    }
  };

  const handleAddToCart = () => {
    if (!resolved || !resolved.inStock) return;

    addItem({
      sku: resolved.sku,
      name: group.name,
      color: resolved.color || undefined,
      size: resolved.size || undefined,
      price: resolved.price,
      image: resolved.images?.[0]?.url,
      groupSlug: group.groupSlug
    });

    // Show success message
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 uppercase tracking-tight">{group.name}</h1>
        <div className="text-3xl font-bold text-white mb-8">{displayPrice}</div>

        {/* Variant Metadata Section */}
        <div className="mb-8 space-y-4 border-t border-b py-6" style={{ borderColor: '#362222' }}>
          <div className="flex items-baseline gap-3">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Brand:</span>
            <span className="text-base text-white font-medium">
              {resolved?.brand || 'N/A'}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Material:</span>
            <span className="text-base text-white font-medium">
              {resolved?.material || 'N/A'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Description</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              {resolved?.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Color Selector */}
        {colorsAvailable.length > 0 && (
          <div className="mb-8">
            <div className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Color {color && <span className="text-gray-300">: {color}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {colorsAvailable.map((c) => {
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    onClick={() => handleColorChange(c)}
                    className="px-5 py-3 border font-medium text-sm tracking-wide transition-all"
                    style={{
                      backgroundColor: isSelected ? '#362222' : '#2B2B2B',
                      borderColor: isSelected ? '#423F3E' : '#362222',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#362222')}
                    onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#2B2B2B')}
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
          <div className="mb-8">
            <div className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Size {size && <span className="text-gray-300">: {size}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {sizesAvailable.map((s) => {
                const isSelected = size === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleSizeChange(s)}
                    className="px-5 py-3 border font-medium text-sm tracking-wide transition-all"
                    style={{
                      backgroundColor: isSelected ? '#362222' : '#2B2B2B',
                      borderColor: isSelected ? '#423F3E' : '#362222',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#362222')}
                    onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#2B2B2B')}
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
              <span className="text-green-400 text-sm font-bold tracking-wider uppercase">✓ In Stock</span>
            ) : (
              <span className="text-red-400 text-sm font-bold tracking-wider uppercase">✗ Out of Stock</span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        {resolved && (
          <div className="relative">
            <button
              disabled={!resolved.inStock}
              onClick={handleAddToCart}
              className="w-full py-4 font-bold text-base tracking-widest transition-all uppercase"
              style={{
                backgroundColor: resolved.inStock ? '#362222' : '#1a1a1a',
                color: resolved.inStock ? 'white' : '#4a4a4a',
                borderWidth: '2px',
                borderColor: resolved.inStock ? '#423F3E' : '#2B2B2B',
                cursor: resolved.inStock ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => resolved.inStock && (e.currentTarget.style.backgroundColor = '#423F3E')}
              onMouseLeave={(e) => resolved.inStock && (e.currentTarget.style.backgroundColor = '#362222')}
            >
              {resolved.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Success Message */}
            {showAddedMessage && (
              <div className="absolute top-full left-0 right-0 mt-2 py-2 px-4 text-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: '#8B4545' }}>
                ✓ Added to cart!
              </div>
            )}
          </div>
        )}

        {/* SKU Display */}
        {resolved && (
          <div className="mt-6 text-xs text-gray-500 font-medium tracking-wider">
            SKU: {resolved.sku}
          </div>
        )}
      </div>
    </div>
  );
}