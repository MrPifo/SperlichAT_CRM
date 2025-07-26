import { Entity, Field } from "@models";
import { BaseView } from "@views";
import { EntityData, EntityDataRows, EntityLoadConfig } from "@datamodels";
import { db, sys, ViewMode } from "@core";
import { Router } from "@/router/router";
import { GenericFooter } from "@component";

export class Page {
	
	rowId!: string;
	name: string;
	entity: Entity;
	//rows: EntityDataRows|null = null;
	//row: EntityData|null = null;
	views: BaseView[];
	isEditMode: boolean = false;
	genericFooter!: GenericFooter;

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

	async createNewInstance(id: string) {
		for (let view of this.views) {
			await view.loadData(id);	
		}
	}
	async loadData() {
		//this.row = null;
		//this.rows = null;
		this.lockPage();
		
		if (this.rowId == null) {
			//@ts-ignore
			for (let view of this.views) {
				await view.loadData(null);
			}
		} else {
			//@ts-ignore
			for (let view of this.views) {
				await view.loadData(this.rowId);
			}
		}

		this.unlockPage();
	}
	collectData():EntityData {
		let data: EntityData = new EntityData(this.entity.name);
		data.uuid = this.rowId;
		
		this.views.forEach(v => {
			v.getData().forEach(f => {
				if (data.hasField(f.fieldName) == false) {
					data.setField(f.fieldName, f);
				}
			});
		});

		return data;
	}
	async saveInstance() {
		this.lockPage();
		this.genericFooter?.setLoading(true);
		const fields = this.collectData();
		const primaryKeyField = this.entity.getPrimaryKeyField();

		if (primaryKeyField != null && fields.hasField(primaryKeyField.name) == false) {
			fields.setField(primaryKeyField.name, new Field(this.entity.name, primaryKeyField.name, fields.uuid));
		}

		const columns: string[] = fields.getColumns();
		const values: string[] = fields.extractDataByColumns(columns);

		if (sys.viewMode == ViewMode.NEW) {
			await db.insertData(this.entity.db.table, columns, values);
		} else {
			await db.updateById(this.entity.db.table, columns, values, this.rowId, this.entity.db.primaryKeyColumn);
		}

		Router.instance.openContext(this.entity, ViewMode.FILTER, null);
	}
	cancelEditMask() {
		this.lockPage();
		Router.instance.openContext(this.entity, ViewMode.FILTER, null);
	}
	lockPage() {
		this.genericFooter?.lock();
		this.views.forEach(v => v.lockMask(true));
	}
	unlockPage() {
		this.genericFooter?.unlock();
		this.views.forEach(v => v.lockMask(false));
	}
}