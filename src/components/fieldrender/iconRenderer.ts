import { Field } from "@models";
import { BaseRenderer, IRenderParams } from "@component";
import { State } from "@core";
import $ from 'jquery';

export class IconRenderer extends BaseRenderer {

	constructor(field: Field|null, parentElement:JQuery<HTMLElement>, params:IRenderParams) {
		super(field, parentElement, params);
	}
	createRenderer() {
		this.createHtml();
		this.setState(this.state);
		this.onRendererCreated();
	}
	createHtml() {
        this.rowHtml = $(`<div></div>`);
		this.valueHtml = $(`
			<span class="material-icons" style="display: inline;">save</span>
		`);
		this.rowHtml.append(this.valueHtml);
		this.parentElement.append(this.rowHtml);
		
		this.valueHtml.addClass("datatable-cell-value");
		this.valueHtml.addClass("datatable-cell-value-selector");
		this.valueHtml.addClass("filled-in");
	}
	setDisplayValue(value: any | null) {}
	setState(state: State): void {}
	lockField(): void {}
	unlockField(): void { }
	setColor(color: string | null): void {}
}