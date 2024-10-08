import {Model} from "./base/Model";
import {IAppData, IOrder, IProduct, FormErrors} from "../types";
import { IEvents } from './base/Events';

export type ProductsChangeEvent = {
	products: IProduct[]
}

export class AppData extends Model<IAppData> {
	private products: IProduct[]
	private basket: IProduct[]
	private order: IOrder
	private formErrors: FormErrors = {}

	constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[], basket: IProduct[], order: IOrder) {
		super(data, events);

		this.products = products;
		this.basket = basket;
		this.order = order;
	}

	setProducts(products: IProduct[]) {
		this.products = products;
		this.emitChanges('products:changed', { products: this.products });
	}

	getProducts() {
		return this.products;
	}

	getBasket() {
		return this.basket;
	}

	addProductToBasket(product: IProduct) {
		if (!this.basket.some(item => item === product)) {
			this.basket.push(product);
			this.emitChanges('basket:change', { basket: this.basket });
		}
	}

	getTotalPrice() {
		return this.basket.map(product => product.price)
			.reduce((prev, current) => prev + current, 0)
	}

	removeProductFromBasket(product: IProduct) {
		this.basket = this.basket.filter(item => item !== product);
		this.emitChanges('basket:change', {basket: this.basket });
	}

	getOrder() {
		return this.order;
	}

	isFormFill() {
		if (this.order === null) {
			return false;
		}
		return this.order.address && this.order.payment;
	}

	setOrderField(field: Exclude<keyof IOrder, 'items' | 'total'>, value: string) {
		this.order[field] = value;
		if (this.validateOrder(field)) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder(field: keyof IOrder) {
		const errors: Partial<Record<keyof IOrder, string>> = {};

		// Проверка для полей email и phone
		if (field === 'email' || field === 'phone') {
			const emailError = !this.order.email.match(/^\S+@\S+\.\S+$/)
				? 'email'
				: '';
			const phoneError = !this.order.phone.match(/^\+7\d{10}$/)
				? 'телефон'
				: '';

			if (emailError && phoneError) {
				errors.email = `Необходимо указать ${emailError} и ${phoneError}`;
			} else if (emailError) {
				errors.email = `Необходимо указать ${emailError}`;
			} else if (phoneError) {
				errors.phone = `Необходимо указать ${phoneError}`;
			}
		} else if (!this.order.address) errors.address = 'Необходимо указать адрес';
		else if (!this.order.payment)
			errors.address = 'Необходимо выбрать тип оплаты';

		this.formErrors = errors;
		this.events.emit('form:errorChange', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('products:changed', { products: this.products });
	}

	clearOrder() {
		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}
}