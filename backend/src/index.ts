// // connect to prisma and add a product
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // await prisma.productCategory.create({
//   //   data: {
//   //     name: 'Computers',
//   //   },
//   // });

//   const categories = await prisma.productCategory.findMany();

//   await prisma.product.create({
//     data: {
//       name: 'Laptop',
//       description: 'A laptop',
//       price: 999.99,
//       stock: 10,
//       category: {
//         connect: {
//           id: categories[0].id,
//         },
//       },
//     },
//   });

//   const products = await prisma.product.findMany();

//   console.log('Categories', categories);
//   console.log('Products', products);
// }

// main()
//   .catch(e => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// create express server
import express from 'express';
import { json } from 'body-parser';
import { productRouter } from './modules/catalog/product/controller';
import { prismaClient } from '../prisma/client';
import morgan from 'morgan';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(json());
app.use(morgan('dev'));

app.use('/products', productRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// implement graceful shutdown
const gracefulShutdown = () => {
  console.log(`Shutdown signal received: closing server...`);

  server.close(async () => {
    console.log('Server closed. Exiting process...');
    // Here you can also clean up other resources like database connections
    await prismaClient.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
