import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

let client: Awaited<ReturnType<typeof createClient>>

async function getInstance() {
  if (!client) {
    client = await createClient({
      url: process.env.REDIS_URL,
    })
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect()
  }

  return client
}

export async function withCache<T>(
  key: string,
  fetchCallback: () => Promise<T>,
  ttl: number = 60,
): Promise<T> {
  // attempt to get the value from Redis
  const redis = await getInstance()
  const cachedValue = await redis.get(key)

  if (cachedValue) {
    // if a value was found, parse it back to its original type and return it
    return JSON.parse(cachedValue) as T
  }

  // if the value was not found, use the callback to fetch the data
  const data = await fetchCallback()

  // store the fetched data with an expiration time (TTL)
  await redis.set(key, JSON.stringify(data), { EX: ttl })

  return data
}

export async function clearCache(key: string) {
  const redis = await getInstance()
  await redis.del(key)
}

export async function disconnect() {
  if (client) {
    await client.disconnect()
  }
}
