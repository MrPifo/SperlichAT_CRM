import { sys, ViewMode } from "@core";
import { BaseView, Page } from "@views";
import { GenericFooter } from "@component";
import $ from "jquery";
import PreviewWindow from "./previewWindow";
import { Router } from "@/router/router";

export class PageBuilder {

	previewWindow: PreviewWindow;
	pageContent: JQuery<HTMLElement>;
	pageWrapper: JQuery<HTMLElement>;
	genericFooter!: GenericFooter;

	constructor() {
		this.previewWindow = Router.instance.previewWindow;
		this.pageWrapper = $(`#pageWrapper`);
		this.pageContent = $("#pageContent");
	}

	buildeFilterPage(page: Page) {
		const container = this.clearPage();
		
		this.buildViewsInContainer(page, container);
		this.setPageTitle(page.entity.name);
		page.loadData();
	}
	async buildNewEditPage(page: Page) {
		const container = this.clearPage();
		this.pageContent.addClass("limitedContainer");
		this.buildViewsInContainer(page, container);
		this.genericFooter = this.getActionFooter(page);
		this.pageWrapper.append(this.genericFooter.element);
		this.genericFooter.setLoading(true);
		
		if (sys.viewMode == ViewMode.NEW) {
			//@ts-ignore
			await page.createNewInstance(sys.currentId);
		} else {
			await page.loadData();
		}
		
		this.genericFooter.setLoading(false);
	}
	buildPreviewPage(page: Page) {
		this.previewWindow.clearContent();
		
		this.buildViewsInContainer(page, this.previewWindow.content);
	}
	buildViewsInContainer(page: Page, container: JQuery<HTMLElement>): BaseView[] {
		const views: BaseView[] = [];

		for (const view of page.views) {
			let verticalBox = this.getVerticalColumn(view.id);
			container.append(verticalBox);
			view.buildView(null);
			views.push(view);
		}

		return views;
	}
	getVerticalColumn(viewId:string): JQuery<HTMLElement> {
		let col = $(`<section id="${viewId}" class="viewBox"></section>`);

		return col;
	}
	getActionFooter(page:Page): GenericFooter {
		const footer = new GenericFooter();
		footer.saveBtn.addClass(["save-btn", "footerActionBtns"]);
		footer.cancelBtn.addClass(["cancel-btn", "footerActionBtns"]);
		footer.saveBtn.onClick.addListener((e) => {
			page.saveInstance();
		});
		footer.cancelBtn.onClick.addListener((e) => {
			page.cancelEditMask();
		});
		page.genericFooter = footer;

		return footer;
	}
	setPageTitle(entity: string) {
		$('#pageTitle').find(".title").html(entity);
	}
	clearPage():JQuery<HTMLElement> {
		this.pageContent.empty();
		const container = $(`<div></div>`);
		this.pageContent.append(container);

		return container;
	}
}

