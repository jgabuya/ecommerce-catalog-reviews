import { prismaClient } from '../../../../prisma/client'
import { withCache, clearCache } from '../../../utils/redis'
import { Product, CreateProductPayload, UpdateProductPayload } from './types'
interface Store {
  create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'averageRating'>,
  ): Promise<Product>
  findAll(): Promise<Product[]>
  findOne(id: string): Promise<Product | null>
  update(product: UpdateProductPayload): Promise<Product>
  delete(id: string): Promise<boolean>
}

class ProductStore implements Store {
  async create(product: CreateProductPayload): Promise<Product> {
    return await prismaClient.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
      },
    })
  }

  async findAll(): Promise<Product[]> {
    return await withCache(
      'products',
      () => prismaClient.$queryRaw`
        SELECT p.*, AVG(pr.rating) as averageRating
        FROM Product p
        LEFT JOIN ProductReview pr ON p.id = pr.productId
        GROUP BY p.id
      `,
    )
  }

  async findOne(id: string): Promise<Product | null> {
    return await withCache(
      `product:${id}`,
      () =>
        prismaClient.$queryRaw`
        SELECT p.*, AVG(pr.rating) as averageRating
        FROM Product p
        LEFT JOIN ProductReview pr ON p.id = pr.productId
        WHERE p.id = ${id}
      `,
    )
  }

  async update(product: UpdateProductPayload): Promise<Product> {
    const data = await prismaClient.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
      },
    })

    await clearCache(`product:${product.id}`)
    return data
  }

  async delete(id: string): Promise<boolean> {
    await prismaClient.product.delete({
      where: {
        id: id,
      },
    })

    await clearCache(`product:${id}`)
    return true
  }
}

export { Store, ProductStore }
