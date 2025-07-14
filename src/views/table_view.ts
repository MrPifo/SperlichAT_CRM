import { EntityData, EntityDataRows, TableOptions } from "@datamodels";
import { BaseView } from "@views";
import { DataTable, HeaderColumn } from "@datatable";
import $ from 'jquery';
import { entities, ViewMode } from "@core";
import { Row } from "@datatable";
import { Router } from "@/router/router";
import { ConfigTools, OperationMethod } from "@/pages/configTools";

export class TableView extends BaseView {

	columns: string[];
	hiddenColumns: string[] = [];
	table!: DataTable;
	config: TableOptions;
	tableHtmlElement!: JQuery<HTMLElement>;
	data!: EntityData;
	tools!: ConfigTools;

	constructor(name: string, columns: string[], config: TableOptions) {
		super(name, config);
		this.columns = columns;
		this.config = config;
		this.columns.unshift("#UUID");
		this.hiddenColumns.push("#UUID");

		window.addEventListener('resize', function(event) {
			
		}, true);
	}
	setData(data: EntityDataRows): void {
		this.table.setData(data.getDataByColumns(this.columns));
		this.table.refresh();
	}
	buildView(parentView: BaseView|null): void {
		this.parentView = parentView;
		this.table = this.createTable();
		this.tableHtmlElement = $(`#${this.id}`);

		this.table.render();
		this.tools = this.createHeader();
		this.tools.subscribe(OperationMethod.CREATE, () => {
			Router.instance.openContext(this.entity, ViewMode.NEW, null);
		});
	}

	createTable(): DataTable {
		const options = {
			columns: this.columns.map((c, index) => {
				let col = new HeaderColumn(index, c, entities.getFieldTitle(this.entity.name, c));

				if (this.hiddenColumns.includes(c)) {
					col.hideColumn();
				}

				return col;
			}),
			multiSelect:true,
			searchable: false,
			columnId:"#UID"
		};

		const table = new DataTable(this.id, options);
		table.onRowSelected.push(this.onRowSelected.bind(this));
		table.onRowDeselected.push(this.onRowDeselected.bind(this));

		return table;
	}
	createHeader(): ConfigTools {
		this.tools = new ConfigTools(this.id);
		
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
		this.tools.enableOperation(OperationMethod.EDIT);
		this.tools.enableOperation(OperationMethod.DELETE);
		Router.instance.openPreviewWindow(this.entity.name, ViewMode.DETAIL, row.id);
	}
	onRowDeselected(row: Row) {
		this.tools.disableOperation(OperationMethod.EDIT);
		this.tools.disableOperation(OperationMethod.DELETE);
		Router.instance.closePreviewWindow();
	}
}