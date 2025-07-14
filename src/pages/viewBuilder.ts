import { ViewMode } from "@/core";
import { Page } from "@/views";
import { Router } from "@/router/router";
import $ from "jquery";
import { GenericFooter } from "@component";

export class PageBuilder {

	pageWrapper: JQuery<HTMLElement>;
	genericFooter!: GenericFooter;

	constructor() {
		this.pageWrapper = $(`#pageWrapper`);
	}

	buildePage(page: Page, viewMode: ViewMode) {
		let mainContent = $("#viewContent");
		let container = this.getContainer();
		mainContent.empty();
		mainContent.append(container);
		
		if (viewMode == ViewMode.EDIT || viewMode == ViewMode.NEW) {
			if (Router.instance.previewWindow.isOpen) {
				Router.instance.previewWindow.close();
			}
			this.pageWrapper.addClass("limitedContainer col-4 col-mx-auto");
		} else {
			this.pageWrapper.removeClass("limitedContainer col-4 col-mx-auto");
		}
		
		this.buildViewsInContainer(page, container, viewMode);
		
		if (page.isEditMask) {
			this.genericFooter = this.getActionFooter(page);
			mainContent.append(this.genericFooter.element);
		}
	}
	buildPreviewPage(page: Page, viewMode: ViewMode) {
		let viewTab = $("#previewWindow_view");
		let container = this.getContainer();
		viewTab.empty();
		viewTab.append(container);
		
		this.buildViewsInContainer(page, container, viewMode);
	}
	private buildViewsInContainer(page: Page, container: JQuery<HTMLElement>, viewMode: ViewMode) {
		container.addClass("row");
		
		page.views.forEach(view => {
			let verticalBox = this.getVerticalColumn(view.id);
			container.append(verticalBox);
			view.buildView(null, viewMode);
		});
	}
	getContainer() : JQuery<HTMLElement> {
		let container = $(`<div></div>`);

		return container;
	}
	getVerticalColumn(viewId:string): JQuery<HTMLElement> {
		let col = $(`<div id="${viewId}" class="col s12 frameBorder columns"></div>`);

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

		return footer;
	}
}

