import { Entities } from '@models';
import person_entity from '../entities/person_entity/person_entity';
import bill_entity from '@/entities/bill_entity/bill_entity';

export const entities = new Entities();

entities.models = {
	[person_entity.name.toLowerCase()]: person_entity,
	[bill_entity.name.toLowerCase()]: bill_entity
};

for (const [entityName, entity] of Object.entries(entities.models)) {
	entity.compile();
	entity.transpileQuery();
}