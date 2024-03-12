import {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductWithCategoryAndAverageRating,
} from './types'
import { Store } from './store'

// extract an interface from ProductService
export interface ProductServiceInterface {
  create(product: ProductCreatePayload): Promise<Product>
  findAll(): Promise<ProductWithCategoryAndAverageRating[]>
  findOne(id: string): Promise<ProductWithCategoryAndAverageRating | null>
  update(product: ProductUpdatePayload): Promise<Product>
  delete(id: string): Promise<boolean>
}

export class ProductService implements ProductServiceInterface {
  private store: Store

  constructor(store: Store) {
    this.store = store
  }

  async create(product: ProductCreatePayload): Promise<Product> {
    return await this.store.create(product)
  }

  async findAll(): Promise<ProductWithCategoryAndAverageRating[]> {
    return await this.store.findAll()
  }

  async findOne(
    id: string,
  ): Promise<ProductWithCategoryAndAverageRating | null> {
    return await this.store.findOne(id)
  }

  async update(product: ProductUpdatePayload): Promise<Product> {
    const existingProduct = await this.store.findOne(product.id as string)

    if (!existingProduct) {
      throw new Error(`Product with id ${product.id} not found`)
    }

    return await this.store.update(product)
  }

  async delete(id: string): Promise<boolean> {
    const existingProduct = await this.store.findOne(id)

    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`)
    }

    return await this.store.delete(id)
  }
}
