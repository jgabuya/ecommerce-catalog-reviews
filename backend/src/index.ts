import express from 'express'
import { json } from 'body-parser'
import morgan from 'morgan'
import http from 'http'
import cors from 'cors'
import { productRouter } from './modules/catalog/product/controller'
import { productCategoryRouter } from './modules/catalog/category/controller'
import { productReviewRouter } from './modules/catalog/review/controller'
import { userRouter } from './modules/user/controller'
import { prismaClient } from '../prisma/client'
import { disconnect as disconnectRedis } from './utils/redis'

const app = express()
const server = http.createServer(app)
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only the frontend origin
  optionsSuccessStatus: 200, // For legacy browser support
}

app.use(cors(corsOptions))
app.use(json())
app.use(morgan('dev'))

app.use('/categories', productCategoryRouter)
app.use('/products', productRouter)
app.use('/products/:productId/reviews', productReviewRouter)
app.use('/auth', userRouter)

const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
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
