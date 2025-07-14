import { Icons } from '@/core';
import $ from 'jquery';

export class ConfigTools {

	containerId: string;
	iconContainer!: JQuery<HTMLElement>;
	navBar!: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	createBtn!: JQuery<HTMLElement>;
	editBtn!: JQuery<HTMLElement>;
	deleteBtn!: JQuery<HTMLElement>;

	// Callbacks
	onClickCreate: (() => void)[] = [];
	onClickEdit: (() => void)[] = [];
	onClickDelete: (() => void)[] = [];

	constructor(containerId: string) {
		this.container = $(`#${containerId}`);
		this.containerId = containerId;
		this.createElements();
	}
	createElements() {
		this.navBar = $(`
			<header class="navbar config-tools">
				<section class="navbar-section columns">
					
				</section>
			</header>
		`);
		this.container.prepend(this.navBar);
		this.iconContainer = this.navBar.find(".navbar-section");
		this.createOperationMethods();
	}
	createOperationMethods() {
		this.createBtn = $(`
			<button class="btn btn-action column col-1">
				<span class="material-icons">${Icons.CREATE}</span>
			</button>
		`);
		this.editBtn = $(`
			<button class="btn btn-action column col-1">
				<span class="material-icons">${Icons.EDIT}</span>
			</button>
		`);
		this.deleteBtn = $(`
			<button class="btn btn-action column col-1">
				<span class="material-icons">${Icons.DELETE}</span>
			</button>
		`);
		
		this.createBtn.on('click', () => this.onClickCreate.forEach(cb => cb()));
    	this.editBtn.on('click', () => this.onClickEdit.forEach(cb => cb()));
    	this.deleteBtn.on('click', () => this.onClickDelete.forEach(cb => cb()));

		this.iconContainer.append(this.createBtn);
		this.iconContainer.append(this.editBtn);
		this.iconContainer.append(this.deleteBtn);
	}
	subscribe(method: OperationMethod, callback: () => void) {
		switch (method) {
			case OperationMethod.CREATE:
				this.onClickCreate.push(callback);
				break;
			case OperationMethod.EDIT:
				this.onClickEdit.push(callback);
				break;
			case OperationMethod.DELETE:
				this.onClickDelete.push(callback);
				break;
		}
	}
	enableOperation(method:OperationMethod) {
		let btn = this.getButton(method);
		btn.removeClass("disabled");
	}
	disableOperation(method:OperationMethod) {
		let btn = this.getButton(method);
		btn.addClass("disabled");
	}
	getButton(method: OperationMethod) {
		switch (method) {
			case OperationMethod.CREATE:
				return this.createBtn;
			case OperationMethod.EDIT:
				return this.editBtn;
			case OperationMethod.DELETE:
				return this.deleteBtn;
		}
	}
}
export enum OperationMethod {
	CREATE,
	EDIT,
	DELETE
}