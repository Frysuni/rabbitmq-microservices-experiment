# Green-Api contest.

В стэке указано NodeJS, RabbitMQ, поэтому я не использовал NestJS.
__Тут 2 микросервиса в одном проекте!__ Я не стал делать workspaces для упрощения тестирования!
Да, это не микросервисы, но понятие в принципе было сохранено (M1 -> rMQ -> M2 -> rMQ -> M1)

### Логика самого проекта такова:

request http://localhost/?name=**myName**
response "Hello, **myName**, you've been here **3** times already"
request http://localhost/?name=**myName**
response "Hello, **myName**, you've been here **4** times already"

где запросы обрабатывает **M1**, а логика подсчета запросов в **M2**

## Запуск и тестирование
1. Настройте .env файл
2. Введите команды ниже (сначала ведь нужно посмотреть что делает команда, прежде чем вводить, верно?)
- `yarn run boot`
- `yarn run start`
3. Выполните запрос на сервер http://localhost:PORT/?name=name