import { entities, local, ViewMode } from "@core";
import { Page } from "@views";
import { FieldDefinition, Parameter, Recordcontainer } from "@models";
import { EntityData, EntityDataRows, ICompileOptions, IConsumer, IFieldParams, IProvider } from "@datamodels";
import { api } from '@libraries';

export class Entity {

	name: string = "";
	title: string = "";
	fields: Record<string, FieldDefinition> = {};
	params: Record<string, Parameter> = {};
	db!: Recordcontainer;
	page?: Page;
	
	mainPage?: Page;
	filterPage?: Page;
	editPage?: Page;
	previewPage?: Page;
	lookupPage?: Page;
	providers: IProvider[] = [];
	consumers: IConsumer[] = [];

	menuContext?: string;
	defaultProvider!: IProvider;

	private globalFieldOrderCount: number = 0;
	
	constructor(name:string) {
		this.name = name;

		this.addParameter("singleRowId");
		this.defaultProvider = {
			name: "#PROVIDER",
			context: this.getContextName(),
			parameter: {}
		};
		this.addProvider(this.defaultProvider);
	}

	addField(name: string, params: IFieldParams): FieldDefinition {
		this.globalFieldOrderCount++;
		this.fields[name] = new FieldDefinition(name, params);
		this.fields[name].order = this.globalFieldOrderCount;
		return this.fields[name];
	}
	addConsumer(consumer: IConsumer) {
		if (consumer.params == null) {
			consumer.params = {};	
		}

		this.consumers.push(consumer);
	}
	addProvider(provider: IProvider) {
		this.providers.push(provider);
	}
	getProvider(name: string):IProvider {
		const provider = this.providers.find(p => p.name == name);

		if (provider != null) {
			return provider;
		}

		throw new Error(`Provider ${name} not found!`);
	}
	getConsumer(name: string): IConsumer {
		const consumer = this.consumers.find(c => c.name == name);

		if (consumer != null) {
			return consumer;
		}

		throw new Error(`Consumer ${name} not found!`);
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

		return null;
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
	getColumnsByFieldNames(fields: string[]): string[] {
		let columns:string[] = [];

		for (const [fieldName, field] of Object.entries(this.fields)) {
			if (field.isColumn() && fields.includes(fieldName)) {
				columns.push(field.column());
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
	getFieldNameByColumn(column: string): FieldDefinition|null {
		let field: FieldDefinition|undefined;

		Object.keys(this.fields).forEach(f => {
			if (this.fields[f].isColumn() && this.fields[f].column() == column) {
				field = this.fields[f];
			}
		});

		if (field !== undefined) {
			return field;
		} else {
			return null;
		}
	}
	getPrimaryKeyField(): FieldDefinition|null {
		let field: FieldDefinition|null = null;

		for (let key in this.fields) {
			const fieldDefinition:FieldDefinition = this.fields[key];

			if (fieldDefinition?.primaryKey == true) {
				field = fieldDefinition;
				break;
			}	
		}

		return field;
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
	getContextName():string {
		return this.name.replace('_entity', '');
	}

	async requestRows(): Promise<EntityDataRows> {
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
	compile(options?: ICompileOptions): void {
		this.addField("#UUID", {
			primaryKey: true,
			column: this.db.primaryKeyColumn,
			title: "#UUID"
		});

		for (const key in this.fields) {
			const definition: FieldDefinition = this.fields[key];
			
			if (definition.params.consumer != null) {
				const consumer: IConsumer = this.getConsumer(definition.params.consumer as string);
				consumer.provider = entities.getEntity(consumer.context).getProvider(consumer.provider as string ?? '#PROVIDER');
				definition.params.consumer = consumer;
				definition.consumer = consumer;
				consumer.originContext = this.getContextName();
			}
		}
	}
	transpileQuery(options?:IEntityQueryOptions):string {
		let db = this.db;
		let builder = this.db.sqlBuilder.copy();

		if (options != null) {
			if (options.params != null) {
				for (const key in options.params) {
					const param = options.params[key];
					local.setParameter(param.name, param.getValue());
				}
			}
		}

		if (db.fromProcess != null) {
			builder = db.fromProcess(builder);
		}
		
		// Select die Spalten direkt nach dem FROM
		if (options != null && options.fields != null) {
			builder = builder.select(options.fields);
		} else if (builder) {
			builder = builder.select(this.getColumnsAsString());
		}
		
		if (db.conditionProcess != null) {
			builder = db.conditionProcess(builder);
		}
		if (local.hasParameter("singleRowId")) {
			//@ts-ignore
			builder.where(this.db.primaryKeyColumn, local.getParameterValue("singleRowId"));
		}
		
		if (db.orderProcess != null) {
			builder = db.orderProcess(builder);
		}
		
		const sqlStatement = builder.toString();
		local.clear();
		
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
			case ViewMode.LOOKUP:
				this.lookupPage = page;
				break;
		}
	}
}
export interface IEntityQueryOptions {

	fields?: string[];
	params?: Parameter[];

}