import { Product, ProductCategory } from '@prisma/client'

export type CreateProductPayload = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'averageRating'
>

export type UpdateProductPayload = Omit<
  Product,
  'createdAt' | 'updatedAt' | 'averageRating'
>

export type ProductWithCategoryAndAverageRating = Product & {
  category: Partial<ProductCategory>
  averageRating: number
}

export { Product }
