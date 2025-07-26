import { Entity, Parameter } from "@models";
import { IProvider, IConsumer, EntityData, EntityDataRows } from "@datamodels";
import { entities } from "@core";
import { api } from "@libraries";

export class EntityLoader {

	private loadUUID?: string;
	private loadContext!: string;
	private loadFields: string[];
	private useProvider?: IProvider;
	private useConsumer?: IConsumer;
	private useParams?: Parameter[];

	constructor(context: string) {
		this.loadFields = [];
		this.context(context);
	}
	context(context: string) {
		this.loadContext = context;
	}
	uuid(uuid: string):EntityLoader {
		this.loadUUID = uuid;
		const primaryKeyDef = entities.getEntity(this.loadContext).getPrimaryKeyField();

		if (primaryKeyDef != null && this.loadFields.includes(primaryKeyDef.name) == false) {
			this.loadFields.push(primaryKeyDef.name);	
		}

		return this;
	}
	fields(fields: string|string[]):EntityLoader {
		if (Array.isArray(fields)) {
			this.loadFields = fields;
		} else {
			this.loadFields = [fields];
		}

		return this;
	}
	provider(provider: IProvider):EntityLoader {
		this.useProvider = provider;

		return this;
	}
	consumer(consumer: IConsumer):EntityLoader {
		this.useConsumer = consumer;

		return this;
	}
	parameters(params: Parameter[]):EntityLoader {
		this.useParams = params;

		return this;
	}
	async getRow():Promise<EntityData> {
		const entity: Entity = entities.getEntity(this.loadContext);
		const params = this.useParams ?? [];

		if (this.loadUUID != null && params.find(p => p.name == "singleRowId") == null) {
			params.push(new Parameter("singleRowId", this.loadUUID));
		}
		
		const sql = entity.transpileQuery({
			fields: this.loadFields,
			params: params
		});

		const raw = await api.requestFromDB({
			sql: sql,
			asMap: true
		});

		const data: EntityDataRows = new EntityDataRows(this.loadContext);
		data.setDataFromMap(raw["data"]["rows"]);

		if (data.rows.length > 0) {
			return data.rows[0];
		} else {
			return new EntityData(this.loadContext);
		}
	}
	async getRows():Promise<EntityDataRows> {
		const entity: Entity = entities.getEntity(this.loadContext);
		const params = this.useParams ?? [];

		if (this.loadUUID != null && params.find(p => p.name == "singleRowId") == null) {
			params.push(new Parameter("singleRowId", this.loadUUID));
		}
		if (this.loadFields.length == 0) {
			console.error(`EntityLoader requires at least one selected field.`);
		}

		const sql = entity.transpileQuery({
			fields: this.loadFields,
			params: params
		});

		const raw = await api.requestFromDB({
			sql: sql,
			asMap: true
		});

		const data: EntityDataRows = new EntityDataRows(this.loadContext);
		data.setDataFromMap(raw["data"]["rows"]);

		return data;
	}
}