// app/shop/page.tsx
"use client";
import { fetchCategories } from '@/lib/api-client';
import { Item, itemService } from '@/lib/services/adminServices';
import type { Category } from '@/lib/shop-types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ShopLanding() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  const fetchAllItems = async (): Promise<Item[]> => {
    try {
      let pageNumber = 1;
      const pageSize = 30;
      let items: Item[] = [];
      let fetchedItems: Item[] = [];

      do {
        const response = await itemService.getAll(pageNumber, pageSize);
        if (response.status !== 200 || !response.data) {
          throw new Error('Failed to fetch items');
        }
        fetchedItems = response.data;
        items = items.concat(fetchedItems);
        pageNumber++;
      } while (fetchedItems.length === pageSize);

      return items;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories and items in parallel
        const [categoriesData, itemsData] = await Promise.all([
          fetchCategories().catch(() => []),
          fetchAllItems()
        ]);

        setCategories(categoriesData);
        setAllItems(itemsData);
        setDisplayedItems(itemsData.slice(0, itemsPerPage));
      } catch (err) {
        setError('Failed to load shop data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedItems(allItems.slice(startIndex, endIndex));
  }, [currentPage, allItems]);

  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8" style={{ backgroundColor: '#171010', minHeight: '100vh' }}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading shop...</p>
        </div>
      </main>
    );
  }

  if (categories.length === 0 && allItems.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8" style={{ backgroundColor: '#171010', minHeight: '100vh' }}>
        <div className="text-center py-12">
          <p className="text-gray-300 mb-4">Backend API is not available. Please start the backend server.</p>
          <p className="text-sm text-gray-400">Expected API at: https://localhost:7039</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8" style={{ backgroundColor: '#171010', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-2 text-white tracking-tight">SHOP</h1>
        <p className="text-gray-300 text-lg">Discover our collection of products</p>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${encodeURIComponent(c.slug)}`}
                className="group block p-6 border transition-all duration-200 hover:transform hover:-translate-y-1"
                style={{ backgroundColor: '#2B2B2B', borderColor: '#362222' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#362222';
                  e.currentTarget.style.borderColor = '#423F3E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2B2B2B';
                  e.currentTarget.style.borderColor = '#362222';
                }}
              >
                <div className="text-lg font-bold text-white transition-colors uppercase tracking-wide">
                  {c.name}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Explore {c.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Items Section */}
      {allItems.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white tracking-wide">ALL PRODUCTS</h2>
            <p className="text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, allItems.length)} of {allItems.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {displayedItems.map((item) => {
              // Build URL in format: /shop/{category}/{product-slug}?sku={sku}
              const categorySlug = item.mainCategory.toLowerCase().replace(/\s+/g, '-');
              const productSlug = item.slug;
              const href = `/shop/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}?sku=${encodeURIComponent(item.sku)}`;

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group block border overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                  style={{ backgroundColor: '#2B2B2B', borderColor: '#362222' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#423F3E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#362222';
                  }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#171010' }}>
                    {item.primaryImageUrl ? (
                      <Image
                        src={item.primaryImageUrl}
                        alt={item.groupName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <span className="px-4 py-2 text-white text-sm font-bold tracking-wider" style={{ backgroundColor: '#362222' }}>
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                    {item.moreVariantsCount > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 text-white text-xs font-bold tracking-wider" style={{ backgroundColor: '#362222' }}>
                        +{item.moreVariantsCount} VARIANTS
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">
                      {item.mainCategory}
                    </div>
                    <h3 className="font-bold text-white mb-2 transition-colors line-clamp-2 uppercase tracking-wide">
                      {item.groupName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <span>{item.color}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.inStock && (
                        <span className="text-xs text-green-400 font-bold tracking-wider">
                          IN STOCK
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-2 py-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {allItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg">No products available at the moment.</p>
        </div>
      )}
    </main>
  );
}
