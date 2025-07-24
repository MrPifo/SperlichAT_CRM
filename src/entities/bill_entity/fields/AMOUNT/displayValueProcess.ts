import { local, OperatingState, sys } from "@core";

export function displayValueProcess(): any {
	let amount = local.getValue("AMOUNT");
	
	return amount + "€";
}