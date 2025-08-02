import { ContentType } from "@models";
import { DataTable } from "@datatable";
import $ from 'jquery';

export class HeaderColumn {

	name: string;
	title?: string;
	hidden: boolean = false;
	contentType: ContentType;
	element?: JQuery<HTMLElement>;
	index: number = 0;
	table!: DataTable;

	constructor(index:number, name: string, title?:string, contentType?:ContentType, hidden?:boolean) {
		this.index = index;
		this.name = name;
		this.title = title;
		this.contentType = contentType ?? ContentType.TEXT;
		this.hidden = hidden ?? false;
	}
	createHtml(): JQuery<HTMLElement> {
		this.element = $(`<th>${this.title ?? this.name}</th>`);
		this.element.addClass("datatable-column");

		if (this.contentType == ContentType.BOOLEAN) {
			this.element.addClass("datatable-column-selector");
		}

		if (this.hidden) {
			this.hideColumn();
		}
		if (this.contentType == ContentType.SELECTOR) {
			let selector = $(`
				<label>
					<input type="checkbox" value="false" name="SELECTOR" />
					<span></span>
				</label>
			`);
			selector.find("input").addClass("datatable-header-column-selector");
			selector.find("input").addClass("datatable-cell-value-selector");
			selector.find("input").addClass("filled-in");
			selector.on("click", this.selectAllRows.bind(this));
			this.element.append(selector);
		}

		return this.element;
	}
	showColumn() {
		this.hidden = false;
		this.element?.removeClass('hideColumn');
	}
	hideColumn() {
		this.hidden = true;
		this.element?.addClass('hideColumn');
	}
	selectAllRows() {
		if (this.table.selectAllRows == false) {
			this.table.selectAllRows = true;
			this.table.rows.forEach(r => {
				r.select();
			});
		} else {
			this.table.selectAllRows = false;
			this.table.rows.forEach(r => {
				r.deselect();
			});
		}
	}
}