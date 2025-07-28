import { IListValue } from "@/components";
import { State } from "@core";
import { IConsumer, IFieldParams, Value } from "@datamodels";
import tinycolor from "tinycolor2";

export class FieldDefinition {

	primaryKey: boolean = false;
	name: string;
	params: IFieldParams;
	state: State = State.AUTO;
	order: number = 0;
	contentType: ContentType;
	color: tinycolor.Instance;
	showRawValueInEditMask: boolean;
	consumer!: IConsumer|null;

	column = (): string => this.params.column ?? '';
	isColumn = (): boolean => this.params.column != null;
	
	// Processes
	valueProcess?: () => Promise<any>;
	displayValueProcess?: () => Promise<any>;
	onValueChangedProcess?: (oldValue: Value, newValue: Value) => void;
	onValidationProcess?: () => Promise<boolean>;
	onStateProcess?: () => Promise<State>;
	titleProcess?: () => Promise<any>;
	colorProcess?: () => Promise<tinycolor.Instance | string | null>;
	dropdownProcess?: () => Promise<IListValue[]>;

	constructor(name: string, params: IFieldParams) {
		this.name = name;
		this.params = params;
		this.state = params.state ?? State.AUTO;
		this.contentType = params.contentType ?? ContentType.TEXT;
		this.showRawValueInEditMask = params.showRawValueInEditMask ?? false;
		this.color = tinycolor("white");

		// Set column name to field name if true
		if (params.column != null && params.column === 'true') {
			params.column = name;
		}
		if (params.primaryKey != null && params.primaryKey === true) {
			this.primaryKey = true;
		}
	}

	getTitle():string {
		return this.params.title ?? this.name;
	}
}
export enum ContentType {
	TEXT = 0,
	NUMBER = 1,
	DATE = 2,
	DATETIME = 3,
	BOOLEAN = 4,
	ICON = 5,
	IMAGE = 6,
	KEYWORD = 7
}