import { ILocal } from "@core";
import tinycolor from "tinycolor2";

export function colorProcess(local:ILocal): tinycolor.Instance {
	const amount = Number(local.getValue('AMOUNT'));

	if (amount >= 0) {
		return tinycolor('green');
	}

	return tinycolor('#F55');
}