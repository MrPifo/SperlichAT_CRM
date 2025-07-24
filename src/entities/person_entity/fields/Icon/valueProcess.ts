import { local } from "@core";

export function valueProcess(): any {
	let lastname = local.getFinalValue("LASTNAME");
	if (lastname != null) {
		return "TEXT:" + lastname.toUpperCase();
	}
	
	return "TEXT:NO";
}