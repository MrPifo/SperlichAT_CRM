import $ from 'jquery';
import { Cell, Row, HeaderColumn, DataTableConfig, TablePagination } from '@datatable';
import { TableView } from '@views';
import { ContentType, Field } from '@/models';
import { ProcessType, ViewData } from '@/models/data';
import { db, entities, EntityLoader, SqlBuilder } from '@/core';

export class DataTable {

	public view: TableView;
	private container: JQuery<HTMLElement>;
	public tableContainerHtml!: JQuery<HTMLElement>;
	private headerHtml!: JQuery<HTMLElement>;
	private bodyHtml!: JQuery<HTMLElement>;
	private footerHtml!: JQuery<HTMLElement>;
	private paginator!: TablePagination;

	// Config
	selectAllRows: boolean = false;
	multiSelect: boolean = false;
	headerColumns: HeaderColumn[] = [];

	// Data
	context: string;
	public rows: Row[] = [];
	selectedRows: Row[] = [];
	pageNumber!: number;
	rowData!: ViewData[];
	pageData!: ViewData[];
	rowIds!: string[];
	rowCount!: number;
	totalRowCount!: number;
	pageLength: number = 20;

	// Callbacks
	onRowSelected: ((row: Row) => void)[] = [];
	onRowDeselected: ((row: Row) => void)[] = [];

	constructor(view: TableView, context:string, containerId: string, config?: DataTableConfig) {
		this.context = context;
		this.view = view;
		this.container = $(`#${containerId}`);

		if (config != null) {
			this.multiSelect = config.multiSelect;
			this.setColumns(config.columns);
		}

		this.paginator = new TablePagination();
		this.paginator.onPageChangeEvent.addListener((pageNum) => {
			this.loadData(pageNum);
		});
		this.renderTableContainer();
	}

	render() {
		this.renderHeader();
		this.renderRows();
		this.renderFooter();
	}
	refresh() {
		this.render();
	}
	renderTableContainer() {
		this.tableContainerHtml = $(`<table class="section table datatable is-hoverable is-fullwidth is-striped is-narrow"></table>`);
		this.tableContainerHtml.empty();
		this.headerHtml = $(`<thead></thead>`);
		this.bodyHtml = $(`<tbody></tbody>`);
		this.footerHtml = $(`<tfoot></tfoot>`);
		this.footerHtml.append(this.paginator.createHtml());
		this.tableContainerHtml.append(this.headerHtml);
		this.tableContainerHtml.append(this.bodyHtml);
		this.tableContainerHtml.append(this.footerHtml);
		this.container.append(this.tableContainerHtml);
	}
	renderHeader() {
		this.headerHtml.empty();
		const headerRow = $('<tr></tr>');
		this.headerColumns.forEach(c => {
			headerRow.append(c.createHtml());
		});
		this.headerHtml.append(headerRow);
	}
	async renderRows() {
		this.bodyHtml.empty();
		this.rows = [];

		for (let i = 0; i < this.rowCount; i++) {
			const data = this.rowData[i];
			const fields = data.getFields();
			const row = new Row(this, data.uuid, i, []);
			row.rowData = data;
			
			for (let c = 0; c < this.headerColumns.length; c++) {
				const columnName = this.headerColumns[c];
				const field: Field = data.fieldMap[columnName.name];

				const cell = new Cell(field);

				if (columnName.hidden == true) {
					cell.hide();
				}

				row.cells.push(cell);
			}

			this.rows.push(row);
		}

		for (const row of this.rows) {
			this.bodyHtml.append(row.createHtml());
		}
		
		const rowPromises = [];
		for (const row of this.rows) {
			const rowPromise = async () => {
				row.rowData.setFieldLoadingState(true);
				
				await row.rowData.processFields(ProcessType.VALUE);
				await row.rowData.processFields(ProcessType.DISPLAYVALUE);
				await row.rowData.processFields(ProcessType.ONSTATE);
				await row.rowData.processFields(ProcessType.ONVALUECHANGE);
				await row.rowData.processFields(ProcessType.ONVALIDATION);
				await row.rowData.processFields(ProcessType.COLORPROCESS);
				await row.rowData.processFields(ProcessType.DROPDOWN);
				
				row.rowData.setFieldLoadingState(false);
				row.rowData.refreshFieldVisuals();
			};
			
			rowPromises.push(rowPromise());
		}

		await Promise.all(rowPromises);
	}
	renderFooter() {
		this.footerHtml.empty();
		let entryCountText = $(`
			<tr>
				<td colspan="999">
					<div id="footerElementList" class="is-flex is-justify-content-space-between" style="width: 100%;">
						<div>
							<span class="has-text-grey-dark">Entries: ${this.totalRowCount}</span>
						</div>
					</div>
				</td>
			</tr>
		`);
		this.footerHtml.append(entryCountText);
		this.footerHtml.find('#footerElementList').append(this.paginator.containerHtml);
		//this.paginator.clear();
	}
	preloadSite(ids:string[]) {
		this.bodyHtml.empty();
		this.rows = [];

		for (let i = 0; i < ids.length; i++) {
			const row = new Row(this, ids[i], i, []);
			this.bodyHtml.append(row.createHtml());

			this.rows.push(row);
		}
	}
	setColumns(columns: HeaderColumn[]) {
		let selectorColumn = new HeaderColumn(0, "SELECTOR", "", ContentType.NUMBER);
		columns.unshift(selectorColumn);

		if (this.multiSelect == false) {
			selectorColumn.hideColumn();
		}

		columns.forEach(c => {
			c.table = this;
		});

		this.headerColumns = columns;
	}
	getRow():JQuery<HTMLElement> {
		const row = $(`<tr></tr>`);
		row.addClass("datatable-row");
		
		return row;
	}
	fireRowSelected(row: Row) {
        this.onRowSelected.forEach(callback => callback(row));
	}
	fireRowDeselected(row: Row) {
		this.onRowDeselected.forEach(callback => callback(row));
	}
	async loadData(pageNumber: number) {
		this.pageNumber = pageNumber;
		const rowRange: number = pageNumber * this.pageLength;
		const entity = entities.getEntity(this.context);
		const sqlBuilder = entity.transpileQuery({
			returnAsBuilder: true,
			fields:[entity.getPrimaryKeyColumn()]
		}) as SqlBuilder;
		const rowCountSql = entity.transpileQuery({
			returnAsBuilder: false,
			fields:[`COUNT(1)`]
		}) as string;
		
		this.rowIds = (await sqlBuilder
			.limit(this.pageLength)
			.offset(rowRange)
			.table()).flatMap(r => r);
		
		this.rows = [];
		this.rowData = [];
		this.rowCount = this.rowIds.length;
		this.totalRowCount = Number(await db.cell(rowCountSql));
		this.preloadSite(this.rowIds);

		const rowPromises = [];
		for (let i = 0; i < this.rowCount; i++) {
			const id = this.rowIds[i];
			const viewData = new ViewData(this.context, this.view, id);
			viewData.loadAllFieldsFromEntity();
			
			this.rowData.push(viewData);
			rowPromises.push(viewData.loadData());
		}

		await Promise.all(rowPromises);

		for (let i = 0; i < this.rowCount; i++) {
			const rowData = this.rowData[i];
			rowData.fieldMap["SELECTOR"] = new Field(this.context, "SELECTOR", i * (this.pageNumber + 1));
			rowData.fieldMap["SELECTOR"].definition.displayValueProcess = async function (local):Promise<any> {
				if (local.value != null) {
					return local.value.toString().split('.')[0];
				}
				return local.value;
			};
			//rowData.fieldMap["#UUID"] = new Field(this.context, "#UUID");
		}

		this.paginator.setDataCounts(this.pageLength, this.totalRowCount);
		this.paginator.setPage(pageNumber);
	}
}