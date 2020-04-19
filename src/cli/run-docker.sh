docker \
  run --rm --name postgres-crypto \
  -e POSTGRES_PASSWORD=docker \
  -d \
  -p 5432:1223 \
  -v /Users/francoisrulliere/docker/volumes/postgres:/var/lib/postgresql/data \
  postgres
