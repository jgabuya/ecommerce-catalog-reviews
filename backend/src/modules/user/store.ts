import { prismaClient } from '../../../prisma/client';
import { User, CreateUserPayload } from './types';

interface Store {
  create(user: CreateUserPayload): Promise<User>;
  findOne(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

export class UserStore implements Store {
  async create(user: CreateUserPayload) {
    return prismaClient.user.create({ data: user });
  }

  async findOne(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }
}
