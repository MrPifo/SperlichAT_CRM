import { ILocal } from "@core";
import { KeywordUtils } from "@/libraries";
import { IListValue } from "@component";

export async function dropdownProcess(local:ILocal): Promise<IListValue[]> {
	const categories: string[] = await KeywordUtils.getKeywordContainers();
	
	return categories.map(c => ({
		value: c,
		text: c
	}));
}