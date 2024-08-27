import { Component } from '../base/Component';
import { IProductActions, ListItem, TBasketProduct } from '../../types';
import { ensureElement } from '../../utils/utils';


export class ProductInBasketView extends Component<TBasketProduct | ListItem> {
	private _index: HTMLElement
	private _price: HTMLElement
	private _title: HTMLElement
	private _button: HTMLButtonElement

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._button = container.querySelector('.basket__item-delete')
		this._button.addEventListener('click', actions.onClick);
	}

	set index(index: number) {
		this.setText(this._index, index)
	}

	set price(price: number) {
		this.setText(this._price, price)
	}

	set title(title: string) {
		this.setText(this._title, title)
	}
}