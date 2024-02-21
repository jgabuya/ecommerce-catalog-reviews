# Backend

## Description

The backend provides HTTP API endpoints for a simplified ecommerce application. The following functionalities are supported:

- **categories management**
  - _each category has many products_
- **products management**
  - _each product has many product comments_
- **product review management**

  - _each product review belongs to only one user_
  - _a user can only have one review per product_

- **user registration and authentication (JWT)**

### Technologies/tools used:

- Redis: used for caching
- SQLite was chosen for simplicity and ease of setup. In a production environment we would probably use a more robust and secure solution, e.g. Postgres
- [Prisma](https://www.prisma.io/): an open-source ORM (Object Relational Mapping) tool for Node.js and TypeScript, designed to make database access easy with a focus on type safety and developer productivity. It should be noted that the `./prisma/schema.prisma` entity definitions are currently SQLite-specific. If we need to change databases (e.g Postgres), the schema file should be adjusted as well.
- Jest: test runner

## Structure

- `./prisma`: contains Prisma-related files including schema, migrations, seed, client, and SQLite file
- `./src`:
  - `modules`: are vertical slices of functionality. Each module can be broken down into submodules and contains the following files the represent particular architecture layers:
    - `controller.ts`: the _API_ layer which contains route and handler definitions. Request validation is also done in this layer
    - `service.ts`: the _business logic_ layer. A service file typically contains a class that accepts a store instance via dependency injection. This allows for a better isolated testing with a mock store
    - `store.ts`: the _data_ layer which is essentially a wrapper for the Prisma ORM
    - `types.ts`: type and entity definitions
  - `utils`: common utilities used by modules
  - `index.ts`: the application entrypoint. It consolidates the routes declared in each module

## Setup

This application has the following prerequisites:

- [Node.js v20](https://nodejs.org/en/download). You can use [nvm](https://github.com/nvm-sh/nvm) to easily manage Node.js versions
- [Redis server](https://redis.io/). If you're using docker, you can run a redis server locally with:

  ```sh
  docker pull redis
  docker run --name redis-cache -p 6379:6379 -d redis

  # the following command is not nessary for setup. but you can do it if you want to run a terminal inside the container
  docker exec -it redis-cache redis-cli
  ```

### Running the app

1. Create an environment variable file:

```sh
cp .env.example .env

# You need to change the env values accordingly
```

2. Install package dependencies

```sh
npm install
```

3. Generate Prisma tables and seed data:

```sh
npx prisma migrate dev
npx prisma db seed
```

4. Run the app locally:

```sh
npm run dev
```

## Testing

To run tests, use the command:

```sh
npm test
```

Due to time constraints, tests are only present for module service classes. A nice addition would be automated API testing against HTTP endpoints

## API

### Categories

- `GET /categories`: Fetch all categories
- `POST /categories`: Create a new category
- `GET /categories/:categoryId`: Fetch a specific category
- `PUT /categories/:categoryId`: Update a specific category
- `DELETE /categories/:categoryId`: Delete a specific category`

### Products

- `GET /products`: Fetch all products
- `POST /products`: Create a new product
- `GET /products/:productId`: Fetch a specific product
- `PUT /products/:productId`: Update a specific product
- `DELETE /products/:productId`: Delete a specific product

### Product Reviews

- `GET /products/:productId/reviews`: Fetch all reviews for a specific product
- `POST /products/:productId/reviews`: Create a new review for a specific product
- `GET /products/:productId/reviews/:reviewId`: Fetch a specific review for a specific product
- `PUT /products/:productId/reviews/:reviewId`: Update a specific review for a specific product
- `DELETE /products/:productId/reviews/:reviewId`: Delete a specific review for a specific product

### Auth

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Log in a user

## Prisma

Everytime you update the `schema.prisma` file, you must do the following afterwards:

```sh
# create a new migration file to reflect the changes
npx prisma migrate dev --name <descriptive_migration_name>

# regenerate prisma client
npx prisma generate
```

## Additional Notes

- The `modules` structure can be useful in a microservices architecture. Each module/submodule can be deployed as a separate microservice by defining unique entrypoints (e.g. `./src/index.ts`). In this particular setup, a module calls another module by directly invoking the service function, but in a real-world microservice setup we would use a network protocol (e.g http/grpc) and message queues (e.g. Kafka).
- A nice to have addition would be a Swagger (Open API) file generator and an HTTP client generator for UI clients to import and use.
- In practical applications, implementing an effective cache invalidation strategy is essential. This strategy should be tailored based on various factors, including how frequently the data is accessed and the trade-offs between speed and data consistency.
