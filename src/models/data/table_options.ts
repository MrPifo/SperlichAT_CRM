import { BaseViewConfig } from "@datamodels";

export class TableOptions extends BaseViewConfig {
	
	enableSearch?: boolean = false;
	customHeight?: number;
	multiSelect?: boolean = true;
	showTools?: boolean = true;
	showRowCount?: boolean = true;
	isLookup?: boolean = false;
}