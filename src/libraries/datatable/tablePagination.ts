import $ from 'jquery';
import { Event } from '../event/event';
import { Button } from '@component';

export class TablePagination {

	currentPage: number = 1;
	rowsPerPage!: number;
	totalRows!: number;
	totalPages!: number;
	containerHtml!: JQuery<HTMLElement>;
	paginationHtml!: JQuery<HTMLElement>;
	paginationListHtml!: JQuery<HTMLElement>;
	prevBtn!: Button;
	nextBtn!: Button;
	onPageChangeEvent!: Event<number>;
	onPageNextEvent!: Event<number>;
	onPagePreviousEvent!: Event<number>;

	constructor() {
		// Events initialisieren
        this.onPageChangeEvent = new Event<number>();
        this.onPageNextEvent = new Event<number>();
        this.onPagePreviousEvent = new Event<number>();
	}
	setDataCounts(rowsPerPage: number, totalRows: number) {
		this.rowsPerPage = rowsPerPage;
		this.totalRows = totalRows;
		this.refresh();
	}
	setPage(pageNumber: number) {
		if (pageNumber < 1 || pageNumber > this.totalPages) return;
		
        this.currentPage = pageNumber;
        this.onPageChangeEvent.invoke(this.currentPage);
        this.refresh();
	}
	refresh() {
		this.clear();
        this.totalPages = Math.ceil(this.totalRows / this.rowsPerPage);

        // Keine Paginierung nötig, wenn es nur eine Seite gibt
        if (this.totalPages <= 1) {
            return;
		}
		
		let prevEl = $(`<li></li>`);
		this.prevBtn = new Button({
			title: "previous",
			classes:["button"]
		});
		this.prevBtn.setParent(prevEl);
		this.prevBtn.onClick.addListener((evt) => {
			this.setPage(this.currentPage - 1);
		});
		this.paginationListHtml.append(prevEl);


		let nextEl = $(`<li></li>`);
		this.nextBtn = new Button({
			title: "next"
		});
		this.nextBtn.setParent(nextEl);
		this.nextBtn.onClick.addListener((evt) => {
			console.log("###");
			this.setPage(this.currentPage + 1);
		});
		this.paginationListHtml.append(nextEl);
	}
	createHtml():JQuery<HTMLElement> {
		this.containerHtml = $(`
			<div id="paginationContainer"></div>
		`);
		this.paginationHtml = $(`
			<nav class="pagination is-small" role="navigation" aria-label="pagination"></nav>
		`);
		this.paginationListHtml = $(`
			<ul class="pagination-list">
				<li>
					<a href="#" class="pagination-previous">Previous</a>
				</li>
				<li>
					<a href="#" class="pagination-link" aria-label="Goto page 1">1</a>
				</li>
				<li>
					<a href="#" class="pagination-link" aria-label="Goto page 45">45</a>
				</li>
				<li>
					<a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
				</li>
				<li>
					<a href="#" class="pagination-link" aria-label="Goto page 47">47</a>
				</li>
				<li>
					<a href="#" class="pagination-link" aria-label="Goto page 86">86</a>
				</li>
				<li>
					<a href="#" class="pagination-next">Next page</a>
				</li>
			</ul>
		`);

		this.paginationHtml.append(this.paginationListHtml);
		this.containerHtml.append(this.paginationHtml);

		return this.containerHtml;
	}
	clear() {
		this.paginationListHtml.empty();
	}
}