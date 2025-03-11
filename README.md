<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Another Knowledge Base

![CircleCI](https://img.shields.io/circleci/build/github/nestjs/nest/master)
![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)
![Package License](https://img.shields.io/npm/l/@nestjs/core.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@nestjs/common.svg)

## Описание

**Another Knowledge Base** - это backend-сервис, реализованный на базе [NestJS](https://nestjs.com), предназначенный для хранения и управления статьями базы знаний с контролем доступа через REST API.

## Возможности

- **Управление статьями:**
    - Хранение статей с атрибутами:
        - Заголовок
        - Содержание
        - Теги
        - Признак "публичная" / "внутренняя"
        - Дополнительные атрибуты на усмотрение разработчика
    - REST API для добавления, изменения и удаления статей
    - REST API для получения статей:
        - По одной статье
        - Списком
        - С фильтрацией по тегам

- **Управление пользователями:**
    - Хранение пользователей с атрибутами:
        - Email
        - Дополнительные атрибуты по необходимости
    - Авторизация пользователей

- **Контроль доступа:**
    - Авторизованные пользователи могут управлять статьями и пользователями
    - Неавторизованные пользователи могут только просматривать публичные статьи

- **Swagger API:**
    - Документация доступна по адресу: [http://localhost:3000/api](http://localhost:3000/api)

## Установка и запуск

### Установка зависимостей
```bash
$ npm install
```

### Запуск приложения
```bash
# Разработка
$ npm run start

# Режим наблюдения
$ npm run start:dev

# Продакшн
$ npm run start:prod
```

### Запуск тестов
```bash
# Юнит-тесты
$ npm run test

# E2E тесты
$ npm run test:e2e

# Покрытие тестами
$ npm run test:cov
```