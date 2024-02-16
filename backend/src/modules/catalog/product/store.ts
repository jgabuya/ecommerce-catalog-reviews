import { PrismaClient } from '@prisma/client';
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
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(product: CreateProductPayload): Promise<Product> {
    return await this.prisma.product.create({
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

  public async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  public async findOne(id: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  public async update(product: UpdateProductPayload): Promise<Product> {
    return await this.prisma.product.update({
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

  public async delete(id: string): Promise<boolean> {
    await this.prisma.product.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}

export { Store, ProductStore };
