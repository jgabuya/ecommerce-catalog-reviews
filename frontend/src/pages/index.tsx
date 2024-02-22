import { GetServerSideProps, NextPage } from 'next';
import { ProductWithCategory } from '@/modules/product/types';
import { ProductListingContainer } from '@/modules/product/listing/ProductListingContainer';
import { Layout } from '@/components/Layout';

const Home: NextPage<{ products: ProductWithCategory[] }> = ({ products }) => {
  if (!products) return <div>failed to load products</div>;

  return (
    <Layout>
      <ProductListingContainer products={products} />;
    </Layout>
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
