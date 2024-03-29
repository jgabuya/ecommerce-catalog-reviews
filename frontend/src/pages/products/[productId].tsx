import React from 'react';
import { ProductWithCategory } from '@/modules/product/types';
import { NextPage, GetServerSideProps } from 'next';
import { ProductDetailsContainer } from '@/modules/product/details/ProductDetailsContainer';
import { Layout } from '@/components/Layout';

const ProductDetails: NextPage<{ product: ProductWithCategory }> = ({
  product,
}) => {
  if (!product) return <div>failed to load product</div>;

  return (
    <Layout>
      <ProductDetailsContainer product={product} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const props: { [key: string]: any } = {};

  try {
    const { params } = context;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${params?.productId}`,
    );
    props.product = await response.json();
  } catch (e) {
    console.error(e);
  }

  return {
    props,
  };
};

export default ProductDetails;
