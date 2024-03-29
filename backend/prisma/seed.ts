import { PrismaClient } from '@prisma/client'
import { ProductCategory } from '../src/modules/catalog/category/types'
import { ProductCreatePayload } from '../src/modules/catalog/product/types'
import { Product } from '../src/modules/catalog/product/types'
import { User, CreateUserPayload } from '../src/modules/user/types'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUsers(): Promise<User[]> {
  const names = [
    'John Snow',
    'Arya Stark',
    'Sansa Stark',
    'Bran Stark',
    'Robb Stark',
    'Rickon Stark',
    'Ned Stark',
    'Catelyn Stark',
    'Tyrion Lannister',
    'Jaime Lannister',
    'Cersei Lannister',
    'Tywin Lannister',
    'Joffrey Baratheon',
    'Tommen Baratheon',
    'Myrcella Baratheon',
    'Robert Baratheon',
  ]

  const userPayload: CreateUserPayload = {
    email: '',
    name: '',
    password: bcrypt.hashSync('123456', 10),
  }

  const users = await prisma.$transaction(
    Array.from({
      length: 16,
    }).map((_, index) => {
      return prisma.user.create({
        data: {
          ...userPayload,
          email: `test${index + 1}@mail.com`,
          name: names[index],
        },
      })
    }),
  )

  return users
}

async function createCategories() {
  const categoryNames = ['Electronics', 'Kitchen', 'Books']

  const categories = await prisma.$transaction(
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
  const productsPayload: ProductCreatePayload[] = Array.from({
    length: 15,
  }).map((_, index) => ({
    name: `Product ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    category: {
      connect: {
        id: categories[Math.floor(Math.random() * categories.length)].id,
      },
    },
    price: Math.floor(Math.random() * 1000),
    stock: Math.floor(Math.random() * 50),
  }))

  const products = await prisma.$transaction(
    productsPayload.map((product) => {
      return prisma.product.create({
        data: product,
      })
    }),
  )

  return products
}

async function createProductReviews(products: Product[], users: User[]) {
  const reviewsPayload = Array.from({
    length: 15,
  }).map((_, index) => ({
    rating: Math.floor(Math.random() * 5) + 1,
    comment: `Test Comment ${index + 1}`,
    userId: users[index].id,
  }))

  const reviews = await prisma.$transaction(
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
