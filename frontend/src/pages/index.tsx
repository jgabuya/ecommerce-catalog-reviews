import Image from 'next/image';
import { Inter } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { ProductCard } from '@/modules/product/listing/ProductCard';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Nav />
      <main className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center mx-auto">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </main>
    </>
  );
}
