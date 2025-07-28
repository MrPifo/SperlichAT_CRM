import { KeywordUtils } from "@/libraries";
import { IListValue } from "@component";

export async function dropdownProcess(): Promise<IListValue[]> {
	const categories: string[] = await KeywordUtils.getKeywordContainers();
	
	return categories.map(c => ({
		value: c,
		text: c
	}));
}