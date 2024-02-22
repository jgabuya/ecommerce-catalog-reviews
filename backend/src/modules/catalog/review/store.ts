import {
  ProductReview,
  CreateProductReviewPayload,
  UpdateProductReviewPayload,
  ProductReviewWithUser,
} from './types'
import { prismaClient } from '../../../../prisma/client'
import { withCache, clearCache } from '../../../utils/redis'

interface Store {
  create(review: CreateProductReviewPayload): Promise<ProductReview>
  findMany(query?: {
    productId: string
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    filter?: Partial<ProductReview>
  }): Promise<ProductReviewWithUser[]>
  findOne(id: string): Promise<ProductReview | null>
  update(review: UpdateProductReviewPayload): Promise<ProductReview>
  delete(id: string): Promise<boolean>
}

class ProductReviewStore implements Store {
  async create(review: CreateProductReviewPayload): Promise<ProductReview> {
    return await prismaClient.productReview.create({
      data: {
        rating: review.rating,
        comment: review.comment,
        product: {
          connect: {
            id: review.productId,
          },
        },
        user: {
          connect: {
            id: review.userId,
          },
        },
      },
    })
  }

  async findMany(query?: {
    productId: string
    page?: number
    limit?: number
    sort?: 'createdAt' | 'updatedAt' | 'rating'
    order?: 'asc' | 'desc'
    filter?: Pick<ProductReview, 'rating'>
  }): Promise<ProductReviewWithUser[]> {
    const {
      page = 1,
      limit = 5,
      sort,
      order = 'desc',
      filter,
      productId,
    } = query || {}
    const skip = (page - 1) * limit
    const take = limit
    const where: Partial<ProductReview> = { productId }
    let orderBy

    if (sort) {
      orderBy = {
        [sort]: order,
      }
    }

    if (filter) {
      where.rating = filter.rating
    }

    const params = {
      skip,
      take,
      orderBy,
      where,
      include: {
        user: true,
      },
    }

    return await withCache(`reviews:${JSON.stringify(params)}`, () =>
      prismaClient.productReview.findMany(params),
    )
  }

  async findOne(id: string): Promise<ProductReview | null> {
    return await withCache(`review:${id}`, () =>
      prismaClient.productReview.findUnique({
        where: {
          id: id,
        },
      }),
    )
  }

  async update(review: UpdateProductReviewPayload): Promise<ProductReview> {
    const data = await prismaClient.productReview.update({
      where: {
        id: review.id,
      },
      data: {
        rating: review.rating,
        comment: review.comment,
      },
    })

    await clearCache(`review:${review.id}`)
    return data
  }

  async delete(id: string): Promise<boolean> {
    await prismaClient.productReview.delete({
      where: {
        id: id,
      },
    })

    await clearCache(`review:${id}`)
    return true
  }
}

export { Store, ProductReviewStore }
