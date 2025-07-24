import { Field } from "@models";
import { BaseRenderer, IRenderParams } from "@component";
import { State } from "@core";
import $ from 'jquery';

export class SelectorRenderer extends BaseRenderer {

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
			<input type="checkbox" value="false" name="SELECTOR" />
		`);
		this.rowHtml.append(this.valueHtml);
		this.parentElement.append(this.rowHtml);

		if (this.noInputElement == true) {
			this.rowHtml.parent().css("width", "10px");
		}
	}
	setDisplayValue(value: any | null) {}
	setState(state: State): void {}
	lockField(): void {}
	unlockField(): void { }
	setColor(color: string | null): void {}
}