import { Product, Prisma } from '@prisma/client'

export type CreateProductPayload = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'averageRating'
>

export type UpdateProductPayload = Omit<
  Product,
  'createdAt' | 'updatedAt' | 'averageRating'
>

type WithCategory = Prisma.ProductGetPayload<{
  include: { category: true }
}>

export type ProductWithCategory = Omit<WithCategory, 'category'> & {
  category: Partial<WithCategory['category']>
}

export { Product }
