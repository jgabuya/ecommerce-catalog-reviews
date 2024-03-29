import {
  ProductCategory,
  CreateProductCategoryPayload,
  UpdateProductCategoryPayload,
} from './types'
import { prismaClient } from '../../../../prisma/client'
import { withCache, clearCache } from '../../../utils/redis'

interface Store {
  create(category: CreateProductCategoryPayload): Promise<ProductCategory>
  findAll(): Promise<ProductCategory[]>
  findOne(id: string): Promise<ProductCategory | null>
  update(category: UpdateProductCategoryPayload): Promise<ProductCategory>
  delete(id: string): Promise<boolean>
}

class ProductCategoryStore implements Store {
  async create(
    category: CreateProductCategoryPayload,
  ): Promise<ProductCategory> {
    return await prismaClient.productCategory.create({
      data: {
        name: category.name,
      },
    })
  }

  async findAll(): Promise<ProductCategory[]> {
    return await withCache('categories', () =>
      prismaClient.productCategory.findMany(),
    )
  }

  async findOne(id: string): Promise<ProductCategory | null> {
    return await withCache(`category:${id}`, () =>
      prismaClient.productCategory.findUnique({
        where: {
          id: id,
        },
      }),
    )
  }

  async update(
    category: UpdateProductCategoryPayload,
  ): Promise<ProductCategory> {
    const data = await prismaClient.productCategory.update({
      where: {
        id: category.id,
      },
      data: {
        name: category.name,
      },
    })

    await clearCache(`category:${category.id}`)
    return data
  }

  async delete(id: string): Promise<boolean> {
    await prismaClient.productCategory.delete({
      where: {
        id: id,
      },
    })

    await clearCache(`category:${id}`)
    return true
  }
}

export { Store, ProductCategoryStore }
