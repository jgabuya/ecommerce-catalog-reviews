import { ProductReview } from '@prisma/client';

export type CreateProductReviewPayload = Pick<
  ProductReview,
  'rating' | 'comment' | 'productId'
>;

export type UpdateProductReviewPayload = Pick<
  ProductReview,
  'id' | 'rating' | 'comment'
>;

export { ProductReview };
