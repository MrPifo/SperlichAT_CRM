import { Icons, sys } from '@core';
import { Event } from '@libraries';
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
	onClickCreate: Event;
	onClickEdit: Event<string>;
	onClickDelete: Event<string>;

	constructor(containerId: string) {
		this.onClickCreate = new Event();
		this.onClickEdit = new Event<string>();
		this.onClickDelete = new Event<string>();
		this.container = $(`#${containerId}`);
		this.containerId = containerId;
		this.createElements();
	}
	createElements() {
		this.navBar = $(`
			<section class="config-tools section">
				<div class="icon-container field is-grouped"></div>
			</section>
		`);
		this.container.prepend(this.navBar);
		this.iconContainer = this.navBar.find(".icon-container");
		this.createOperationMethods();
	}
	createOperationMethods() {
		this.createBtn = $(`
			<button class="button is-success">
				<span class="material-icons">${Icons.CREATE}</span>
			</button>
		`);
		this.editBtn = $(`
			<button class="button is-success">
				<span class="material-icons">${Icons.EDIT}</span>
			</button>
		`);
		this.deleteBtn = $(`
			<button class="button is-success">
				<span class="material-icons">${Icons.DELETE}</span>
			</button>
		`);
		
		this.createBtn.on('click', () => {
			this.onClickCreate.invoke();
		});
		this.editBtn.on('click', () => {
			if (sys.selectedRow) this.onClickEdit.invoke(sys.selectedRow);
		});
		this.deleteBtn.on('click', () => {
			if (sys.selectedRow) this.onClickDelete.invoke(sys.selectedRow);
		});

		this.iconContainer.append(this.createBtn);
		this.iconContainer.append(this.editBtn);
		this.iconContainer.append(this.deleteBtn);
	}
	subscribe(method: OperationMethod, callback: () => void): void;
	subscribe(method: OperationMethod, callback: (rowId: string) => void): void;
	subscribe(method: OperationMethod, callback: ((rowId: string) => void) | (() => void)) {
		switch (method) {
			case OperationMethod.CREATE:
				this.onClickCreate.addListener(callback as () => void);
				break;
			case OperationMethod.EDIT:
				this.onClickEdit.addListener(callback as (rowId: string) => void);
				break;
			case OperationMethod.DELETE:
				this.onClickDelete.addListener(callback as (rowId: string) => void);
				break;
		}
	}
	enableOperation(method:OperationMethod) {
		let btn = this.getButton(method);
		btn.prop("disabled", false);
	}
	disableOperation(method:OperationMethod) {
		let btn = this.getButton(method);
		btn.prop("disabled", true);
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