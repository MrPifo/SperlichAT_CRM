import { Entity } from "@models";
import { BaseView } from "./base_view";
import { utils } from "@core";
import { EntityData, EntityDataRows, EntityLoadConfig } from "@datamodels";

export class Page {
	
	rowId!: string;
	name: string;
	entity: Entity;
	rows: EntityDataRows|null = null;
	row: EntityData|null = null;
	views: BaseView[];
	isEditMask: boolean = false;

	constructor(name: string, entity: Entity) {
		this.name = entity.name + "_" + name;
		this.entity = entity;
		this.views = [];
	}

	appendViews(...view: BaseView[]) {
		view.forEach(v => {
			v.setPage(this);
		});
		this.views.push(...view);
	}

	setRowId(id: string) {
		this.rowId = id;
	}

	createNewInstance(context: string, id:string) {
		this.isEditMask = true;
		this.row = new EntityData(context);
		this.row.uuid = id;
	}
	async loadData() {
		this.row = null;
		this.rows = null;
		
		if (this.rowId == null) {
			new EntityLoadConfig(this.entity.name);
			this.rows = await this.entity.requestRows();
			
			//@ts-ignore
			this.views.forEach(view => view.setData(this.rows));
		} else {
			new EntityLoadConfig(this.entity.name).setParams({
				"singleRowId":this.rowId
			});
			this.row = await this.entity.requestRow(this.rowId);
			//@ts-ignore
			this.views.forEach(view => view.setData(this.row));
		}
	}
	saveInstance() {
		console.log("### Saving ###");
		console.log(this.row);
	}
	cancelEditMask() {
		
	}
}