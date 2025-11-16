// app/shop/[category]/page.tsx
import Breadcrumbs from '@/components/Breadcrumbs';
import ListingFilters from '@/components/ListingFilters';
import ProductCard from '@/components/ProductCard';
import { fetchCategories, fetchCategoryListing, groupVariantsToProducts } from '@/lib/api-client';

type Props = {
  params: { category: string };
  searchParams: { [k: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props) {
  const title = `${decodeURIComponent(params.category)} • Shop`;
  return { title };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const categorySlug = decodeURIComponent(params.category);

  const [categories, rows] = await Promise.all([
    fetchCategories(),
    fetchCategoryListing({
      categorySlug,
      color: typeof searchParams.color === 'string' ? searchParams.color : undefined,
      size: typeof searchParams.size === 'string' ? searchParams.size : undefined,
      minPrice: typeof searchParams.min === 'string' ? searchParams.min : undefined,
      maxPrice: typeof searchParams.max === 'string' ? searchParams.max : undefined,
      sort: (typeof searchParams.sort === 'string' ? searchParams.sort : 'price-asc') as any,
      page: typeof searchParams.page === 'string' ? searchParams.page : undefined,
      pageSize: typeof searchParams.pageSize === 'string' ? searchParams.pageSize : '24',
    }),
  ]);

  // Debug: Log the first few items to see what data structure we're getting
  if (rows.length > 0) {
    console.log('Sample product data from API:', JSON.stringify(rows[0], null, 2));
  }

  const category = categories.find((c) => c.slug === categorySlug);
  const grouped = groupVariantsToProducts(rows);

  // Derive naive facets for the filter UI from rows
  const availableColors = Array.from(
    new Set(rows.map((r) => r.color).filter((x): x is string => !!x))
  ).sort((a, b) => a.localeCompare(b));
  const availableSizes = Array.from(
    new Set(rows.map((r) => r.size).filter((x): x is string => !!x))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <main className="container mx-auto px-4 py-8" style={{ backgroundColor: '#171010', minHeight: '100vh' }}>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: category?.name || categorySlug },
        ]}
      />

      <div className="flex items-end justify-between gap-4 mb-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight uppercase">{category?.name || categorySlug}</h1>
        <div className="text-sm text-gray-400 font-medium">{grouped.length} product{grouped.length === 1 ? '' : 's'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
        <ListingFilters availableColors={availableColors} availableSizes={availableSizes} />

        <section>
          {grouped.length === 0 ? (
            <div className="text-gray-300 text-lg">No products match your filters. Try clearing some options.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {grouped.filter((p) => p.groupId).map((p, index) => (
                <ProductCard key={p.groupId!} product={{ ...p, groupId: p.groupId! }} categorySlug={categorySlug} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
