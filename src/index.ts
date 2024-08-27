import './scss/styles.scss';
import {EventEmitter} from "./components/base/Events";
import {API_URL, CDN_URL} from "./utils/constants";
import {WebLarekApi} from './components/WebLarekApi';
import {cloneTemplate, ensureElement, createElement} from "./utils/utils";
import {AppData, ProductsChangeEvent} from "./components/AppData";
import {Page} from "./components/view/Page";
import {ProductView} from "./components/view/Product";
import {ProductViewModal} from "./components/view/ProductViewModal"
import {ProductInBasketView} from './components/view/productInBasketView';
import {IProduct, IOrder} from './types';
import {Modal} from './components/view/Popup'
import {BasketView} from './components/view/BasketView';
import {AddressView} from './components/view/AddressView';
import {ContactsView} from './components/view/ContactsView';
import {SuccessView} from './components/view/SuccessView';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const productModal = ensureElement<HTMLTemplateElement>('#card-preview')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const productInBasket = ensureElement<HTMLTemplateElement>('#card-basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

// Модель данных приложения
const appData = new AppData({}, events, [], [], {
	email: '',
	phone: '',
	payment: null,
	address: '',
	total: 0,
	items: []
});

// Контейнеры
const page = new Page(document.body, events);
const basket = new BasketView(cloneTemplate(basketTemplate), events)
const addressForm = new AddressView(cloneTemplate(orderTemplate), events)
const contactsForm = new ContactsView(cloneTemplate(contactsTemplate), events)

// Дальше идут обработчики разнообразных событий, происходящих на странице

// Изменились продукты на главной странице
events.on<ProductsChangeEvent>('products:changed', () => {
	page.basketCounter = appData.getBasket().length;
	page.products = appData.getProducts().map(item => {
		const product = new ProductView(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('product:openInModal', item);
			}
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: CDN_URL + item.image,
			category: item.category,
			price: item.price ? `${item.price} синапсов` : 'Бесценно'
		});
	});
})

// Открытие продукта в модальном окне
events.on('product:openInModal', (product: IProduct) => {
	const card = new ProductViewModal(cloneTemplate(productModal), {
		onClick: () => {
			events.emit('product:addToBasket', product)
		}
	})
	modal.render({
		content: card.render({
			title: product.title,
			image: CDN_URL + product.image,
			category: product.category,
			description: product.description,
			price: product.price ? `${product.price} синапсов` : 'Бесценно',
			status: product.price === null || appData.getBasket().some(item => item === product)
		}),
	})
})

// Добавление продукта в корзину
events.on('product:addToBasket', (product: IProduct) => {
	appData.addProductToBasket(product);
	page.basketCounter = appData.getBasket().length;
	modal.close()
})

// Открытие модального окна
events.on('modal:open', () => {
	page.locked = true;
})

// Закрытие модального окна
events.on('modal:close', () => {
	page.locked = false;
})

// Открытие корзины
events.on('basket:open', () => {
	const products = appData.getBasket().map((item, index) => {
		const product = new ProductInBasketView(cloneTemplate(productInBasket), {
			onClick: () => events.emit('product:removeFromBasket', item)
		});
		return product.render({
			index: index + 1,
			id: item.id,
			title: item.title,
			price: item.price
		});
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				products,
				total: appData.getTotalPrice()
			})
		])
	});
});

// Удаление из корзины
events.on('product:removeFromBasket', (product: IProduct) => {
	appData.removeProductFromBasket(product);
	page.basketCounter = appData.getBasket().length;
})

// Оформление заказа
events.on('order:start', () => {
	if (!appData.isFormFill()) {
		const data = {address: ''}
		modal.render({
			content: addressForm.render({
				valid: false,
				errors: [],
				...data
			})
		})
	} else {
		const data = {
			phone: '',
			email: ''
		}
		modal.render({
			content: contactsForm.render({
				valid: false,
				errors: [],
				...data
			})
		})
	}
})

// Выбор типа оплаты
events.on('order:setPaymentType', (data: {paymentType: string}) => {
	appData.setOrderField('payment', data.paymentType);
})

// Изменилось одно из полей
events.on(/(^order|^contacts)\..*:change/,
	(data: { field: keyof Omit<IOrder, 'items' | 'total'>, value: string }) => {
	appData.setOrderField(data.field, data.value);
	}
)

// Изменение состояния валидации формы
events.on('form:errorChange', (errors: Partial<IOrder>) => {
	const {email, phone, address, payment} = errors;
	addressForm.valid = !address && !payment;
	addressForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join(', ')

	contactsForm.valid = !email && !phone
	contactsForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join(', ')
})

// Отправка формы заказа
events.on(/(^order|^contacts):submit/, () => {
	if (!appData.getOrder().email || !appData.getOrder().address || !appData.getOrder().phone) {
		return events.emit('order:start')
	}

	const products = appData.getBasket()

	api
		.createOrder({
			...appData.getOrder(),
			items: products.map(product => product.id),
			total: appData.getTotalPrice(),
		})
		.then((result) => {
			const success = new SuccessView(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					events.emit('order:clear');
				},
			});

			modal.render({
				content: success.render({
					title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
					description: !result.error ? `Списано ${result.total} синапсов` : result.error,
				}),
			});
		})
		.catch(e => console.log(e))
		.finally(() => events.emit('order:clear'))
})

// Чистка заказа и корзины
events.on('order:clear', () => {
	appData.clearBasket()
	appData.clearOrder()
	addressForm.resetPaymentButton()
})
// Получение продуктов из Апи
api.getProducts()
	.then(data => {appData.setProducts(data.items); console.log(data)})
	.catch(err => console.error(err));