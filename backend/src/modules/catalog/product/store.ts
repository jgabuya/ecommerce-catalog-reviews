import { PrismaClient } from '@prisma/client';
import { Product } from './model';

interface Store<T> {
  create(product: T): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  update(product: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

class ProductStore implements Store<Product> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(product: Product): Promise<Product> {
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

  public async update(product: Product): Promise<Product> {
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
