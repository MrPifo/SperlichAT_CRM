import { Page } from '@views';
import { ViewMode } from '@core';
import { Router } from '../router/router';
import $ from 'jquery';
import { Button } from '@component';

export default class PreviewWindow {

	isOpen: boolean = false;
	page!: Page;
	window: JQuery<HTMLElement>;
	content: JQuery<HTMLElement>;
	rowId!: string|null;
	closeBtn: Button;

	constructor() {
		this.window = $('#previewWindow');
		this.content = $('#previewWindowContent');
		this.closeBtn = new Button({
			existingElement: $("#closeBtn")
		});
		this.closeBtn.onClick.addListener(this.close.bind(this));
	}
	render() {
		if (this.rowId != null) {
			this.page.setRowId(this.rowId);
			Router.instance.pageBuilder.buildPreviewPage(this.page);
			this.page.loadData();
		}
	}
	open(page: Page, entityName: string, viewMode: ViewMode, id: string) {
		//console.log(`Opening Preview-Tab: ${entityName} in ${viewMode} of ${id}`);
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
	clearContent() {
		this.content.empty();
	}
	private show() {
		this.window.css("display", "block");
	}
	private hide() {
		this.window.css("display", "none");
	}
}