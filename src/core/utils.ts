import {v4 as uuidv4} from 'uuid';

class Utils {

	getUUID():string {
		return uuidv4();
	}
}
export var utils = new Utils();