# Bank

Демо fullstack-проект банковского кабинета.

В проекте уже есть:

- frontend
- backend
- PostgreSQL в Docker
- демо-данные для входа

## Что Нужно

- Node.js 20+
- Yarn 1.x
- Docker
- docker-compose

## Быстрый Запуск

Открой терминал в корне проекта:

```bash
cd /Bank
```

### 1. Подготовка проекта

Эта команда:

- поднимет PostgreSQL
- установит зависимости
- создаст таблицы
- загрузит демо-данные

```bash
./scripts/bootstrap.sh
```

### 2. Запуск backend

Открой первый терминал:

```bash
cd /Bank
./scripts/start-backend.sh
```

### 3. Запуск frontend

Открой второй терминал:

```bash
cd /Bank
./scripts/start-frontend.sh
```

### 4. Открыть проект

Открой в браузере:

```text
http://localhost:7777
```

## Данные Для Входа

- email: `demo@example.com`
- password: `123456`

## Что Можно Проверить

- вход и регистрацию
- карточку пользователя
- баланс
- историю транзакций
- статистику
- поиск контактов
- переводы между картами

## Порты

- frontend: `http://localhost:7777`
- backend: `http://localhost:4200/api`
- база данных: `localhost:5433`

## Если Нужно Пересоздать Демо-Данные

```bash
cd /Bank
yarn db:setup
```

## Если Нужно Остановить Базу

```bash
cd /Bank
docker-compose down
```
