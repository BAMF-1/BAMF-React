// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GroupedProductCard } from '@/lib/shop-types';

export default function ProductCard({
  product,
  categorySlug,
}: {
  product: GroupedProductCard;
  categorySlug: string;
}) {
  const priceText =
    product.minPrice === product.maxPrice
      ? `$${product.minPrice.toFixed(2)}`
      : `From $${product.minPrice.toFixed(2)}`;

  // CRITICAL FIX: Use groupSlug (or fallback to groupId), NOT sampleSku!
  const productIdentifier = product.groupSlug || product.groupId;
  
  if (!productIdentifier) {
    console.warn('⚠️ Product missing both groupSlug and groupId:', product);
    return null;
  }

  // Build the correct URL: /shop/{category}/{GROUP_IDENTIFIER}?sku={variant}
  const href = `/shop/${encodeURIComponent(categorySlug)}/${encodeURIComponent(
    productIdentifier
  )}${product.sampleSku ? `?sku=${encodeURIComponent(product.sampleSku)}` : ''}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition"
    >
      <div className="aspect-square bg-gray-50 relative">
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={product.groupName}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>
        )}
        {!product.anyInStock && (
          <span className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">Sold out</span>
        )}
      </div>

      <div className="p-3">
        <div className="font-medium line-clamp-2">{product.groupName}</div>
        <div className="mt-1 text-sm text-gray-600">{priceText}</div>
        
        {/* METADATA DISPLAY - Shows if available */}
        {(product.description || product.brand || product.material) && (
          <div className="mt-2 text-xs text-gray-500 space-y-0.5">
            {product.brand && (
              <div className="truncate">
                <span className="font-semibold">Brand:</span> {product.brand}
              </div>
            )}
            {product.material && (
              <div className="truncate">
                <span className="font-semibold">Material:</span> {product.material}
              </div>
            )}
            {product.description && (
              <div className="line-clamp-2">
                <span className="font-semibold">Desc:</span> {product.description}
              </div>
            )}
          </div>
        )}
        
        {product.totalVariants > 1 && (
          <div className="mt-1 text-xs text-gray-500">{product.totalVariants} options</div>
        )}
      </div>
    </Link>
  );
}