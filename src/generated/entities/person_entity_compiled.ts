import person_entity from '../../entities/person_entity/person_entity';
import { fromProcess } from '../../entities/person_entity/db/fromProcess';
import { orderProcess } from '../../entities/person_entity/db/orderProcess';
import { conditionProcess } from '../../entities/person_entity/db/conditionProcess';

person_entity.db.fromProcess = fromProcess;
person_entity.db.orderProcess = orderProcess;
person_entity.db.conditionProcess = conditionProcess;

export default person_entity;