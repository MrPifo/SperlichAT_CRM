import { ILocal } from "@core";
import { KeywordRegistry, KeywordUtils } from "@libraries";

export async function displayValueProcess(local:ILocal): Promise<any> {
	return await KeywordUtils.getKeywordTitle(KeywordRegistry.TransactionType, local.value);
}