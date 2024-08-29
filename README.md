# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/view/ - папка с файлами отображения

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

### Тип продукта

```angular2html
enum ProductType {
	'софт-скил' = 'soft',
	'другое' = 'other',
	'хард-скил' = 'hard',
	'дополнительное' = 'additional',
	'кнопка' = 'кнопка'
}
```

### Продукт

```angular2html
interface IProduct {
    id: string - id продукта
    description: string - описание продукта
    image: string - ссылка на картинку продукта
    title: string - оглавление продукта
    category: ProductType - тип продукта
    price: number | null - цена продукта
}
```

### Заказ 

```angular2html
interface IOrder {
	payment: number - тип оплаты
	email: string - email пользователя
	phone: string - телефон пользователя
	address: string - адрес пользователя
	total: number - сумма заказа
	items: string[] - продукты корзины
}
```

### Ошибки Формы 

```
type FormErrors = {
	email?: string
	phone?: string
	address?: string
	payment?: string
}
```

### Продукт в корзине

```angular2html
type TBasketProduct = Pick<IProduct, 'price' | 'id' | 'title'>
```

### Результат заказа

```angular2html
interface IOrderResult {
	id: string - id
	total: number - общая сумма
	error?: string - ошибки
}
```

### Данные приложения 

```angular2html
interface IAppData {
    products: IProduct[] - Все продукты
    basket: IProduct[] - Продукты в корзине
    selectedProduct: string | null - Выбранный товар
    order: IOrder - Заказ
}
```

### Действие с продуктом 

```angular2html
interface IProductActions {
	onClick: (event: MouseEvent) => void;
}
```

### Состояние формы

```angular2html
interface IFormState {
	valid: boolean - валидна ли
	errors: string[] - массив ошибок
}
```

### Тип для Апи

```angular2html
interface IWebLarekApi {
    getProducts(): Promise<List<IProduct>> - получение товаров с сервера
    createOrder(order: IOrder): Promise<IOrderResult> - создание заказа
}
```

### Корзина 

```angular2html
interface IBasketView {
	products: HTMLElement[] - Отображение продуктов в корзине
	total: number - Сумма заказа
}
```

### Страница

```angular2html
interface IPage {
	basketCounter: number; - каунтер корзины
	products: HTMLElement[]; - Продукты на странице
	locked: boolean; - состояние скролла
}
```

### Данные модального окна

```angular2html
interface IModalData {
	content: HTMLElement - контент модального окна
}
```

### Модальное окно продукта

```angular2html
interface IProductView {
    id: string - id
    description: string - описание
    image: string - ссылка на картинку
    title: string - заголовок
    category: ProductType - тип продукта
    price: string - цена
    button: string - надпись в кнопке
    status: boolean - состояние кнопки
}
```

### Успешный заказ 

```angular2html
interface ISuccess {
	title: string - заголовок
	description: string - описание
}
```

### Действия успешного заказа

```
interface ISuccessActions {
	onClick: () => void
}
```

## Архитектура

Действие приложения происходит через обработку событий. Модели создают события, а слушатели в index.ts реагируют и передают данные и производят нужные вычисления

### Cобытия приложения

- `products:changed` - изменение списка продуктов
- `basket:addProduct` - добавление продукта в корзину
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `product:preview` - открытие модального окна продукта
- `basket:open` - открытие корзины
- `basket:removeProduct` - удаление продукта из корзины
- `basket:createOrder` - оформление заказа
- `form:errorsChanged` - отображение ошибок формы
- `order:open` - открытие формы заказа
- `order:clear` - очистка формы заказа
- `order:setPaymentType` - выбор типа оплаты

## Базовый код 

### Класс Api

Совершает базовую логику работы с апи запросами. 

Методы:
- `handleResponse` - Обрабатывает ответ сервера, если все хорошо - возвращает json данных
- `get` - Отправляет GET запрос на сервер и возвращает промис ответа
- `post` - Принимает Json объект и отправляет его на сервер. По умолчанию выполняется POST запрос, но при желании метод запроса можно изменить, задав третий параметр

### Класс Component

Базовый класс представления. Принимает элементы разметки и заполняяет их данными модели

Методы:
- `toggleClass` - изменяет класс элемента. Если есть - убирает, если нет - добавляет
- `setText` - устанавливает текст элементу
- `setDisabled` - изменяет состояние disabled. Добавляет, если оно отсутствует. Убирает, если уже есть
- `setHidden` - скрывает элемент
- `setVisible` - показывает элемент
- `setImage` - устанавливает изображение
- `render` - заполняет элемент данными

### Класс EventEmmiter

Класс, позволяющий подписываться на события и уведомлять о их происшествии. Использует для обработки событий во всем приложении

Методы:
- `on` - добавляет обработчик события
- `off` - удаляет обработчик события
- `emit` - инициализирует и передает данные
- `onAll` - слушает все события
- `offAll` - удаляет все обработчики событий

### Класс Model

Класс для работы с моделью данных

Методы:
- `emitChanges` - сообщает все, что модель данных изменилась.

## Класс данных приложения AppData

Класс работает с данными приложения

Методы: 
- `setProducts` - получает товары с главной страницы приложения
- `getProducts` - возвращает продукты
- `getBasket` - возвращает корзину
- `getTotalPrice` - считает стоимость всей корзины
- `removeProductFromBasket` - удаляет товар из корзины
- `getOrder` - возвращает заказ
- `isFormFill` - проверяет заполненность формы с адресом и типом платежа
- `setOrderField` - записывает значение в поле заказа, валидирует заказ
- `validateOrder` - валидация форм заказа и запись ошибки
- `clearBasket` - очистка корзины
- `clearOrder` - очистка заказа

## Класс работы с Апи Веб-Ларька

Класс нужен для общения с Апи по двум доступным роутам

Методы:
- `getProduct` - Отправляет GET запрос по роуту `/product` и возвращает промис
- `createOrder` - Отправляет POST запрос по роуту `/order`

## Слой, отвечающий за представление данных view

### Класс AdressView

Отвечает за работу пользователя с формой заполнения Адреса пользователя и типа оплаты

Методы:
- `toggleCard` - тоглер для переключения состояния кнопки "Картой"
- `toggleCash` - тоглер для переключения состояния кнопки "При получении"
- `togglePaymentMethod` - переключает состояния кнопок, чтобы они не могли быть активны одновременно
- `resetPaymentButton` - перезагрузка обеих кнопок

### Класс BasketView

Отвечает за отображение корзины

Состоит из метода
- `toggleButton` - тоглер для кнопки, чтобы ее дизейблить при необходимости
и сеттера продуктов на странице. Если продуктов в корзине нет, то создается параграф "Корзина пуста"


### Класс ContactsView

Отвечает за работу формы Контактов. Состоит из двух сеттеров двух полей: телефона и почты

### Класс Page

Глобальный класс страницы приложения с тремя сеттерами: 
- `products` - Вставляет продукты на страницу 
- `locked` - Блокирует прокрутку страницы
- `basketCounter` - Ставит количество элементов в корзине

### Класс Modal

Общий класс модального окна

Методы:
- `handleKeydown` - обработчик нажатия кнопки Esc
- `open` - открытие модального окна
- `close` - закрытие модального окна
- `set content` - устанавливает контент в модальное окно

### Класс ProductView

Отвечает за отображение продуктов. Состоит из 5 сеттеров:

- `title` - ставит заголовок продукта
- `image` - ставит картинку
- `category` - выбирает тип продукта
- `price` - ставит цену
- `status` - ставит статус продукта(в корзине, доступен или недоступен)

### Класс ProductInBasket

Отвечает за отображение продуктов в корзине. Состоит из 3 сеттеров:

- `index` - Ставит номер продукта в корзине
- `price` - ставит цену за продукт
- `title` - вставляет название продукта

### Класс ProductViewModal

Добавляет к продукту описание для отображения в модальном окне. Состоит из одного сеттера - `description`, который задает описание

### Класс SuccessView

Отвечает за вставку заголовка и описания при успешной оплате. Состоит из двух сеттеров:

- `title` - вставляет заголовок
- `description` - вставляет описание
