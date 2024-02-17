import {
  ProductCategory,
  CreateProductCategoryPayload,
  UpdateProductCategoryPayload,
} from './types';
import { prismaClient } from '../../../../prisma/client';

interface Store {
  create(category: CreateProductCategoryPayload): Promise<ProductCategory>;
  findAll(): Promise<ProductCategory[]>;
  findOne(id: string): Promise<ProductCategory | null>;
  update(category: UpdateProductCategoryPayload): Promise<ProductCategory>;
  delete(id: string): Promise<boolean>;
}

class ProductCategoryStore implements Store {
  public async create(
    category: CreateProductCategoryPayload,
  ): Promise<ProductCategory> {
    return await prismaClient.productCategory.create({
      data: {
        name: category.name,
      },
    });
  }

  public async findAll(): Promise<ProductCategory[]> {
    return await prismaClient.productCategory.findMany();
  }

  public async findOne(id: string): Promise<ProductCategory | null> {
    return await prismaClient.productCategory.findUnique({
      where: {
        id: id,
      },
    });
  }

  public async update(
    category: UpdateProductCategoryPayload,
  ): Promise<ProductCategory> {
    return await prismaClient.productCategory.update({
      where: {
        id: category.id,
      },
      data: {
        name: category.name,
      },
    });
  }

  public async delete(id: string): Promise<boolean> {
    await prismaClient.productCategory.delete({
      where: {
        id: id,
      },
    });
    return true;
  }
}

export { Store, ProductCategoryStore };
