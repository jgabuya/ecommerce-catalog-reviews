## Prisma

### migration

```sh
npx prisma migrate dev --name descriptive_migration_name
```

### generate client

```sh
npx prisma generate
```

### generate seed

```sh
npx prisma db seed
```

### redis

```sh
docker pull redis
docker run --name redis-cache -p 6379:6379 -d redis
docker exec -it redis-cache redis-cli
```
