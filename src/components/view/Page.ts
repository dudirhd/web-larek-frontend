import {Component} from "../base/Component";
import {IEvents} from "../base/Events";
import {ensureElement} from "../../utils/utils";
import {IPage} from '../../types';

export class Page extends Component<IPage> {
	private _basketCounter: HTMLElement;
	private _products: HTMLElement;
	private _basket: HTMLElement;
	private wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._products = ensureElement<HTMLElement>('.gallery');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set products(products: HTMLElement[]) {
		this._products.replaceChildren(...products);
	}

	set locked(isLocked: boolean) {
		this.toggleClass(this.wrapper, 'page__wrapper_locked', isLocked);
	}

	set basketCounter(counter: number) {
		this.setText(this._basketCounter, counter)
	}
}