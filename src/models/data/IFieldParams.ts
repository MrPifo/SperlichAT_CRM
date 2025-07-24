import { State } from "@core";
import { ContentType } from "../fieldDefinition";
import { IConsumer } from "@datamodels";

export interface IFieldParams {

	primaryKey?: boolean;
	title?: string;
	column?: string;
	state?: State;
	contentType?: ContentType;
	customDateFormat?: "",
	showRawValueInEditMask?: boolean,
	consumer?:string|IConsumer

}