# RED Bank Backend

NestJS + Prisma + PostgreSQL backend для демо-проекта RED Bank.

## Запуск

```bash
yarn install
yarn db:setup
yarn start:dev
```

По умолчанию сервис стартует на `http://localhost:4200/api`.

## База Данных

Backend использует PostgreSQL:

- host: `localhost`
- port: `5433`
- database: `bank-app-red-project`
- user: `postgres`
- password: `123456`

Поднять БД можно из корня проекта:

```bash
docker-compose up -d db
```

## Полезные Команды

```bash
yarn db:push
yarn db:seed
yarn db:setup
yarn build
```

## Демо-Данные

После `yarn db:setup` в базе будут:

- demo-пользователь
- 2 контакта для поиска и переводов
- карта и стартовые транзакции
