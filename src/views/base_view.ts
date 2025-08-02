import { EntityData, EntityDataRows } from "@datamodels";
import { Page } from "@views";
import { BaseViewConfig, ViewData } from "@datamodels";
import { Entity, Field, Parameter } from "@models";
import { entities, EntityLoader } from "@core";

export abstract class BaseView {

	id!: string;
	rowId!: string|null;
	page!: Page;
	name: string;
	title: string = "";
	fields: Field[] = [];
	config: BaseViewConfig;
	context!: string;
	parentView: BaseView | null = null;
	columns!: string[];
	//@ts-ignore
	rows: EntityDataRows = null;
	//@ts-ignore
	row: EntityData = null;
	//@ts-ignore
	pageData: ViewData = null;

	get entity(): Entity {
		return entities.getEntity(this.context);
	}

	constructor(name: string, config: BaseViewConfig) {
		this.name = name;
		this.config = config;
	}

	abstract buildView(view:BaseView|null): void;
	abstract setData(data: EntityDataRows | EntityData): void;
	async loadData(id:string|null): Promise<void> {
		this.rowId = id;
		this.pageData.uuid = id;
		await this.pageData.loadData();
	}
	lockMask(state: boolean) {
		this.fields.forEach(f => {
			if (state) {
				f.lockField();
			} else {
				f.unlockField();
			}
		});
	}
	
	setPage(page: Page) {
		this.page = page;
		this.context = page.entity.name;
		this.id = `View_${this.page.name}_${this.name}`;
	}
	abstract getData():Field[];
}