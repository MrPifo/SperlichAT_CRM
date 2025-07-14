import $ from 'jquery';
import { Cell, Row, HeaderColumn, DataTableConfig } from '@datatable';

export class DataTable {

	private container: JQuery<HTMLElement>;
	private tableContainerHtml!: JQuery<HTMLElement>;
	private headerHtml!: JQuery<HTMLElement>;
	private bodyHtml!: JQuery<HTMLElement>;
	private footerHtml!: JQuery<HTMLElement>;

	// Config
	selectAllRows: boolean = false;
	multiSelect: boolean = false;
	headerColumns: HeaderColumn[] = [];

	// Data
	public rows: Row[] = [];
	selectedRows: Row[] = [];

	// Callbacks
	onRowSelected: ((row: Row) => void)[] = [];
	onRowDeselected: ((row: Row) => void)[] = [];

	constructor(containerId: string, config?: DataTableConfig) {
		this.container = $(`#${containerId}`);

		if (config != null) {
			this.multiSelect = config.multiSelect;
			this.setColumns(config.columns);
		}

		this.renderTableContainer();
	}

	render() {
		this.renderHeader();
		this.renderBody();
		this.renderFooter();
	}
	refresh() {
		this.render();
	}
	renderTableContainer() {
		this.tableContainerHtml = $(`<table class='table table-scroll table-striped table-hover datatable'></table>`);
		this.tableContainerHtml.empty();
		this.headerHtml = $(`<thead></thead>`);
		this.bodyHtml = $(`<tbody></tbody>`);
		this.footerHtml = $(`<tfoot></tfoot>`);
		this.tableContainerHtml.append(this.headerHtml);
		this.tableContainerHtml.append(this.bodyHtml);
		this.tableContainerHtml.append(this.footerHtml);
		this.container.append(this.tableContainerHtml);
		this.renderEmptyRows();
	}
	renderBody() {
		this.bodyHtml.empty();
		this.rows.forEach(row => {
			this.bodyHtml.append(row.createFullRowHtml());
		});
	}
	renderHeader() {
		this.headerHtml.empty();
		const headerRow = $('<tr></tr>');
		this.headerColumns.forEach(c => {
			headerRow.append(c.createHtml());
		});
		this.headerHtml.append(headerRow);
	}
	renderFooter() {
		this.footerHtml.empty();
		let entryCountText = $(`
			<span>Entries: ${this.rows.length}</span>
		`);
		this.footerHtml.append(entryCountText);
	}
	renderEmptyRows() {

	}
	setColumns(columns: HeaderColumn[]) {
		let selectorColumn = new HeaderColumn(0, "SELECTOR", "", ContentType.SELECTOR);
		columns.unshift(selectorColumn);

		if (this.multiSelect == false) {
			selectorColumn.hideColumn();
		}

		columns.forEach(c => {
			c.table = this;
		});

		this.headerColumns = columns;
	}
	setData(data: string[][]) {
		this.rows = [];
		this.rows = data.map((src, rowIndex) => {
			const cells: Cell[] = [];
			let dataIndex = 0;
			
			this.headerColumns.forEach((column, columnIndex) => {
				let cellValue: string;
				
				if (column.contentType === ContentType.SELECTOR) {
					// SELECTOR bekommt immer den ersten Wert (die ID)
					cellValue = src[0];
				} else if (column.name === "#UUID") {
					// #UUID bekommt auch den ersten Wert (die ID)
					cellValue = src[0];
					dataIndex = 1; // Nächste Daten ab Index 1
				} else {
					// Alle anderen Columns bekommen die Daten der Reihe nach
					cellValue = src[dataIndex];
					dataIndex++;
				}
				
				const cell: Cell = new Cell(column.name, cellValue, column.contentType);
				
				if (column.hidden) {
					cell.hide();
				}
				
				cells.push(cell);
			});

			const row: Row = new Row(this, src[0], cells);
			row.index = rowIndex;
			row.cells.forEach(c => c.row = row);

			return row;
		});
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
}
export enum ContentType {
	TEXT,
	BOOLEAN,
	SELECTOR
}