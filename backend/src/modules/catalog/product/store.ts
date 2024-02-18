import { prismaClient } from '../../../../prisma/client';
import { Product, CreateProductPayload, UpdateProductPayload } from './types';
interface Store {
  create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product>;
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product | null>;
  update(product: UpdateProductPayload): Promise<Product>;
  delete(id: string): Promise<boolean>;
}

class ProductStore implements Store {
  async create(product: CreateProductPayload): Promise<Product> {
    return await prismaClient.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return await prismaClient.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return await prismaClient.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(product: UpdateProductPayload): Promise<Product> {
    return await prismaClient.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await prismaClient.product.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}

export { Store, ProductStore };
