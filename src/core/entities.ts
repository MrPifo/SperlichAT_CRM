import { Entities } from '@models';

export const entities = new Entities();

entities.models = {
    
};

for (const [entityName, entity] of Object.entries(entities.models)) {
    entity.compile();
    entity.transpileQuery();
}