import { PageTransition } from '@/components/layout'
import { Hero, FeaturedProducts, BrandStory, Newsletter } from '@/components/sections'

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <FeaturedProducts />
      <BrandStory />
      <Newsletter />
    </PageTransition>
  )
}
