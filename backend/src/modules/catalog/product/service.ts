import {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  ProductWithCategory,
} from './types'
import { Store } from './store'

// extract an interface from ProductService
export interface ProductServiceInterface {
  create(product: CreateProductPayload): Promise<Product>
  findAll(): Promise<ProductWithCategory[]>
  findOne(id: string): Promise<ProductWithCategory | null>
  update(product: UpdateProductPayload): Promise<Product>
  delete(id: string): Promise<boolean>
}

export class ProductService implements ProductServiceInterface {
  private store: Store

  constructor(store: Store) {
    this.store = store
  }

  async create(product: CreateProductPayload): Promise<Product> {
    return await this.store.create(product)
  }

  async findAll(): Promise<ProductWithCategory[]> {
    return await this.store.findAll()
  }

  async findOne(id: string): Promise<ProductWithCategory | null> {
    return await this.store.findOne(id)
  }

  async update(product: UpdateProductPayload): Promise<Product> {
    const existingProduct = await this.store.findOne(product.id)

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
