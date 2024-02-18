import { Store } from './store';
import {
  ProductReview,
  CreateProductReviewPayload,
  UpdateProductReviewPayload,
} from './types';
import { ProductServiceInterface } from '../product/service';

class ProductReviewService {
  store: Store;
  productService: ProductServiceInterface;

  constructor(store: Store, productService: ProductServiceInterface) {
    this.store = store;
    this.productService = productService;
  }

  async create(review: CreateProductReviewPayload): Promise<ProductReview> {
    // check if productId exists
    const product = await this.productService.findOne(review.productId);

    if (!product) {
      throw new Error(`Product with id ${review.productId} not found`);
    }

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
