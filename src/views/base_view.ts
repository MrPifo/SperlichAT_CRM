import { EntityData, EntityDataRows } from "@datamodels";
import { Page } from "@views";
import { BaseViewConfig } from "@datamodels";
import { Entity } from "@/models";
import { ViewMode } from "@/core";

export abstract class BaseView {

	id!: string;
	rowId!: string;
	page!: Page;
	name: string;
	config: BaseViewConfig;
	parentView: BaseView|null = null;

	get entity(): Entity {
		return this.page.entity;
	}

	constructor(name: string, config: BaseViewConfig) {
		this.name = name;
		this.config = config;
	}

	abstract buildView(view:BaseView|null, mode:ViewMode): void;
	abstract setData(data: EntityDataRows|EntityData): void;
	
	setPage(page: Page) {
		this.page = page;
		this.id = `View_${this.page.name}_${this.name}`;
	}
}