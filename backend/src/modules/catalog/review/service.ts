import { Store } from './store';
import {
  ProductReview,
  CreateProductReviewPayload,
  UpdateProductReviewPayload,
} from './types';

class ProductReviewService {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async create(review: CreateProductReviewPayload): Promise<ProductReview> {
    return await this.store.create(review);
  }

  async findAll(): Promise<ProductReview[]> {
    return await this.store.findAll();
  }

  async findOne(id: string): Promise<ProductReview | null> {
    return await this.store.findOne(id);
  }

  async update(review: UpdateProductReviewPayload): Promise<ProductReview> {
    const existingReview = await this.store.findOne(review.id);

    if (!existingReview) {
      throw new Error(`Review with id ${review.id} not found`);
    }

    return await this.store.update(review);
  }

  async delete(id: string): Promise<Boolean> {
    const existingReview = await this.store.findOne(id);

    if (!existingReview) {
      throw new Error(`Review with id ${id} not found`);
    }

    return await this.store.delete(id);
  }
}

export { ProductReviewService };
