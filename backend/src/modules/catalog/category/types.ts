import { ProductCategory } from '@prisma/client'

export type CreateProductCategoryPayload = Omit<
  ProductCategory,
  'id' | 'createdAt' | 'updatedAt'
>

export type UpdateProductCategoryPayload = Omit<
  ProductCategory,
  'createdAt' | 'updatedAt'
>

export { ProductCategory }
