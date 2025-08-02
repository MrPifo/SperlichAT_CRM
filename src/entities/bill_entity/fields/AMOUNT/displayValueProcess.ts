import { ILocal, OperatingState, sys } from "@core";

export function displayValueProcess(local:ILocal): any {
	let amount = local.getValue("AMOUNT");
	
	return amount + "€";
}