import React from 'react';
import { Product } from '@/modules/product/types';
import { Nav } from '@/components/Nav';
import { ProductCard } from '@/modules/product/listing/ProductCard';

export const ProductListingPage: React.FC<{ products?: Product[] }> = ({
  products,
}) => {
  if (!products) return <div>failed to load products</div>;

  return (
    <>
      <Nav />
      <main className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center mx-auto">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </>
  );
};
