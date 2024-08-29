export enum ProductType {
	'софт-скил' = 'soft',
	'другое' = 'other',
	'хард-скил' = 'hard',
	'дополнительное' = 'additional',
	'кнопка' = 'кнопка'
}

export interface IProduct {
	id: string
	description: string
	image: string
	title: string
	category: ProductType
	price: number | null
}

export interface IOrder {
	payment: string
	email: string
	phone: string
	address: string
	total: number
	items: string[]
}

export type FormErrors = {
	email?: string
	phone?: string
	address?: string
	payment?: string
}

export type TBasketProduct = Pick<IProduct, 'price' | 'id' | 'title'>

export type ListItem = {
	index: number
}

export interface IOrderResult {
	id: string
	total: number
	error?: string
}

export interface IAppData {
	products: IProduct[]
	basket: IProduct[]
	selectedProduct: string | null
	order: IOrder
}

export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export interface List<T> {
	items: T[]
	total: number
}

export interface IFormState {
	valid: boolean
	errors: string[]
}

export interface IWebLarekApi {
	getProducts(): Promise<List<IProduct>>
	createOrder(order: IOrder): Promise<IOrderResult>
}

export interface IBasketView {
	products: HTMLElement[]
	total: number
}

export interface IPage {
	basketCounter: number;
	products: HTMLElement[];
	locked: boolean;
}

export interface IModalData {
	content: HTMLElement
}

export interface IProductView {
	id: string
	description: string
	image: string
	title: string
	category: ProductType
	price: string
	button: string
	status: boolean
}

export interface ISuccess {
	title: string
	description: string
}

export interface ISuccessActions {
	onClick: () => void
}
