import {List, IWebLarekApi} from '../types'
import { IOrder, IOrderResult, IProduct } from '../types';
import {Api} from './base/api';

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<List<IProduct>> {
		return this.get('/product') as Promise<List<IProduct>>;
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order) as Promise<IOrderResult>;
	}
}