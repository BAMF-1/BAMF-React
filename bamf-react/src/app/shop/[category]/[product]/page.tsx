import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import VariantSelector from '@/components/VariantSelector';
import { fetchCategories, fetchGroupDetail } from '@/lib/api-client';
import OpenAiPopup from './openAiPopup';
import ProductReviews from './productReviews';

type Props = {
  params: Promise<{ category: string; product: string }>;
  searchParams?: Promise<{ sku?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const title = `${decodeURIComponent(resolvedParams.product)} • ${decodeURIComponent(resolvedParams.category)} • Shop`;
  return { title };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams.category;
  const productSlug = resolvedParams.product;
  const sku = resolvedSearchParams?.sku;

  let group;
  try {
    group = await fetchGroupDetail(productSlug, sku);
  } catch (err) {
    notFound();
  }

  const categories = await fetchCategories();
  const cat = categories.find(c => c.slug === categorySlug);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#171010' }}>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: cat?.name || categorySlug, href: `/shop/${categorySlug}` },
            { label: group.name }
          ]}
        />
        <div className="mt-8">
          <VariantSelector group={group} initialSku={sku} />
        </div>
        
        <ProductReviews groupSlug={group.groupSlug} />

        <div className="ai-popup ">
          <OpenAiPopup groupSlug={group.groupSlug} />
        </div>
      </div>
    </div>
  );
}