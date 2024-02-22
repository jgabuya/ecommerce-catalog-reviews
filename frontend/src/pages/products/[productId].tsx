import React from 'react';
import { Product } from '@/modules/product/types';
import { NextPage, GetServerSideProps } from 'next';
import { ProductDetailsContainer } from '@/modules/product/details/ProductDetailsContainer';
import { Nav } from '@/components/Nav';

const ProductDetails: NextPage<{ product: Product }> = ({ product }) => {
  if (!product) return <div>failed to load product</div>;

  return (
    <>
      <Nav />
      <ProductDetailsContainer product={product} />
    </>
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
