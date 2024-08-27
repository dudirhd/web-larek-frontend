import {ProductType, IProductActions, IProductView} from "../../types";
import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

// Отображение продукта на главной странице
export class ProductView extends Component<IProductView> {
	private _image: HTMLImageElement;
	private _title: HTMLElement;
	private _category: HTMLElement;
	private _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: IProductActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	set image(value: string) {
		this.setImage(this._image, value, this.title)
	}

	set category(value: keyof typeof ProductType) {
		if (this._category) {
			this.setText(this._category, value);
			const categoryStyle = `card__category_${ProductType[value]}`;
			this._category.classList.add(categoryStyle);
		}
	}

	set price(value: string) {
		this.setText(this._price, value)
	}

	set status(status: boolean) {
		if (this._button) {
			if(this._price.textContent === '') {
				this.setText(this._button, 'Недоступно')
				this.setDisabled(this._button, true)
			} else {
				this.setText(this._button, status ? 'Уже в корзирне' : 'В корзину');
				this.setDisabled(this._button, status)
			}
		}
	}
}