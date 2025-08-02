import { entities } from "@/core";
import { ViewData } from "@/models/data";
import { DataTable, Cell } from "@datatable";
import $ from 'jquery';

export class Row {

	id: string;
	index:number = 0;
	element!: JQuery<HTMLElement>;
	cells: Cell[];
	table: DataTable;
	isSelected: boolean = false;
	rowData!: ViewData;

	constructor(table:DataTable, id: string|null, rowIndex:number, cells: Cell[]) {
		this.id = id;
		this.index = rowIndex;
		this.cells = cells;
		this.table = table;
	}
	createHtml(): JQuery<HTMLElement> {
		this.element = $(`<tr></tr>`);
		this.element.on("click", this.onClick.bind(this));
		this.cells.forEach(c => {
			this.element.append(c.createHtml());
		});

		return this.element;
	}
	async loadData() {
		this.rowData = new ViewData(this.table.view.context, this.table.view, this.id);
		this.rowData.loadAllFieldsFromEntity();
		await this.rowData.loadData();
	}
	async renderFields() {
		this.rowData.renderFields(this.createHtml());
	}
	onClick(event: JQuery.ClickEvent) {
		if (this.isSelected == true) {
			this.deselect();
		} else {
			this.select();
		}
	}
	select() {
		this.isSelected = true;
		this.table.selectedRows.forEach(r => {
			if (r.isSelected) {
				r.deselect();
			}
		});

		this.table.selectedRows = [];
		if (this.element != null) {
			this.element.addClass("is-selected");
			
			if (this.table.multiSelect) {
				let selector = $(this.element.find(".datatable-cell-value-selector")[0]);
				selector.prop('checked', true);
			}
		}

		this.table.selectedRows.push(this);
		this.table.fireRowSelected(this);
	}
	deselect() {
		this.isSelected = false;
		this.table.selectedRows = [];

		if (this.element != null) {
			this.element.removeClass("is-selected");

			if (this.table.multiSelect) {
				let selector = $(this.element.find(".datatable-cell-value-selector")[0]);
				selector.prop('checked', false);
			}
		}

		this.table.fireRowDeselected(this);
	}
}