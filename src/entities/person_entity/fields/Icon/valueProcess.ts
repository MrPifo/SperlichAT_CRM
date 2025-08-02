import { ILocal } from "@core";

export function valueProcess(local:ILocal): any {
	let lastname = local.getFinalValue("LASTNAME");
	if (lastname != null) {
		return "TEXT:" + lastname.toUpperCase();
	}
	
	return "TEXT:NO";
}