import { Entity, Field, FieldDefinition } from '@models';
import { EntityDataRows } from '@datamodels';

export class Entities {

	models:Record<string, Entity> = {}

	getFieldTitle(context: string, fieldName: string):string;
	getFieldTitle(context: string, fieldName: string[]):string[];
	getFieldTitle(context: string, fieldName: string | string[]):string | string[] {
		if (Array.isArray(fieldName) == false) {
			let field: FieldDefinition = this.getField(context, fieldName);

			return field.getTitle();	
		} else {
			let names: string[] = [];
			
			fieldName.forEach(f => {
				names.push(this.getField(context, f).getTitle());
			});
			
			return names;
		}
	}
	getEntity(context:string):Entity {
		let entity: Entity = this.models[context.toLowerCase()];
		
		if (entity != null) {
			return entity;
		}

		throw new Error(`Entity ${context} not found!`);
	}
	getField(context: string, field: string):FieldDefinition {
		return this.getEntity(context).getField(field);
	}
}