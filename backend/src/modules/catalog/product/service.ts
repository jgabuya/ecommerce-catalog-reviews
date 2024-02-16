import { Product } from './model';
import { Store } from './store';

export class ProductService {
  private store: Store<Product>;

  constructor(store: Store<Product>) {
    this.store = store;
  }

  public async create(product: Product): Promise<Product> {
    return await this.store.create(product);
  }

  public async findAll(): Promise<Product[]> {
    return await this.store.findAll();
  }

  public async findOne(id: string): Promise<Product | null> {
    return await this.store.findOne(id);
  }

  public async update(product: Product): Promise<Product> {
    return await this.store.update(product);
  }

  public async delete(id: string): Promise<boolean> {
    return await this.store.delete(id);
  }
}
