import express from 'express'
import { json } from 'body-parser'
import { productRouter } from './modules/catalog/product/controller'
import { productCategoryRouter } from './modules/catalog/category/controller'
import { productReviewRouter } from './modules/catalog/review/controller'
import { userRouter } from './modules/user/controller'
import { prismaClient } from '../prisma/client'
import { disconnect as disconnectRedis } from './utils/redis'
import morgan from 'morgan'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.use(json())
app.use(morgan('dev'))

app.use('/categories', productCategoryRouter)
app.use('/products', productRouter)
app.use('/products/:productId/reviews', productReviewRouter)
app.use('/auth', userRouter)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

// implement graceful shutdown
const gracefulShutdown = () => {
  console.log(`Shutdown signal received: closing server...`)

  server.close(async () => {
    console.log('Server closed. Exiting process...')

    // clean up database connection
    await prismaClient.$disconnect()

    // clean up Redis connection
    await disconnectRedis()

    process.exit(0)
  })
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
