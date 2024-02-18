import { PrismaClient } from '@prisma/client'
import { ProductCategory } from '../src/modules/catalog/category/types'
import { CreateProductPayload } from '../src/modules/catalog/product/types'
import { Product } from '../src/modules/catalog/product/types'
import { User, CreateUserPayload } from '../src/modules/user/types'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUsers(): Promise<User[]> {
  const usersPayload: CreateUserPayload[] = [
    {
      email: 'test@mail.com',
      password: bcrypt.hashSync('123456', 10),
    },
    {
      email: 'test2@mail.com',
      password: bcrypt.hashSync('123456', 10),
    },
  ]

  const users = await Promise.all(
    usersPayload.map((user) => {
      return prisma.user.create({
        data: user,
      })
    }),
  )

  return users
}

async function createCategories() {
  const categoryNames = ['Electronics', 'Kitchen', 'Books']

  const categories = await Promise.all(
    categoryNames.map((name) => {
      return prisma.productCategory.create({
        data: {
          name,
        },
      })
    }),
  )

  return categories
}

async function createProducts(categories: ProductCategory[]) {
  const productsPayload: CreateProductPayload[] = Array.from({
    length: 15,
  }).map((_, index) => ({
    name: `Product ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    categoryId: categories[Math.floor(Math.random() * categories.length)].id,
    price: Math.floor(Math.random() * 1000),
    stock: Math.floor(Math.random() * 50),
  }))

  const products = await Promise.all(
    productsPayload.map((product) => {
      return prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        },
      })
    }),
  )

  return products
}

async function createProductReviews(products: Product[], users: User[]) {
  const reviewsPayload = Array.from({
    length: 13,
  }).map((_, index) => ({
    rating: Math.floor(Math.random() * 5) + 1,
    comment: `Test Comment ${index + 1}`,
    userId: users[Math.floor(Math.random() * users.length)].id,
  }))

  const reviews = await Promise.all(
    products.flatMap((product) => {
      return reviewsPayload.map((review) => {
        return prisma.productReview.create({
          data: {
            ...review,
            productId: product.id,
          },
        })
      })
    }),
  )

  return reviews
}

async function seed() {
  const users = await createUsers()
  const categories = await createCategories()
  const products = await createProducts(categories)
  await createProductReviews(products, users)

  await prisma.$disconnect()
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
