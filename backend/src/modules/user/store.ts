import { prismaClient } from '../../../prisma/client'
import { withCache } from '../../utils/redis'
import { User, CreateUserPayload } from './types'

interface Store {
  create(user: CreateUserPayload): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

class UserStore implements Store {
  async create(user: CreateUserPayload) {
    return prismaClient.user.create({ data: user })
  }

  async findByEmail(email: string) {
    return withCache(`user:${email}`, () =>
      prismaClient.user.findUnique({ where: { email } }),
    )
  }

  async findById(id: string) {
    return withCache(`user:${id}`, () =>
      prismaClient.user.findUnique({ where: { id } }),
    )
  }
}

export { UserStore, Store }
