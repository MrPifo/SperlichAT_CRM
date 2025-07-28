import { local, OperatingState, sys, utils } from "@core";

export async function valueProcess(): Promise<any> {
	if (sys.operatingState == OperatingState.NEW) {
		return await utils.getUUID();
	}
	
	return local.value;
}