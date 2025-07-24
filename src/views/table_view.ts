import { EntityData, TableOptions } from "@datamodels";
import { BaseView } from "@views";
import { DataTable, HeaderColumn } from "@datatable";
import $ from 'jquery';
import { db, entities, sys, ViewMode } from "@core";
import { Row } from "@datatable";
import { Router } from "@/router/router";
import { ConfigTools, OperationMethod } from "@/pages/configTools";
import { ContentType } from "@models";

export class TableView extends BaseView {

	columns: string[];
	hiddenColumns: string[] = [];
	table!: DataTable;
	config: TableOptions;
	sectionHtml!: JQuery<HTMLElement>;
	tableHtmlElement!: JQuery<HTMLElement>;
	data!: EntityData;
	tools!: ConfigTools;
	showTools: boolean;
	multiSelect: boolean;
	showRowCount: boolean;
	enableSearch: boolean;
	isLookup: boolean;

	constructor(name: string, columns: string[], config: TableOptions) {
		super(name, config);
		this.columns = columns;
		this.config = config;
		this.showTools = config.showTools ?? true;
		this.multiSelect = config.multiSelect!;
		this.showRowCount = config.showRowCount!;
		this.enableSearch = config.enableSearch!;
		this.isLookup = config.isLookup!;
		this.columns.unshift("#UUID");
		this.hiddenColumns.push("#UUID");
		this.fields = [];

		window.addEventListener('resize', function(event) {
			
		}, true);
	}
	async loadData(id:string|null): Promise<void> {
		await super.loadData(id);

		this.table.setData(this.rows.getDataByColumns(this.columns));
		this.table.refresh();
	}
	buildView(parentView: BaseView|null): void {
		this.parentView = parentView;
		this.table = this.createTable();
		this.tableHtmlElement = $(`#${this.id}`);

		this.table.render();
		this.sectionHtml = $('<section class="section" style="padding-top:10px"></section>');
		this.sectionHtml.append(this.table.tableContainerHtml);
		this.tableHtmlElement.append(this.sectionHtml);
		
		if (this.showTools == true) {
			this.tools = this.createHeader();
			this.tools.subscribe(OperationMethod.CREATE, () => {
				Router.instance.openContext(this.entity, ViewMode.NEW, null);
			});
			this.tools.subscribe(OperationMethod.EDIT, (id: string) => {
				Router.instance.openContext(this.entity, ViewMode.EDIT, id);
			});
			this.tools.subscribe(OperationMethod.DELETE, async (id: string) => {
				const entity = entities.getEntity(this.entity.name);

				await db.deleteData(entity.db.table, `${entity.db.primaryKeyColumn}='${id}'`);

				if (Router.instance.previewWindow.rowId == id) {
					Router.instance.closePreviewWindow();
				}

				this.page.loadData();
				this.table.refresh();
			});
		}
	}

	createTable(): DataTable {
		const options = {
			columns: this.columns.map((c, index) => {
				let contentType = ContentType.TEXT;
				const fieldDef = this.entity.getFieldNameByColumn(c);
				if (fieldDef != null) {
					contentType = fieldDef.contentType;
				}

				let col = new HeaderColumn(index, c, entities.getFieldTitle(this.entity.name, c), contentType);

				if (this.hiddenColumns.includes(c)) {
					col.hideColumn();
				}

				return col;
			}),
			multiSelect:this.multiSelect,
			searchable: this.enableSearch,
			columnId:"#UID"
		};

		const table = new DataTable(this, this.id, options);
		table.onRowSelected.push(this.onRowSelected.bind(this));
		table.onRowDeselected.push(this.onRowDeselected.bind(this));

		return table;
	}
	createHeader(): ConfigTools {
		this.tools = new ConfigTools(this.id);
		this.tools.disableOperation(OperationMethod.EDIT);
		this.tools.disableOperation(OperationMethod.DELETE);
		
		return this.tools;
	}
	setStyling() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		let table = this.tableHtmlElement;
		let container = table.parent();
		let amountVerticalViews = this.page.views.length;
		let computedHeight = this.config.customHeight ?? height;
		computedHeight -= 215;

		if (this.config.enableSearch == true) {
			computedHeight -= 75;
		}
		if (amountVerticalViews > 1 && this.config.customHeight == null) {
			computedHeight = computedHeight / 2;
		}

		if (container != null) {
			container.css("height", computedHeight + "px");
		}
	}
	onRowSelected(row: Row) {
		sys.selectedRow = row.id;

		if (this.showTools) {
			this.tools.enableOperation(OperationMethod.EDIT);
			this.tools.enableOperation(OperationMethod.DELETE);
		}
		if (this.isLookup) {
			Router.instance.lookupWindow.setRowId(row.id);
		} else {
			Router.instance.openPreviewWindow(this.entity.name, ViewMode.DETAIL, row.id);
		}
	}
	onRowDeselected(row: Row) {
		if (this.showTools) {
			this.tools.disableOperation(OperationMethod.EDIT);
			this.tools.disableOperation(OperationMethod.DELETE);
		}

		if (this.isLookup == false) {
			Router.instance.closePreviewWindow();
		}
	}
}