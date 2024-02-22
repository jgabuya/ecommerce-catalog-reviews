import { ProductReview, Prisma } from '@prisma/client'

export type CreateProductReviewPayload = Pick<
  ProductReview,
  'rating' | 'comment' | 'productId' | 'userId'
>

export type UpdateProductReviewPayload = Pick<
  ProductReview,
  'id' | 'rating' | 'comment'
>

type WithUser = Prisma.ProductReviewGetPayload<{
  include: { user: true }
}>

export type ProductReviewWithUser = Omit<WithUser, 'user'> & {
  user: Partial<WithUser['user']>
}

export { ProductReview }
