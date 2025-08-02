import { BaseView, ViewType } from "@views";
import { buildLocal, entities, EntityLoader, OperatingState, sys } from "@core";
import { EntityData, ProcessType, Value } from "@datamodels";
import { Field, FieldDefinition, Parameter } from "@models";

export class ViewData {

	context: string;
	view: BaseView;
	uuid!: string;
	srcData!: EntityData;
	fieldMap: Record<string, Field>;

	constructor(context: string, view:BaseView, uuid?: string) {
		this.context = context;
		this.view = view;
		this.fieldMap = {};

		if (uuid != null) {
			this.uuid = uuid;
		}
	}
	loadAllFieldsFromEntity() {
		const entity = entities.getEntity(this.context);
		const viewFields:string[] = this.view.columns;
		
		for (const fieldName in entity.fields) {
			const field = new Field(this.context, fieldName, null);

			if (viewFields.includes(fieldName) == false) {
				field.isPassive = true;	
			}

			this.fieldMap[fieldName] = field;
		}
	}
	async loadData() {
		const loadableFields = this.getLoadableFields();
		const data = await new EntityLoader(this.context).parameters([
			new Parameter("singleRowId", this.uuid)
		]).fields(loadableFields).getRow();
		
		for (const fieldName in data.fieldMap) {
			const field = data.fieldMap[fieldName];
			this.fieldMap[fieldName] = field;
		}
	}
	getLoadableFields():string[] {
		const fields: string[] = [];
		
		for (const fieldName in this.fieldMap) {
			const field = this.fieldMap[fieldName];

			if (field.isPassive == false && field.isDataField == false) {
				if (field.fieldName == "#UUID") {
					fields.push(field.definition.column());
				} else {
					fields.push(fieldName);
				}
			}
		}

		return fields;
	}
	/*setData(data: EntityData) {
		this.srcData = data;
		this.uuid = data.uuid;

		for (const fieldName in data.fieldMap) {
			this.fieldMap[fieldName] = data.fieldMap[fieldName];
		}
	}*/
	setFieldLoadingState(state: boolean) {
		for (const fieldName in this.fieldMap) {
			this.fieldMap[fieldName].setLoading(state);
		}
	}
	async processFields(type: ProcessType) {
		const promises: any[] = [];


		for (const fieldName in this.fieldMap) {
			const local = buildLocal();
			local.setMap(this.fieldMap);

			promises.push(this.fieldMap[fieldName].execute(local, type));
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
	getFields(): string[] {
		const fields = [];

		for (const fieldName in this.fieldMap) {
			fields.push(fieldName);
		}

		return fields;
	}
	renderFields(form:JQuery<HTMLElement>) {
		for (const fieldName in this.fieldMap) {
			this.renderField(form, fieldName);
		}
	}
	renderField(form: JQuery<HTMLElement>, fieldName: string) {
		const field = this.fieldMap[fieldName];

		if (field.isPassive == false) {
			this.fieldMap[fieldName].createRenderer(form, {
				noInputElement: sys.operatingState != OperatingState.NEW && sys.operatingState != OperatingState.EDIT,
				viewType: ViewType.Generic
			});
		}
	}
}