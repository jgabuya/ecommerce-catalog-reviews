import { Product } from '@prisma/client';

export type CreateProductPayload = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateProductPayload = Omit<Product, 'createdAt' | 'updatedAt'>;

export { Product };
