import {
  ProductReview,
  CreateProductReviewPayload,
  UpdateProductReviewPayload,
} from './types';
import { prismaClient } from '../../../../prisma/client';

interface Store {
  create(review: CreateProductReviewPayload): Promise<ProductReview>;
  findAll(): Promise<ProductReview[]>;
  findOne(id: string): Promise<ProductReview | null>;
  update(review: UpdateProductReviewPayload): Promise<ProductReview>;
  delete(id: string): Promise<boolean>;
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
      },
    });
  }

  async findAll(): Promise<ProductReview[]> {
    return await prismaClient.productReview.findMany();
  }

  async findOne(id: string): Promise<ProductReview | null> {
    return await prismaClient.productReview.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(review: UpdateProductReviewPayload): Promise<ProductReview> {
    return await prismaClient.productReview.update({
      where: {
        id: review.id,
      },
      data: {
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await prismaClient.productReview.delete({
      where: {
        id: id,
      },
    });
    return true;
  }
}

export { Store, ProductReviewStore };
