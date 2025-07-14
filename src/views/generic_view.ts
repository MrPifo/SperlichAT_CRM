import { EntityData } from "@datamodels";
import { BaseView } from "@views";
import { GenericOptions } from "@datamodels";
import $ from "jquery";
import { ViewMode } from "@core";
import { Field } from "@models";

export class GenericView extends BaseView {

    container!: JQuery<HTMLElement>;
    headerBar!: JQuery<HTMLElement>;
    columns?: string[];
    fields!: Field[];
    table!: JQuery<HTMLElement>;
    viewMode!: ViewMode;
    config: GenericOptions;

    constructor(name:string, columns: string[], config: GenericOptions) {
        super(name, config);
        this.columns = columns;
        this.config = config;
    }

    buildView(parentView: BaseView, mode: ViewMode): void {
        this.viewMode = mode;
        this.fields = this.columns?.map(c => new Field(this.entity.name, c, mode)) ?? [];
        this.parentView = parentView;
		
        this.render();
    }
    setData(data: EntityData): void {
        this.fields.forEach(f => {
            f.setData(data.extractColumn(f.fieldName));
        });
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
        this.headerBar = $(`<span class="genericLabelHeader">${customTitle ?? this.name}</span>`);
        this.container.prepend(this.headerBar);
    }
    createContainer() {
        this.table = $(`<div class="columns"></div>`);
        this.container.append(this.table);
    }
    renderFields() {
        this.fields.forEach(f => this.renderField(f));
    }
    renderField(field: Field) {
        field.createRenderer(this.table);
        this.table.append();
    }
}
