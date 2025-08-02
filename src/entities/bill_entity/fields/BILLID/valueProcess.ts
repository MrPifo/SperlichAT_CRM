import { ILocal, OperatingState, sys, utils } from "@core";

export async function valueProcess(local:ILocal): Promise<any> {
	if (sys.operatingState == OperatingState.NEW) {
		return await utils.getNextSequenceNumber("BILL", "BILLID");
	}
	
	return local.value;
}