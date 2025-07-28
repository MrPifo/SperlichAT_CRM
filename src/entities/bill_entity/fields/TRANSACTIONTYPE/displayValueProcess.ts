import { local } from "@core";
import { KeywordRegistry, KeywordUtils } from "@libraries";

export async function displayValueProcess(): Promise<any> {
	return await KeywordUtils.getKeywordTitle(KeywordRegistry.TransactionType, local.value);
}