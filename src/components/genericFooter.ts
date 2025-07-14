import { Button } from "@component";
import $ from 'jquery';

export class GenericFooter {

	element!: JQuery<HTMLElement>;
	saveBtn!: Button;
	cancelBtn!: Button;

	constructor() {
		this.render();
	}
	render() {
		this.element = $(`<div id="actionFooter"></div>`);
		this.saveBtn = new Button({
			title: 'Save',
			icon:'save'
		});
		this.cancelBtn = new Button({
			title: 'Cancel',
			icon:'cancel'
		});
		this.saveBtn.setParent(this.element);
		this.cancelBtn.setParent(this.element);
	}
}