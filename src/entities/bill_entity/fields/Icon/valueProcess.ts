import { ILocal } from "@core";

export function valueProcess(local:ILocal): any {
	let type = local.getFinalValue("TRANSACTIONTYPE");
	if (type != null) {
		if (type == "OUT") {
			return "TEXT:OUT";
		} else if (type == "IN") {
			return "TEXT:IN";
		}
	}
	
	return "TEXT:NO";
}