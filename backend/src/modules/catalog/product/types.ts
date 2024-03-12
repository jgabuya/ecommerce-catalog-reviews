import { Product, ProductCategory, Prisma } from '@prisma/client'

export type ProductCreatePayload = Prisma.ProductCreateInput

export type ProductUpdatePayload = Prisma.ProductUpdateInput

// type ddd = Prisma.ProductCategoryCreateNestedOneWithoutProductsInput

export type ProductWithCategoryAndAverageRating = Product & {
  category: Partial<ProductCategory>
  averageRating: number
}

export { Product }
