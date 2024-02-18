import { User } from '@prisma/client'

export type CreateUserPayload = Pick<User, 'email' | 'password'>
export type UserResponse = Omit<User, 'password'>

export { User }
