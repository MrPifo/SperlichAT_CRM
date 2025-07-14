import { Row, ContentType } from '@datatable';
import $ from 'jquery';

export class Cell {

	element?: JQuery<HTMLElement>;
	column: string;
	value: string;
	contentType?: ContentType;
	row!: Row;
	private hidden: boolean = false;

	constructor(column: string, value: string, contentType:ContentType) {
		this.column = column;
		this.value = value;
		this.contentType = contentType;
	}
	createHtml(): JQuery<HTMLElement> {
		this.element = $(`<td></td>`);
		this.element.addClass("datatable-cell");
		let contentElement;

		switch (this.contentType) {
			default:
			case ContentType.TEXT:
				contentElement = this.getTextComp();
				break;
			case ContentType.SELECTOR:
				contentElement = this.getSelectorComp();
				this.element.addClass("datatable-cell-selector");
				break;
		}

		this.element.append(contentElement);

		if (this.hidden) {
			this.hide();
		}

		return this.element;
	}
	show() {
		this.hidden = false;
		this.element?.removeClass('hideColumn');
	}
	hide() {
		this.hidden = true;
		this.element?.addClass('hideColumn');
	}

	// Components
	getTextComp():JQuery<HTMLElement> {
		const el = $(`<span>${this.value ?? ""}</span>`);
		el.addClass("datatable-cell-value");

		return el;
	}
	getSelectorComp(): JQuery<HTMLElement> {
		let el = $(`
			<label>
				<input type="checkbox" value="false" name="SELECTOR" />
				<span></span>
			</label>
		`);
		el.find("input").addClass("datatable-cell-value");
		el.find("input").addClass("datatable-cell-value-selector");
		el.find("input").addClass("filled-in");

		return el;
	}
}