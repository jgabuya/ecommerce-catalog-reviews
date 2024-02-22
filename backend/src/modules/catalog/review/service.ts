import { Store } from './store'
import {
  ProductReview,
  ProductReviewWithUser,
  CreateProductReviewPayload,
  UpdateProductReviewPayload,
} from './types'
import { ProductServiceInterface } from '../product/service'
import { UserServiceInterface } from '../../user/service'
import { User } from '../../user/types'
import xss from 'xss'
import pick from 'lodash/pick'

class ProductReviewService {
  store: Store
  productService: ProductServiceInterface
  userService: UserServiceInterface

  constructor(
    store: Store,
    productService: ProductServiceInterface,
    userService: UserServiceInterface,
  ) {
    this.store = store
    this.productService = productService
    this.userService = userService
  }

  async create(review: CreateProductReviewPayload): Promise<ProductReview> {
    // check if productId exists
    const product = await this.productService.findOne(review.productId)

    if (!product) {
      throw new Error(`Product with id ${review.productId} not found`)
    }

    // check if user exists
    const user = await this.userService.findById(review.userId)

    if (!user) {
      throw new Error(`User with id ${review.userId} not found`)
    }

    // check if user already reviewed the product
    const existingReview = await this.store.findMany({
      productId: review.productId,
      filter: { userId: review.userId },
    })

    if (existingReview.length > 0) {
      throw new Error('User already reviewed the product')
    }

    return await this.store.create({
      ...review,
      // prevent xss attack
      comment: xss(review.comment),
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
    const reviews = await this.store.findMany(query)

    return reviews.map((review) => ({
      ...review,
      // remove user password
      user: pick(review.user, 'id', 'name'),
    }))
  }

  async findOne(id: string): Promise<ProductReview | null> {
    return await this.store.findOne(id)
  }

  async update(
    review: UpdateProductReviewPayload,
    user: User,
  ): Promise<ProductReview> {
    const existingReview = await this.store.findOne(review.id)

    if (!existingReview) {
      throw new Error(`Review with id ${review.id} not found`)
    }

    // check if user is the owner of the review
    if (existingReview.userId !== user.id) {
      throw new Error('Unauthorized')
    }

    return await this.store.update(review)
  }

  async delete(id: string): Promise<boolean> {
    const existingReview = await this.store.findOne(id)

    if (!existingReview) {
      throw new Error(`Review with id ${id} not found`)
    }

    return await this.store.delete(id)
  }
}

export { ProductReviewService }
