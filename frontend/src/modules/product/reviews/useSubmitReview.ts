import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { CreateProductReviewPayload, ProductReviewWithUser } from '../types';
import { z } from 'zod';

export function useSubmitReview(productId: string, userId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}/reviews`;
  const { mutate } = useSWRConfig();
  const token = localStorage.getItem('token');

  const [submittedReview, setSubmittedReview] =
    useState<ProductReviewWithUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (review: CreateProductReviewPayload) => {
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const schema = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().min(1),
      });

      schema.parse(review);
    } catch (e) {
      setError('Please enter a valid comment');
      return;
    } finally {
      setSubmitting(false);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...review,
          userId,
          productId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      mutate(url);
      setSubmittedReview(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submittedReview, error, submitting };
}
