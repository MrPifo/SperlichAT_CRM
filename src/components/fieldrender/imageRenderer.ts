import { Field } from "@models";
import { BaseRenderer, IRenderParams } from "@component";
import { State, sys, ViewMode } from "@core";
import $ from 'jquery';

export class ImageRenderer extends BaseRenderer {

	constructor(field: Field|null, parentElement:JQuery<HTMLElement>, params:IRenderParams) {
		super(field, parentElement, params);
	}
	createRenderer() {
		this.createHtml();
		this.setState(this.state);
		this.onRendererCreated();
	}
	createHtml() {
		this.rowHtml = $(`<div class="field is-horizontal"></div>`);
		this.labelHtml = $(`<label class="field-label is-normal">${this.fieldInfo?.getTitle()}</label>`);
		this.valueHtml = $(`
			<div class="avatar"></div>
		`);
		this.rowHtml.append(this.labelHtml);
		this.rowHtml.append(this.valueHtml);
		this.parentElement.append(this.rowHtml);

		if (this.noInputElement == true) {
			this.labelHtml.css("display", "none");
		}
	}
	setDisplayValue(value: any | null) {
		let innerContent = $(`<span class="material-icons"></span>`);

		if (value.startsWith('ICON:')) {
			const iconName = value.substring(5);
			innerContent.html(iconName);
			innerContent.addClass(".avatarIcon");
		} else if (value.startsWith('TEXT:')) {
			let text = value.substring(5);
			text = text.substring(0, 2);
			innerContent.html(text);
			innerContent.addClass("avatarText");
		} else {
			innerContent.html(value);
			innerContent.addClass("avatarImage");
		}

		if (sys.viewMode == ViewMode.FILTER) {
			this.valueHtml.addClass("smallAvatar");
		} else {
			this.valueHtml.addClass("bigAvatar");
		}
		
		this.valueHtml.html(innerContent);
	}
	setState(state: State): void {}
	lockField(): void {}
	unlockField(): void { }
	setColor(color: string | null): void {}
}