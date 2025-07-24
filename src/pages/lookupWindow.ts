import { Page, TableView } from '@views';
import $ from 'jquery';
import { IConsumer } from '@/models/data';
import { entities } from '@core';
import { Router } from '@/router/router';
import { Field } from '@models';

export default class LookupWindow {

	isOpen: boolean = false;
	window: JQuery<HTMLElement>;
	content: JQuery<HTMLElement>;
	context!: string;
	consumer!: IConsumer;
	page!: Page;
	field!: Field;
	attachedParent!: JQuery<HTMLElement>;
	attachedParentPrevPosition!:string;
	static instance: LookupWindow;

	constructor() {
		this.window = $('#lookupWindow');
		this.content = $('#lookupWindowContent');
		LookupWindow.instance = this;
	}
	open(field: Field, consumer: IConsumer) {
		this.field = field;
		this.context = consumer.context;
		this.consumer = consumer;
		this.page = entities.getEntity(this.context).lookupPage!;
		this.isOpen = true;
		this.clearContent();
		
		this.attach(field.renderer?.rowHtml!);
		this.show();
		this.renderTable();
	}
	renderTable() {
		this.clearContent();
		
		Router.instance.pageBuilder.buildViewsInContainer(this.page, this.content);
		this.page.loadData();
	}
	attach(parent:JQuery<HTMLElement>) {
		this.attachedParent = parent;
		this.window.appendTo(parent);
		
		const self = this;
		const input = parent.find('input');
		
		input.on('focusout', function(e) {
			setTimeout(() => {
				if (!self.window.is(':hover') && !$(document.activeElement).closest('#lookupWindow').length) {
					self.close();
				}
			}, 100);
		});
		
		this.window.on('mousedown', function(e) {
			e.preventDefault();
		});
		
		this.attachedParentPrevPosition = parent.css('position');
		parent.css("position", "relative");
	}
	setRowId(rowId: string) {
		this.field.setValueFromRowId(this.context, rowId);
		this.attachedParent.find('input').blur();
		this.close();
	}
	close() {
		if (this.attachedParent != null) {
			this.attachedParent.css("position", "");	
		}

		this.window.appendTo(document.body);
		this.isOpen = false;
		this.hide();
	}
	clearContent() {
		this.content.empty();
	}
	private show() {
		this.window.removeClass("window-hidden");
	}
	private hide() {
		this.window.addClass("window-hidden");
	}
}