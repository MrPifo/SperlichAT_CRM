import { BaseRenderer, SelectorRenderer } from '@component';
import { ContentType, Field } from '@models';
import { Row } from '@datatable';
import $ from 'jquery';
import { entities } from '@core';
import { ViewType } from '@views';

export class Cell {

	element?: JQuery<HTMLElement>;
	column: string;
	value: string;
	contentType?: ContentType;
	row!: Row;
	renderer!: BaseRenderer;
	field?: Field;

	private hidden: boolean = false;

	constructor(entityName: string, column: string, value: any, contentType: ContentType) {
		const entity = entities.getEntity(entityName);
		let relatedEntityField = entity.getFieldNameByColumn(column);

		if (relatedEntityField == null) {
			relatedEntityField = entity.getField(column);
		}
		if (relatedEntityField != null) {
			this.field = new Field(entity.name, relatedEntityField.name);
		}
		
		this.column = column;
		this.value = value;
		this.contentType = contentType;
	}
	createHtml(): JQuery<HTMLElement> {
		this.element = $(`<td ></td>`);
		this.element.addClass("datatable-cell");
		this.element.addClass("is-vcentered");

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
		this.field?.setLocal(value);
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