import { ProductReviewService } from './service';
import { Store } from './store';
import {
  ProductReview,
  CreateProductReviewPayload,
  UpdateProductReviewPayload,
} from './types';
import { omit } from 'lodash';

describe('ProductReviewService', () => {
  let store: jest.Mocked<Store>;
  let service: ProductReviewService;

  const mockProductReviews: ProductReview[] = [
    {
      id: '1',
      productId: '1',
      rating: 5,
      comment: 'Test Comment',
    },
    {
      id: '2',
      productId: '1',
      rating: 5,
      comment: 'Test Comment',
    },
    {
      id: '3',
      productId: '2',
      rating: 5,
      comment: 'Test Comment',
    },
    {
      id: '4',
      productId: '2',
      rating: 1,
      comment: 'Test Comment',
    },
    {
      id: '5',
      productId: '2',
      rating: 1,
      comment: 'Test Comment',
    },
  ].map(review => ({
    ...review,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  beforeEach(() => {
    store = {
      create: jest.fn().mockResolvedValue(mockProductReviews[0]),
      findMany: jest.fn().mockResolvedValue(mockProductReviews),
      findOne: jest
        .fn()
        .mockImplementation(
          async (id: string): Promise<ProductReview | null> => {
            return Promise.resolve(
              mockProductReviews.find(review => id === review.id) || null,
            );
          },
        ),
      update: jest.fn().mockResolvedValue(mockProductReviews[0]),
      delete: jest.fn(),
    };

    const productService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ProductReviewService(store, productService);
  });

  it('should create a review', async () => {
    const mockProductPayload = omit(mockProductReviews[0], [
      'id',
      'createdAt',
      'updatedAt',
    ]);

    const product: CreateProductReviewPayload = mockProductPayload;

    jest.spyOn(service.productService, 'findOne').mockResolvedValue({
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      categoryId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.create(product);
    expect(store.create).toHaveBeenCalledWith(product);
  });

  it('should not create a review if the given productId is not found', async () => {
    const mockProductPayload = omit(mockProductReviews[0], [
      'id',
      'createdAt',
      'updatedAt',
    ]);

    const product: CreateProductReviewPayload = mockProductPayload;

    jest.spyOn(service.productService, 'findOne').mockResolvedValue(null);

    await expect(service.create(product)).rejects.toThrow();
  });

  it('should find many reviews', async () => {
    const query = {
      productId: '1',
      page: 1,
      limit: 5,
      sort: 'createdAt' as 'rating' | 'createdAt' | 'updatedAt',
    };

    await service.findMany(query);
    expect(store.findMany).toHaveBeenCalledWith(query);
  });

  it('should find one review', async () => {
    const id = '1';
    await service.findOne(id);
    expect(store.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a review', async () => {
    const review: UpdateProductReviewPayload = omit(mockProductReviews[0], [
      'createdAt',
      'updatedAt',
      'productId',
    ]);

    await service.update(review);
    expect(store.update).toHaveBeenCalledWith(review);
  });

  it('should not update a review if the given id is not found', async () => {
    const review: UpdateProductReviewPayload = omit(
      {
        ...mockProductReviews[0],
        id: 'non-existing-id',
      },
      ['createdAt', 'updatedAt'],
    );

    await expect(service.update(review)).rejects.toThrow();
  });

  it('should delete a review', async () => {
    const id = '1';
    await service.delete(id);
    expect(store.delete).toHaveBeenCalledWith(id);
  });

  it('should not delete a review if the given id is not found', async () => {
    const id = 'non-existing-id';
    await expect(service.delete(id)).rejects.toThrow();
  });
});
