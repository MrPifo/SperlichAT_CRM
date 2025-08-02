import { BaseView, ViewType } from "@views";
import { GenericOptions, ProcessType, ViewData } from "@datamodels";
import $ from "jquery";
import { sys, ViewMode, local, OperatingState } from "@core";
import { Field } from "@models";

export class GenericView extends BaseView {

    container!: JQuery<HTMLElement>;
    headerBar!: JQuery<HTMLElement>;
    table!: JQuery<HTMLElement>;
    form!: JQuery<HTMLElement>;
    viewMode!: ViewMode;
    config: GenericOptions;

    constructor(name:string, columns: string[], config: GenericOptions) {
        super(name, config);
        this.columns = columns;
        this.config = config;
    }

    buildView(parentView: BaseView): void {
        this.viewMode = sys.viewMode;
        this.pageData = new ViewData(this.context, this);
        this.pageData.loadAllFieldsFromEntity();
        this.parentView = parentView;
		
        this.render();
    }
    setData() {}
    async loadData(id: string | null): Promise<void> {
        await super.loadData(id);

        this.pageData.renderFields(this.form);
        this.pageData.setFieldLoadingState(true);
        
        await this.pageData.processFields(ProcessType.VALUE);
        await this.pageData.processFields(ProcessType.DISPLAYVALUE);
        await this.pageData.processFields(ProcessType.ONSTATE);
        await this.pageData.processFields(ProcessType.ONVALUECHANGE);
        await this.pageData.processFields(ProcessType.ONVALIDATION);
        await this.pageData.processFields(ProcessType.COLORPROCESS);
        await this.pageData.processFields(ProcessType.DROPDOWN);
        
        this.pageData.setFieldLoadingState(false);
        this.pageData.refreshFieldVisuals();
    }
    render() {
        this.container = $(`#${this.id}`);
        this.createContainer();

        if (this.config.showTitleBar) {
            this.createHeaderBar(this.config.title);
        }

        this.renderFields();
    }
    createHeaderBar(customTitle?: string) {
        this.headerBar = $(`<div class="box genericViewHeaderTitle is-flex is-align-items-center"><h6 class="title is-6">${customTitle ?? this.name}</h6></div>`);
        this.container.prepend(this.headerBar);
    }
    createContainer() {
        this.table = $(`
            <section class="genericSection is-fullwidth">
            </section>
        `);
        this.form = $(`<div class="genericInputList"></div>`);
        this.table.append(this.form);
        this.container.append(this.table);
    }
    renderFields() {
        this.fields.forEach(f => this.renderField(f));
    }
    renderField(field: Field) {
        field.createRenderer(this.form, {
            noInputElement: sys.operatingState != OperatingState.NEW && sys.operatingState != OperatingState.EDIT,
            viewType:ViewType.Generic
        });
    }
    getData(): Field[] {
        const fields:Field[] = this.fields.map(f => f.getCopy());

        return fields;
    }
}
