import { Page } from '@/views';
import { ViewMode } from '@core';
import { Router } from '../router/router';
import $ from 'jquery';

export default class PreviewWindow {

	isOpen: boolean = false;
	page!: Page;
	window: JQuery<HTMLElement>;
	rowId!: string|null;
	closeBtn: JQuery<HTMLElement>;

	constructor() {
		this.window = $('#previewWindow');
		this.closeBtn = this.window.find("#previewWindow-close-btn");
		this.closeBtn.on("click", this.close.bind(this));

		this.hide();
	}
	render() {
		if (this.rowId != null) {
			this.page.setRowId(this.rowId);
			Router.instance.pageBuilder.buildPreviewPage(this.page);
			this.page.loadData();
		}
	}
	open(page:Page, entityName: string, viewMode: ViewMode, id: string) {
		console.log(`Opening Preview-Tab: ${entityName} in ${viewMode} of ${id}`);
		this.isOpen = true;
		this.page = page;
		this.rowId = id;
		this.show();
		this.render();
	}
	close() {
		this.isOpen = false;
		this.rowId = null;
		this.hide();
	}
	private show() {
		this.window.css("display", "block");
	}
	private hide() {
		this.window.css("display", "none");
	}
}