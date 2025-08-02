import { ILocal } from "@/core";
import { IListValue } from "@component";
import { KeywordRegistry, KeywordUtils } from "@libraries";

export async function dropdownProcess(local:ILocal): Promise<IListValue[]> {
	return await KeywordUtils.getKeywords(KeywordRegistry.TransactionType);
}