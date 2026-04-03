import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedSection from '@/components/FeaturedSection';
import NosotrosSection from '@/components/NosotrosSection';
import BannerSection from '@/components/BannerSection';
import EnviosSection from '@/components/EnviosSection';

export default function HomePage() {
  return (
    <main style={{ marginTop: '62px' }}>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <NosotrosSection />
      <BannerSection />
      <EnviosSection />
    </main>
  );
}
