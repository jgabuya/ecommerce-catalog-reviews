// connect to prisma and add a product
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.productCategory.create({
  //   data: {
  //     name: 'Computers',
  //   },
  // });

  const categories = await prisma.productCategory.findMany();

  await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'A laptop',
      price: 999.99,
      stock: 10,
      category: {
        connect: {
          id: categories[0].id,
        },
      },
    },
  });

  const products = await prisma.product.findMany();

  console.log('Categories', categories);
  console.log('Products', products);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
