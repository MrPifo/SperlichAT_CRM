import { ILocal, OperatingState, sys } from "@core";

export function valueProcess(local:ILocal): any {
	if (sys.operatingState == OperatingState.NEW) {
		return sys.currentId;
	}

	return local.value;
}