import { User } from '@prisma/client'

export type CreateUserPayload = Pick<User, 'email' | 'password' | 'name'>
export type UserResponse = Omit<User, 'password'>

export { User }
