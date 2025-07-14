import { ViewMode } from "@core";
import { Page } from "@views";
import { FieldDefinition, Parameter, Recordcontainer } from "@models";
import { EntityData, EntityDataRows, IFieldParams } from "@datamodels";
import { api }  from '@libraries';

export class Entity {

    name: string = "";
	fields: Record<string, FieldDefinition> = {};
	params: Record<string, Parameter> = {};
	db: Recordcontainer;
	page?: Page;
	
	mainPage?: Page;
	filterPage?: Page;
	editPage?: Page;
	previewPage?: Page;
	
	constructor(name:string) {
		this.name = name;
		this.db = new Recordcontainer("");
	}

	addField(name:string, params:IFieldParams):FieldDefinition {
		this.fields[name] = new FieldDefinition(name, params);

		return this.fields[name];
	}
	addParameter(name: string, defaultValue?:string) {
		this.params[name] = new Parameter(name, defaultValue);
	}
	getField(fieldName: string): FieldDefinition {
		fieldName = fieldName.toLowerCase();

		for (const key in this.fields) {
			if (key.toLowerCase() == fieldName) {
				return this.fields[key];
			}
		}

		throw new Error(`Field ${fieldName} not found`);
	}
	getColumns(): FieldDefinition[] {
		let columns:FieldDefinition[] = [];

		for (const [fieldName, field] of Object.entries(this.fields)) {
			if (field.params!.column != null) {
				columns.push(field);
			}
		}
		
		return columns;
	}
	getColumnsAsString(): string[] {
		let columns:string[] = [];

		for (const [fieldName, field] of Object.entries(this.fields)) {
			if (field.params!.column != null) {
				columns.push(field.params.column);
			}
		}
		
		return columns;
	}
	getFields(): FieldDefinition[] {
		let fields:FieldDefinition[] = [];

		for (const [fieldName, field] of Object.entries(this.fields)) {
			fields.push(field);
		}

		return fields;
	}
	getFieldNameByColumn(column: string): FieldDefinition {
		let field: FieldDefinition|undefined;

		Object.keys(this.fields).forEach(f => {
			if (this.fields[f].isColumn() && this.fields[f].column() == column) {
				field = this.fields[f];
			}
		});

		if (field !== undefined) {
			return field;
		} else {
			throw new Error(`Failed to find the corresponding field in "${this.name}" by the column "${column}"`);	
		}
	}
	getPrimaryKeyColumn(): string {
		return this.db.primaryKeyColumn;
	}
	setParameterValue(parameter: string, value: any) {
		// Check if parameter exists
		if (this.params[parameter] != null) {
			this.params[parameter].setValue(value);
		}
	}
	getParameterValue(parameter: string) {
		if (this.params[parameter] != null) {
			return this.params[parameter].getValue();
		}

		return null;
	}
	resetParameters() {
		Object.keys(this.params).forEach(param => {
			this.params[param].clear();
		});
	}

	async requestRows(params?: Record<string, any>): Promise<EntityDataRows> {
		if (params != null) {
			Object.keys(params).forEach(param => {
				this.setParameterValue(param, params[param]);
			});
		}

		const sql = this.transpileQuery();
		this.resetParameters();
		const raw = await api.requestFromDB({
			asMap: true,
			sql:sql
		});
		
		const data: EntityDataRows = new EntityDataRows(this.name);
		data.setDataFromMap(raw["data"]["rows"]);

		return data;
	}
	async requestRow(id: string): Promise<EntityData> {
		this.setParameterValue("singleRowId", id);
		const sql = this.transpileQuery();
		this.resetParameters();
		const raw = await api.requestFromDB({
			asMap: true,
			sql:sql
		});

		const data: EntityDataRows = new EntityDataRows(this.name);
		data.setDataFromMap(raw["data"]["rows"]);

		if (data.rows.length > 0) {
			return data.rows[0];
		} else {
			return new EntityData(this.name);
		}
	}
	compile(): void {
		let primaryKeyColumn = null;

		Object.keys(this.fields).forEach(key => {
			const field = this.fields[key];

			if (field.params != null) {
				if (field.params.primaryKey != null && field.params.column != null) {
					primaryKeyColumn = field.params.column;
					return;
				}
			}
		});

		if (primaryKeyColumn == null) {
			throw new Error("Primary Key must not be empty!");
		}

		this.addField("#UUID", {
			primaryKey: true,
			column: primaryKeyColumn,
			title: "#UUID"
		});
		this.addParameter("singleRowId");

		this.db.primaryKeyColumn = primaryKeyColumn;
	}
	transpileQuery():string {
		let db = this.db;
		let builder = this.db.sqlBuilder.copy();

		if (db.fromProcess != null) {
			builder = db.fromProcess(builder);
		}
		
		// Select die Spalten direkt nach dem FROM
		if (builder) {
			builder = builder.select(this.getColumnsAsString());
		}
		
		if (db.conditionProcess != null) {
			builder = db.conditionProcess(builder);
		}
		if (this.getParameterValue("singleRowId") != undefined) {
			//@ts-ignore
			builder.where(this.db.primaryKeyColumn, this.getParameterValue("singleRowId"));
		}
		
		if (db.orderProcess != null) {
			builder = db.orderProcess(builder);
		}
		
		const sqlStatement = builder.toString();
		return sqlStatement;
	}
	getPageByViewMode(viewMode:ViewMode):Page | null {
		switch (viewMode) {
			case ViewMode.FILTER:
				return this.filterPage ?? null;
			case ViewMode.NEW:
			case ViewMode.EDIT:
				return this.editPage ?? null;
			case ViewMode.DETAIL:
				return this.previewPage ?? null;
			case ViewMode.MAIN:
				return this.mainPage ?? null;
		}
		
		return null;
	}
	setPage(page: Page, viewMode: ViewMode|number) {
		page.entity = this;

		switch (viewMode) {
			case ViewMode.FILTER:
				this.filterPage = page;
				break;
			case ViewMode.NEW:
			case ViewMode.EDIT:
				this.editPage = page;
				break;
			case ViewMode.DETAIL:
				this.previewPage = page;
				break;
			case ViewMode.MAIN:
				this.mainPage = page;
				break;
		}
	}
}