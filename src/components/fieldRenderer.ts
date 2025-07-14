import { Field, FieldDefinition } from "@models";
import { ViewMode } from "@core";
import $ from 'jquery';

export class FieldRenderer {

	public field: Field;
	public fieldInfo: FieldDefinition;

	// Html Elements
	parentElement: JQuery<HTMLElement>;
    rowHtml?: JQuery<HTMLElement>;
    labelHtml?: JQuery<HTMLElement>;
	valueHtml!: JQuery<HTMLElement>;

	// Properties
	viewMode = () :ViewMode => this.field.viewMode;

	constructor(field: Field, parentElement:JQuery<HTMLElement>) {
		this.field = field;
		this.fieldInfo = field.definition;
		this.parentElement = parentElement;
		this.createRenderer();
	}
	createRenderer() {
		this.createHtml();
		this.updateViewMode();
	}
	createHtml() {
        this.rowHtml = $(`<div class="columns column col-12 genericRow"></div>`);
        this.labelHtml = $(`<span class="column col-4 genericLabel">${this.fieldInfo.getTitle()}</span>`);
        this.valueHtml = $(`<input class="column col-8 genericValue"></input>`);
        this.rowHtml.append(this.labelHtml);
		this.rowHtml.append(this.valueHtml);
		this.parentElement.append(this.rowHtml);
	}
	updateViewMode() {
		const mode = this.viewMode();

        if (mode == ViewMode.NEW || mode == ViewMode.EDIT) {
            this.valueHtml.prop("disabled", false);
            this.valueHtml.addClass("editmode");
            this.valueHtml.removeClass("readonly");
        } else {
            this.valueHtml.prop("disabled", true);
            this.valueHtml.addClass("readonly");
            this.valueHtml.removeClass("editmode");
        }
	}
	setDisplayValue(value: any | null) {
		const displayText = value == null ? "" : value.toString();
		this.valueHtml?.val(displayText);
	}
}