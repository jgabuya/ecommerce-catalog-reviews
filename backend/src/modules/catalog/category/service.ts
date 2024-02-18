import {
  ProductCategory,
  CreateProductCategoryPayload,
  UpdateProductCategoryPayload,
} from './types'
import { Store } from './store'

export class ProductCategoryService {
  private store: Store

  constructor(store: Store) {
    this.store = store
  }

  async create(
    category: CreateProductCategoryPayload,
  ): Promise<ProductCategory> {
    return await this.store.create(category)
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.store.findAll()
  }

  async findOne(id: string): Promise<ProductCategory | null> {
    return await this.store.findOne(id)
  }

  async update(
    category: UpdateProductCategoryPayload,
  ): Promise<ProductCategory> {
    const existingCategory = await this.store.findOne(category.id)
    if (!existingCategory) {
      throw new Error(`Category with id ${category.id} not found`)
    }

    return await this.store.update(category)
  }

  async delete(id: string): Promise<boolean> {
    const existingCategory = await this.store.findOne(id)
    if (!existingCategory) {
      throw new Error(`Category with id ${id} not found`)
    }

    return await this.store.delete(id)
  }
}
