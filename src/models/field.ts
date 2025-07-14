import { entities, ViewMode } from "@core";
import { FieldRenderer } from "@component";
import { FieldDefinition } from "@models";
import { Value } from "./data";

export class Field {

	// Field Info
    definition: FieldDefinition;
    entityName: string;
	fieldName: string;
	renderer?: FieldRenderer;

	// data
	value: Value;
	displayValue: string | null = null;

	// states
	viewMode: ViewMode;

	// Properties
	hasRenderer = (): boolean => this.renderer != null;

    constructor(entityName: string, fieldName: string, mode?:ViewMode) {
        this.definition = entities.getEntity(entityName).getField(fieldName);
        this.entityName = entityName;
        this.fieldName = fieldName;
		this.viewMode = mode ?? ViewMode.DETAIL;
		this.value = new Value(null);
    }
	createRenderer(parent:JQuery<HTMLElement>) {
		this.renderer = new FieldRenderer(this, parent);
	}
    
	setData(value: string|Number|Object|null) {
		this.value.setValue(value);

		if (this.hasRenderer()) {
			this.renderer?.setDisplayValue(this.value.getValueAsString());	
		}
    }
	getValue(): string {
		return this.value.getValueAsString();
	}
}