import { IListValue } from "@component";
import { KeywordRegistry, KeywordUtils } from "@libraries";

export async function dropdownProcess(): Promise<IListValue[]> {
	return await KeywordUtils.getKeywords(KeywordRegistry.TransactionType);
}