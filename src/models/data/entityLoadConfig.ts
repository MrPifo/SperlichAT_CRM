import { Parameter, Entity } from "@models";
import { EntityDataRows } from "./entityDataRows";
import { entities } from "@/core";

export class EntityLoadConfig {

	/*context: string;
	params: Parameter[];

	constructor(context: string) {
		this.context = context;
		this.params = [];
		
	}
	from(context: string):EntityLoadConfig {
		this.context = context;
		return this;
	}
	setParams(params: Record<string, string | null>):EntityLoadConfig {
		this.params = [];
		Object.keys(params).forEach(key => {
			this.params.push(new Parameter(key, params[key]));
		});

		return this;
	}
	async getRows(): Promise<EntityDataRows> {
		const entity = entities.getEntity(this.context);
		const rows:EntityDataRows = await entity.requestRows();

		return rows;
	}*/
}