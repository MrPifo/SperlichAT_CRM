import { ContentType, Field, FieldDefinition } from "@models";
import { State, utils } from "@core";
import { Event } from "@libraries";
import $ from 'jquery';
import { IRenderParams } from "./IRendererParams";
import { ViewType } from "@views";

export abstract class BaseRenderer {

	// @ts-ignore
	public renderID: string;
	public field?: Field;
	public fieldInfo?: FieldDefinition;

	// Html Elements
	parentElement: JQuery<HTMLElement>;
    rowHtml?: JQuery<HTMLElement>;
    labelHtml?: JQuery<HTMLElement>;
	valueHtml!: JQuery<HTMLElement>;

	// Properties
	isHidden: boolean = false;
	isLocked: boolean = false;
	state: State = State.AUTO;
	hideLabel: boolean = false;
	noInputElement: boolean = false;
	contentType: ContentType;
	viewType: ViewType;

	hasField = (): boolean => this.field != null;

	// Callbacks
	public onValueChange: Event<any>;
	public onFocus: Event<any>;
	public onFocusLost: Event<any>;

	constructor(field: Field | null, parentElement: JQuery<HTMLElement>, params:IRenderParams) {
		if (field != null) {
			this.field = field;
			this.fieldInfo = field.definition;
			this.state = this.fieldInfo.state;
			this.contentType = this.field.contentType();
		} else {
			this.contentType = params.contentType ?? ContentType.TEXT;
		}
		
		this.renderID = "field-" + utils.getUUID();
		this.viewType = params.viewType ?? ViewType.None;
		this.hideLabel = params.hideLabel ?? false;
		this.noInputElement = params.noInputElement ?? false;
		this.parentElement = parentElement;
		this.onValueChange = new Event<any>();
		this.onFocus = new Event<any>();
		this.onFocusLost = new Event<any>();
		this.createRenderer();
		
		if (this.hasField()) {
			//@ts-ignore
			this.setState(this.fieldInfo.state);
		}
	}

	abstract createRenderer(): void;
	abstract createHtml(): void;
	abstract setDisplayValue(value: any | null): void;
	abstract lockField(): void;
	abstract unlockField(): void;
	abstract setState(state: State): void;
	abstract setColor(color: string | null): void;
	abstract hide(): void;
	abstract show(): void;

	onRendererCreated(): void {}
}