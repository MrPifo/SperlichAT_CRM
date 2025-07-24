import { ViewType } from "@views";
import { ContentType } from "@models";

export interface IRenderParams {
	hideLabel?: boolean;
	noInputElement?: boolean;
	contentType?: ContentType,
	viewType?: ViewType
}