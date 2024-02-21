# Redis Cache Module

This module provides a simple interface for interacting with a Redis cache.

## Usage

First, import the necessary functions from the module:

```ts
import { withCache, clearCache, disconnect } from './utils/redis'

// cache data (e.g. database reads)
const data = await withCache('products', async () => {
  return fetchProducts()
})

// invalidate cache (e.g. after database updates/deletes)
await updateProduct(id, { ...payload })
await clearCache(`product:${id}`)

// disconnect redis client
await disconnect()
```

## Functions

`getInstance()`

This is an internal function that creates a Redis client if one does not already exist, and returns the existing client otherwise.

`withCache<T>(key: string, fetchCallback: () => Promise<T>, ttl: number = 60): Promise<T>`

This function attempts to get a value from the Redis cache using the provided key. If the value exists, it is returned. If the value does not exist, the fetchCallback function is called to fetch the data, which is then stored in the cache with an expiration time (TTL) and returned.

`clearCache(key: string)`

This function deletes a value from the Redis cache using the provided key.

`disconnect()`

This function disconnects the Redis client if it is connected.

## Environment Variables

The Redis client requires the `REDIS_URL` environment variable to be set, which should be the URL of your Redis server.
