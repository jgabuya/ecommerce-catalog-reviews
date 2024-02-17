import { Product, CreateProductPayload, UpdateProductPayload } from './types';
import { Store } from './store';
export class ProductService {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async create(product: CreateProductPayload): Promise<Product> {
    return await this.store.create(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.store.findAll();
  }

  async findOne(id: string): Promise<Product | null> {
    return await this.store.findOne(id);
  }

  async update(product: UpdateProductPayload): Promise<Product> {
    const existingProduct = await this.store.findOne(product.id);

    if (!existingProduct) {
      throw new Error(`Product with id ${product.id} not found`);
    }

    return await this.store.update(product);
  }

  async delete(id: string): Promise<boolean> {
    const existingProduct = await this.store.findOne(id);

    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    return await this.store.delete(id);
  }
}
