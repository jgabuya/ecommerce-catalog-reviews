import { prismaClient } from '../../../../prisma/client'
import { withCache, clearCache } from '../../../utils/redis'
import {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductWithCategoryAndAverageRating,
} from './types'
import { omit } from 'lodash'
interface Store {
  create(product: ProductCreatePayload): Promise<Product>
  findAll(): Promise<ProductWithCategoryAndAverageRating[]>
  findOne(id: string): Promise<ProductWithCategoryAndAverageRating | null>
  update(product: ProductUpdatePayload): Promise<Product>
  delete(id: string): Promise<boolean>
}

class ProductStore implements Store {
  async create(product: ProductCreatePayload): Promise<Product> {
    return await prismaClient.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: {
          connect: {
            id: product.category.connect?.id,
          },
        },
      },
    })
  }

  async findAll(): Promise<ProductWithCategoryAndAverageRating[]> {
    return await withCache('products', async () => {
      const products = await prismaClient.$queryRaw`
        SELECT p.*, AVG(pr.rating) as averageRating, c.name as categoryName
        FROM Product p
        LEFT JOIN ProductReview pr ON p.id = pr.productId
        LEFT JOIN ProductCategory c ON c.id = p.categoryId
        GROUP BY p.id
      `

      return (
        products as (Product & {
          averageRating: number
          categoryName: string
        })[]
      ).map((product) => {
        return {
          ...omit(product, 'categoryName'),
          category: {
            name: product.categoryName,
          },
        }
      })
    })
  }

  async findOne(
    id: string,
  ): Promise<ProductWithCategoryAndAverageRating | null> {
    return await withCache(`product:${id}`, async () => {
      const products: (Product & {
        categoryName: string
        averageRating: number
      })[] = await prismaClient.$queryRaw`
        SELECT p.*, AVG(pr.rating) as averageRating, c.name as categoryName
        FROM Product p
        LEFT JOIN ProductReview pr ON p.id = pr.productId
        LEFT JOIN ProductCategory c ON c.id = p.categoryId
        WHERE p.id = ${id}
      `

      // If the product id is null, return null
      if (products[0].id === null) {
        return null
      }

      return {
        ...omit(products[0], 'categoryName'),
        category: {
          name: products[0].categoryName,
        },
      }
    })
  }

  async update(product: ProductUpdatePayload): Promise<Product> {
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
