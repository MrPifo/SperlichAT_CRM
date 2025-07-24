import { local } from "@core";

export function valueProcess(): any {
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