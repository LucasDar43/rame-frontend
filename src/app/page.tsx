import { Suspense } from 'react';

import BannerSection from '@/components/BannerSection';
import CategoriesSection from '@/components/CategoriesSection';
import EnviosSection from '@/components/EnviosSection';
import FeaturedSection from '@/components/FeaturedSection';
import FeaturedSectionSkeleton from '@/components/FeaturedSectionSkeleton';
import HeroSection from '@/components/HeroSection';
import NosotrosSection from '@/components/NosotrosSection';
import { getProductosDestacados } from '@/lib/api';
import { Producto } from '@/types';

export default async function HomePage() {
  const productos = await getProductosDestacados().catch(() => [] as Producto[]);

  return (
    <main style={{ marginTop: '62px' }}>
      <HeroSection />
      <CategoriesSection />
      <Suspense fallback={<FeaturedSectionSkeleton />}>
        <FeaturedSection productos={productos} />
      </Suspense>
      <NosotrosSection />
      <BannerSection />
      <EnviosSection />
    </main>
  );
}
