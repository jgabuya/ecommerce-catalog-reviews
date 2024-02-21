import { GetServerSideProps } from 'next';
import { Product } from '@/modules/product/types';
import { ProductListingPage } from '@/modules/product/listing/ProductListingPage';

export default function Home({ products }: { products: Product[] }) {
  return <ProductListingPage products={products} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const props: { [key: string]: any } = {};

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/products`);
    props.products = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props,
  };
};
