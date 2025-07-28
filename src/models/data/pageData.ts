import { BaseView, ViewType } from "@views";
import { OperatingState, sys } from "@core";
import { EntityData, ProcessType, Value } from "@datamodels";
import { Field } from "@models";

export class ViewData {

	context: string;
	view: BaseView;
	uuid!: string;
	srcData!: EntityData;
	fieldMap: Record<string, Field>;

	constructor(context: string, view:BaseView, uuid?: string, data?: EntityData) {
		this.context = context;
		this.view = view;
		this.fieldMap = {};

		if (uuid != null) {
			this.uuid = uuid;
		}
		if (data != null) {
			this.setData(data);
		}
	}
	setId(uuid: string) {
		this.uuid = uuid;
	}
	setData(data: EntityData) {
		this.srcData = data;
		this.uuid = data.uuid;

		for (const fieldName in data.fieldMap) {
			this.fieldMap[fieldName] = data.fieldMap[fieldName];
		}
	}
	setFieldLoadingState(state: boolean) {
		for (const fieldName in this.fieldMap) {
			this.fieldMap[fieldName].setLoading(state);
		}
	}
	async processFields(type: ProcessType) {
		const promises: any[] = [];
		
		for (const fieldName in this.fieldMap) {
			promises.push(this.fieldMap[fieldName].execute(type));
		}

		await Promise.all(promises);
	}
	refreshFieldVisuals() {
		for (const fieldName in this.fieldMap) {
			this.fieldMap[fieldName].refreshVisuals();
		}
	}
	setFieldsFromArray(fields: string[]) {
		this.fieldMap = {};
		
		//this.fields = this.columns?.map(c => new Field(this.entity.name, c, this.viewMode)) ?? [];
		for (const fieldSrc of fields) {
			const field = new Field(this.context, fieldSrc, null);
			this.fieldMap[fieldSrc] = field;
		}
	}
	setFields(fields: Field[]) {
		this.fieldMap = {};

		fields.forEach(f => {
			this.fieldMap[f.fieldName] = f;
		});
	}
	renderFields(form:JQuery<HTMLElement>) {
		for (const fieldName in this.fieldMap) {
			this.fieldMap[fieldName].createRenderer(form, {
				noInputElement: sys.operatingState != OperatingState.NEW && sys.operatingState != OperatingState.EDIT,
				viewType:ViewType.Generic
			});
		}
	}
}