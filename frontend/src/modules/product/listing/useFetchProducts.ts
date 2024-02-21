import useSWR from 'swr';
import { Product } from '../types';

export function useFetchProducts() {
  const url = 'http://localhost:9000/products';
  const fetcher = async function (): Promise<Product[]> {
    return fetch(url).then(res => res.json());
  };

  return useSWR(url, fetcher);
}
