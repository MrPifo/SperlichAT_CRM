import { ILocal } from "@core";
import { ContactUtils } from "@libraries";

export async function displayValueProcess(local:ILocal): Promise<any> {
	const fullName = await ContactUtils.getFullName(local.value);
	return fullName;
}