import { prismaClient } from '../../../../prisma/client'
import { withCache, clearCache } from '../../../utils/redis'
import {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  ProductWithCategory,
} from './types'
import { omit } from 'lodash'
interface Store {
  create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'averageRating'>,
  ): Promise<Product>
  findAll(): Promise<ProductWithCategory[]>
  findOne(id: string): Promise<ProductWithCategory | null>
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

  async findAll(): Promise<ProductWithCategory[]> {
    return await withCache('products', async () => {
      const products = await prismaClient.$queryRaw`
        SELECT p.*, AVG(pr.rating) as averageRating, c.name as categoryName
        FROM Product p
        LEFT JOIN ProductReview pr ON p.id = pr.productId
        LEFT JOIN ProductCategory c ON c.id = p.categoryId
        GROUP BY p.id
      `

      return (products as (Product & { categoryName: string })[]).map(
        (product) => {
          return {
            ...omit(product, 'categoryName'),
            category: {
              name: product.categoryName,
            },
          }
        },
      )
    })
  }

  async findOne(id: string): Promise<ProductWithCategory | null> {
    return await withCache(`product:${id}`, async () => {
      const products: (Product & { categoryName: string })[] =
        await prismaClient.$queryRaw`
        SELECT p.*, AVG(pr.rating) as averageRating, c.name as categoryName
        FROM Product p
        LEFT JOIN ProductReview pr ON p.id = pr.productId
        LEFT JOIN ProductCategory c ON c.id = p.categoryId
        WHERE p.id = ${id}
      `

      return {
        ...omit(products[0], 'categoryName'),
        category: {
          name: products[0].categoryName,
        },
      }
    })
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
