import { ensureElement } from '../../utils/utils';
import { ProductView } from './Product';
import { IProductActions } from "../../types";

export class ProductViewModal extends ProductView {
	private _description: HTMLElement;

	constructor(container: HTMLElement, actions: IProductActions) {
		super(container, actions);
		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}