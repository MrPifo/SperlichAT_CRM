import { local } from "@core";
import { ContactUtils } from "@libraries";

export async function displayValueProcess(): Promise<any> {
	const fullName = await ContactUtils.getFullName(local.value);
	return fullName;
}