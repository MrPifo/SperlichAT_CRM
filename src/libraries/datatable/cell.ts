import { BaseRenderer, SelectorRenderer } from '@component';
import { ContentType, Field } from '@models';
import { Row } from '@datatable';
import $ from 'jquery';
import { entities } from '@core';
import { ViewType } from '@views';

export class Cell {

	element?: JQuery<HTMLElement>;
	column: string;
	contentType?: ContentType;
	row!: Row;
	renderer!: BaseRenderer;
	field: Field;

	private hidden: boolean = false;

	constructor(field:Field) {
		this.field = field;
		this.column = field.fieldName;
		this.contentType = field.contentType();
	}
	createHtml(): JQuery<HTMLElement> {
		this.element = $(`<td></td>`);
		this.element.addClass("datatable-cell");
		this.element.addClass("is-vcentered");
		this.element.addClass(this.field?.fieldName);

		if (this.field != null) {
			this.renderer = this.field?.createRenderer(this.element, {
				hideLabel: true,
				noInputElement: true,
				viewType:ViewType.Table
			});
		} else {
			this.renderer = new SelectorRenderer(null, this.element, {
				hideLabel: true,
				noInputElement: true,
				viewType:ViewType.Table
			});
		}

		this.renderer.rowHtml?.css("align-items", "center");

		if (this.hidden) {
			this.hide();
		}

		return this.element;
	}
	async setValue(value: any) {
		await this.field?.setValue(this.value, true);
		await this.field?.recalculate();
		this.field?.refreshVisuals();
	}
	show() {
		this.hidden = false;
		this.element?.removeClass('hideColumn');
	}
	hide() {
		this.hidden = true;
		this.element?.addClass('hideColumn');
	}
}