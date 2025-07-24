import { DataTable, Cell } from "@datatable";
import $ from 'jquery';

export class Row {

	id: string;
	index:number = 0;
	element?: JQuery<HTMLElement>;
	cells: Cell[];
	table: DataTable;
	isSelected: boolean = false;

	constructor(table:DataTable, id: string, cells: Cell[]) {
		this.id = id;
		this.cells = cells;
		this.table = table;
	}
	createHtml():JQuery<HTMLElement> {
		this.element = $(`<tr></tr>`);
		this.element.on("click", this.onClick.bind(this));
		
		return this.element;
	}
	createFullRowHtml():JQuery<HTMLElement> {
		let el = this.createHtml();
		this.cells.forEach(c => {
			el.append(c.createHtml());
		});

		return el;
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