import { local, OperatingState, sys } from "@core";

export function valueProcess(): any {
	if (sys.operatingState == OperatingState.NEW) {
		return sys.currentId;
	}

	return local.value;
}