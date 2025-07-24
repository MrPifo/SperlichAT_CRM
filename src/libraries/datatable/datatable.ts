import $ from 'jquery';
import { Cell, Row, HeaderColumn, DataTableConfig } from '@datatable';
import { TableView } from '@views';
import { ContentType } from '@/models';
import { local } from '@/core';

export class DataTable {

	private view: TableView;
	private container: JQuery<HTMLElement>;
	public tableContainerHtml!: JQuery<HTMLElement>;
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

	constructor(view: TableView, containerId: string, config?: DataTableConfig) {
		this.view = view;
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
		this.tableContainerHtml = $(`<table class="section table datatable is-hoverable is-fullwidth is-striped is-narrow"></table>`);
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
	async renderBody() {
		this.bodyHtml.empty();
		this.rows.forEach(row => {
			this.bodyHtml.append(row.createFullRowHtml());
		});
		for (const row of this.rows) {
			local.fieldMap = {};
			const setValuePromises:any = [];
			
			row.cells.forEach(c => {
				//@ts-ignore
				local.fieldMap[c.field?.fieldName] = c.field;
				if (c.field?.setValue) {
					setValuePromises.push(c.field.setValue(c.value, true));
				}
			});
			
			await Promise.all(setValuePromises);
		}
		
		for (const row of this.rows) {
			for (const cell of row.cells) {
				await cell.setValue(cell.value);
			}
		}
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
		let selectorColumn = new HeaderColumn(0, "SELECTOR", "", ContentType.BOOLEAN);
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
				
				if (column.contentType === ContentType.BOOLEAN) {
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
				
				const cell: Cell = new Cell(this.view.entity.name, column.name, cellValue, column.contentType);
				
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