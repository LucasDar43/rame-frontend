import { Suspense } from 'react';
import type { Metadata } from 'next';

import BannerSection from '@/components/BannerSection';
import CategoriesSection from '@/components/CategoriesSection';
import EnviosSection from '@/components/EnviosSection';
import FeaturedSection from '@/components/FeaturedSection';
import FeaturedSectionSkeleton from '@/components/FeaturedSectionSkeleton';
import HeroSection from '@/components/HeroSection';
import NosotrosSection from '@/components/NosotrosSection';
import { getProductosDestacados } from '@/lib/api';
import { Producto } from '@/types';

export const metadata: Metadata = {
  title: "Rame Indumentaria | Ropa deportiva en Rosario",
  description: "Tienda online de ropa deportiva para hombre y mujer. Envíos a todo el país, retiro en local y productos originales.",
};

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
