import { GetServerSideProps, NextPage } from 'next';
import { Product } from '@/modules/product/types';
import { ProductListingContainer } from '@/modules/product/listing/ProductListingContainer';
import { Nav } from '@/components/Nav';

const Home: NextPage<{ products: Product[] }> = ({ products }) => {
  if (!products) return <div>failed to load products</div>;

  return (
    <>
      <Nav />
      <ProductListingContainer products={products} />;
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props: { [key: string]: any } = {};

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
    );
    props.products = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props,
  };
};

export default Home;
