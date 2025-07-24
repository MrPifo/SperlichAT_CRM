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
		this.element = $(`<section id="actionFooter" class="is-grouped is-flex is-align-items-center"></section>`);
		this.saveBtn = new Button({
			title: 'Save',
			icon: 'save',
			classes:["button", "is-success", "has-addons"]
		});
		this.cancelBtn = new Button({
			title: 'Cancel',
			icon: 'cancel',
			classes:["button", "is-danger", "has-addons"]
		});
		this.saveBtn.setParent(this.element);
		this.cancelBtn.setParent(this.element);
	}
	lock(setLoading?: boolean) {
		if (setLoading != null && setLoading == true) {
			this.saveBtn?.setLoading(true);
			this.cancelBtn?.setLoading(true);
		}
		
		this.saveBtn?.lock();
		this.cancelBtn?.lock();
	}
	unlock(setLoading?: boolean) {
		if (setLoading != null && setLoading == false) {
			this.saveBtn?.setLoading(false);
			this.cancelBtn?.setLoading(false);
		}

		this.saveBtn?.unlock();
		this.cancelBtn?.unlock();
	}
	setLoading(state:boolean) {
		this.saveBtn?.setLoading(state);
		this.cancelBtn?.setLoading(state);
	}
}