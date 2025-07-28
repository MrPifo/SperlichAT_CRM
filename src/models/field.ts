import { entities, State, local, sys, OperatingState, EntityLoader } from "@core";
import { BaseRenderer, DateRenderer, DropdownRenderer, FieldRenderer, IconRenderer, IListValue, ImageRenderer, IRenderParams, NumberRenderer } from "@component";
import { ContentType, FieldDefinition } from "@models";
import { IConsumer, ProcessType, Value } from "./data";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import $ from 'jquery';
import { ViewType } from "@views";
import LookupWindow from "@/pages/lookupWindow";
import { Router } from "@/router/router";

export class Field {

	// Field Info
    definition: FieldDefinition;
    entityName: string;
	fieldName: string;
	renderer?: BaseRenderer;
	consumer?: IConsumer|null;

	// data
	srcValue: Value;
	value: Value;
	displayValue: Value;
	color: string = "#FFF";
	listItems?: IListValue[];

	// states
	isLocked: boolean = false;
	isValid: boolean = true;
	state!: State;
	hideLabel: boolean = false;
	viewType: ViewType = ViewType.None;

	// Properties
	hasRenderer = (): boolean => this.renderer != null;
	contentType = (): ContentType => this.definition.contentType;

    constructor(entityName: string, fieldName: string);
	constructor(entityName: string, fieldName: string, value?: string | Number | Object | null);
	constructor(entityName: string, fieldName: string, value?: string | Number | Object | null) {
        this.definition = entities.getEntity(entityName).getField(fieldName);
        this.entityName = entityName;
        this.fieldName = fieldName;
		this.value = new Value(value);
		this.srcValue = new Value(value);
		this.displayValue = new Value(null);
		this.consumer = this.definition.consumer;
		this.setState(this.definition.state);
		dayjs.extend(customParseFormat);
    }
	createRenderer(parent: JQuery<HTMLElement>, params?: IRenderParams): BaseRenderer {
		const self = this;
		this.viewType = params?.viewType ?? ViewType.None;

		switch (this.contentType()) {
			default:
			case ContentType.TEXT:
				this.renderer = new FieldRenderer(this, parent, params ?? {});
				break;
			case ContentType.DATETIME:
			case ContentType.DATE:
				this.renderer = new DateRenderer(this, parent, params ?? {});
				break;
			case ContentType.NUMBER:
				this.renderer = new NumberRenderer(this, parent, params ?? {});
				break;
			case ContentType.ICON:
				this.renderer = new IconRenderer(this, parent, params ?? {});
				break;
			case ContentType.IMAGE:
				this.renderer = new ImageRenderer(this, parent, params ?? {});
				break;
			case ContentType.KEYWORD:
				this.renderer = new DropdownRenderer(this, parent, params ?? {});
				break;
		}

		if (sys.operatingState == OperatingState.NEW || sys.operatingState == OperatingState.EDIT) {
			this.renderer.onValueChange.addListener((value: any) => {
				if (this.contentType() == ContentType.DATE || this.contentType() == ContentType.DATETIME) {
					//@ts-ignore
					value = dayjs(value.trim(), 'DD.MM.YYYY', true).format('YYYY-MM-DD');
					this.setValue(value, true);
				} else if (this.contentType() == ContentType.NUMBER) {
					self.setValue(value.replaceAll(',', '.'), true);
				} else {
					self.setValue(value, true);
				}
			});
			this.renderer.onFocus.addListener((value: any) => {
				if (this.consumer != null) {
					//@ts-ignore
					LookupWindow.instance.open(this, this.consumer);
				}
			});
			this.renderer.onFocusLost.addListener((value: any) => {
				if (this.consumer != null) {
					LookupWindow.instance.close();
				}
			});
		}

		return this.renderer;
	}
    
	async setValueFromRowId(context: string, rowId: string) {
		Router.instance.pageBuilder.genericFooter?.lock(true);
		const data = await new EntityLoader(context).uuid(rowId).getRow();
		await this.setValue(data.uuid, false);
		Router.instance.pageBuilder.genericFooter?.unlock(false);
	}
	async setValue(value: string | Number | Object | null, dontRecalculate: boolean) {
		
		this.setLocal(value);
		this.value.setValue(value);

		if (dontRecalculate == false) {
			await this.recalculate();
		}

		this.refreshVisuals();
		
	}
	setEmpty(dontRecalculate: boolean) {
		this.value.setValue(null);
		this.displayValue.setValue(null);

		if (dontRecalculate == false) {
			this.recalculate();
		}

		this.refreshVisuals();
	}
	getValue(): any {
		return this.value == null ? null : this.value.value;
	}
	getDisplayValue(): any {
		return this.displayValue == null ? null : this.displayValue.value;
	}
	getFinalValue(): any {
		if (this.displayValue != null && this.displayValue.isNull() == false) {
			return this.getDisplayValue();
		}

		return this.getValue();
	}
	getValueNumber(): number {
		return this.value == null ? NaN : this.value.getValueAsNumber();
	}
	getCopy(): Field {
		const field = new Field(this.entityName, this.fieldName);
		field.value = this.value;
		field.displayValue = this.displayValue;
		field.color = this.color;
		field.contentType = this.contentType;
		field.state = this.state;

		return field;
	}
	setState(state: State) {
		if (state != this.state) {
			if (state == State.AUTO) {
				state = this.definition.state;	
			}

			this.state = state;
			this.renderer?.setState(this.state);
		}
	}
	lockField() {
		this.isLocked = true;
		this.renderer?.lockField();
	}
	unlockField() {
		this.isLocked = false;
		this.renderer?.unlockField();
	}
	async execute(type: ProcessType) {
		switch (type) {
			case ProcessType.VALUE:
				if (this.definition.valueProcess != null) {
					const result = await this.definition.valueProcess();
					this.value = result == null ? new Value(null) : new Value(result);
				}
				break;
			case ProcessType.DISPLAYVALUE:
				if (this.definition.displayValueProcess != null) {
					const result = await this.definition.displayValueProcess();
					this.displayValue = result == null ? new Value(null) : new Value(result);
				}
				break;
			case ProcessType.ONVALUECHANGE:
				if (this.definition.onValueChangedProcess != null) {
					await this.definition.onValueChangedProcess(local.oldValue, local.newValue);
				}
				break;
			case ProcessType.ONVALIDATION:
				if (this.definition.onValidationProcess != null) {
					this.isValid = await this.definition.onValidationProcess();
				}
				break;
			case ProcessType.DROPDOWN:
				if (this.definition.dropdownProcess != null && this.contentType() == ContentType.KEYWORD) {
					this.listItems = await this.definition.dropdownProcess();
				}
				break;
			case ProcessType.ONSTATE:
				if (this.definition.onStateProcess != null) {
					const result = await this.definition.onStateProcess();
					this.setState(result);
				}
				break;
			case ProcessType.COLORPROCESS:
				if (this.definition.colorProcess != null) {
					const colorValue = await this.definition.colorProcess();

					if (colorValue == null) {
						this.color = '#FFF';
					} else if (typeof colorValue === 'string') {
						this.color = colorValue;
					} else {
						this.color = colorValue.toHexString();
					}
				}
				break;
		}
	}
	async recalculate() {
		this.setLoading(true);
		if (this.definition.valueProcess != null) {
			let result = await this.definition.valueProcess();
			this.value = result == null ? new Value(null) : new Value(result);
		}
		if (this.definition.displayValueProcess != null) {
			let result = await this.definition.displayValueProcess();
			this.displayValue = result == null ? new Value(null) : new Value(result);
		}
		if (this.definition.onValueChangedProcess != null) {
			await this.definition.onValueChangedProcess(local.oldValue, local.newValue);
		}
		if (this.definition.onValidationProcess != null) {
			this.isValid = await this.definition.onValidationProcess();
		}
		if (this.definition.dropdownProcess != null && this.contentType() == ContentType.KEYWORD) {
			this.listItems = await this.definition.dropdownProcess();
		}
		if (this.definition.onStateProcess != null) {
			this.setState(await this.definition.onStateProcess());
		}
		if (this.definition.colorProcess != null) {
			let colorValue = await this.definition.colorProcess();

			if (colorValue == null) {
				this.color = '#FFF';
			} else if (typeof colorValue === 'string') {
				this.color = colorValue;
			} else {
				this.color = colorValue.toHexString();
			}
		}
		this.setLoading(false);
	}
	refreshVisuals() {
		if (this.hasRenderer()) {
			if (this.displayValue.isNull() || (this.definition.showRawValueInEditMask == true && (sys.operatingState == OperatingState.NEW || sys.operatingState == OperatingState.EDIT))) {
				this.renderer?.setDisplayValue(this.value.getValueAsString());	
			} else {
				this.renderer?.setDisplayValue(this.displayValue.getValueAsString());	
			}
			if (this.contentType() == ContentType.KEYWORD && this.listItems != null) {
				(this.renderer as DropdownRenderer).setItems(this.listItems, true);
			}

			this.renderer?.setColor(this.color);
		}
	}
	setLocal(value:any|null) {
		local.field = this;
		local.fieldDefinition = this.definition;
		local.state = this.state;
		local.value = value ?? this.value;
		local.newValue = value ?? this.value;
		local.oldValue = this.value.value;
	}
	hide() {
		if (this.renderer != null) {
			this.renderer.isHidden = true;
			this.renderer.hide();
		}
	}
	show() {
		if (this.renderer != null) {
			this.renderer.isHidden = false;
			this.renderer.show();
		}
	}
	setLoading(state: boolean) {
		if (this.renderer != null) {
			this.renderer.setLoading(state);
		}
	}
}