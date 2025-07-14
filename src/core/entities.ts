import { Entities } from '@models';
import person_entity from '../generated/entities/person_entity_compiled';

export const entities = new Entities();

entities.models = {
	[person_entity.name.toLowerCase()]:person_entity
};

for (const [entityName, entity] of Object.entries(entities.models)) {
	entity.compile();
	entity.transpileQuery();
}