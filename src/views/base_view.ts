import { EntityData, EntityDataRows, EntityLoadConfig } from "@datamodels";
import { Page } from "@views";
import { BaseViewConfig } from "@datamodels";
import { Entity, Field } from "@models";
import { entities } from "@/core";

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
	//@ts-ignore
	rows: EntityDataRows = null;
	//@ts-ignore
	row: EntityData = null;

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

		if (this.rowId == null) {
			this.rows = await this.entity.requestRows()
		} else {
			new EntityLoadConfig(this.entity.name).setParams({
				"singleRowId":this.rowId
			});
			this.row = await this.entity.requestRow(this.rowId);
		}
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