import { ContentType, Field } from "@models";
import { OperatingState } from "@core";
import $ from 'jquery';
import { BaseRenderer, IRenderParams } from "@component";
import { State, sys } from "@core";
import { ViewType } from "@views";

export class FieldRenderer extends BaseRenderer {

	constructor(field: Field, parentElement:JQuery<HTMLElement>, params:IRenderParams) {
		super(field, parentElement, params);
	}
	createRenderer() {
		this.createHtml();
		this.onRendererCreated();
		this.setState(this.state);
		this.setCallbacks();
	}
	createHtml() {
		this.rowHtml = $(`<div class="field is-horizontal"></div>`);
		
		if (this.hideLabel == false) {
			this.labelHtml = $(`<label for="${this.fieldInfo?.name}" class="field-label is-normal">${this.fieldInfo?.getTitle()}</label>`);
			this.rowHtml.append(this.labelHtml);
		}
        
		if (this.noInputElement == true) {
			this.rowHtml.addClass('fieldReadOnlyValue');
			this.valueHtml = $(`<span class="field"></span>`);
			this.valueHtml.css("color", this.field?.color ?? '#FFF');
		} else {
			this.rowHtml.addClass('fieldEditValue');
			this.valueHtml = $(`<input id="${this.fieldInfo?.name}" class="input field" placeholder="${this.fieldInfo?.getTitle()}"></input>`);
		}

		this.addFieldClass(this.viewType);
		this.rowHtml.append(this.valueHtml);
		this.parentElement.append(this.rowHtml);
	}
	setCallbacks() {
		const self = this;

		if (this.contentType == ContentType.DATE || this.contentType == ContentType.DATETIME) {
			this.valueHtml.on("changeDate", function () {
				self.onValueChange.invoke($(this).val());
			});
		} else {
			this.valueHtml.on("change", function () {
				self.onValueChange.invoke($(this).val());
			});
			this.valueHtml.on('focus', function () {
				self.onFocus.invoke($(this).val());
			});
			this.valueHtml.on('focusout', function () {
				self.onFocusLost.invoke($(this).val());
			});
		}
	}
	setDisplayValue(value: any | null) {
		const displayText = value == null ? "" : value.toString();

		if (this.noInputElement == true) {
			this.valueHtml?.html(displayText);
		} else {
			this.valueHtml?.val(displayText);
		}
	}
	setState(state: State): void {
		if (sys.operatingState == OperatingState.VIEW) {
			state = State.READONLY;
		}
		
		this.state = state;

		if (this.isLocked == true) {
			state = State.DISABLED;
		}

		this.valueHtml.prop("disabled", false);
		this.valueHtml.removeClass("readonly");
		this.show();

		switch (state) {
			case State.AUTO:
			case State.EDIT:
            	this.valueHtml.addClass("editmode");
				break;
			case State.READONLY:
			case State.DISABLED:
				this.valueHtml.prop("disabled", true);
            	this.valueHtml.addClass("readonly");
				break;
			case State.INVISIBLE:
				this.hide();
				break;
		}

		if (this.isHidden) {
			this.hide();
		}
	}
	setColor(color: string|null): void {
		if (this.noInputElement == true) {
			this.valueHtml.css("color", color ?? '#FFF');
		}
	}
	lockField(): void {
		this.isLocked = true;
		this.setState(this.state);
	}
	unlockField(): void {
		this.isLocked = false;
		this.setState(this.state);
	}
	addFieldClass(viewType: ViewType) {
		switch (viewType) {
			case ViewType.Generic:
				this.rowHtml?.addClass('fieldGeneric');
				break;
			case ViewType.Table:
				this.rowHtml?.addClass('fieldTable');
				break;
		}
	}
	hide() {
		this.rowHtml?.css("display", "none");
	}
	show() {
		this.rowHtml?.css("display", "flex");
	}
}
