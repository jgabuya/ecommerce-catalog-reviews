import useSWR from 'swr';
import { ProductReviewWithUser } from '../types';

const fetchReviews = async (url: string): Promise<ProductReviewWithUser[]> => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const useFetchReviews = (productId: string, options = {}) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}/reviews`;
  console.log('url', url);
  const { data, error } = useSWR(url, fetchReviews, options);

  return {
    reviews: data,
    loading: !error && !data,
    error: error,
  };
};
