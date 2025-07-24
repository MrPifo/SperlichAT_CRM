import { Datepicker } from 'vanillajs-datepicker';
import { ContentType, Field } from "@models";
import { FieldRenderer, IRenderParams } from "@component";
import dayjs from 'dayjs';
import 'vanillajs-datepicker/locales/de';

export class DateRenderer extends FieldRenderer {

	picker?: Datepicker;

	constructor(field: Field, parentElement: JQuery<HTMLElement>, params: IRenderParams) {
		super(field, parentElement, params)
	}
	onRendererCreated() {
		this.valueHtml.css("color-scheme", "dark");

		if (this.field?.value) {
			this.setDisplayValue(this.field.value);
		}
	}

	setDisplayValue(value: any | null) {
		if (this.noInputElement == true) {
			const dateFormat = this.contentType == ContentType.DATETIME ? 'D.M.YYYY HH:mm' : 'D.M.YYYY';
			this.valueHtml?.html(dayjs(value, 'YYYY-MM-DD').format(dateFormat));
		} else {
			const dateObj = new Date(value);
			this.getPicker().setDate(dateObj);
		}
	}
	getPicker(): Datepicker {
		if (this.picker == null) {
			this.picker = new Datepicker(this.valueHtml[0], {
				format: 'dd.mm.yyyy',
				language: 'de',
				autohide: true,
				clearButton: true,
				todayButton: true,
				weekStart: 1,
				title: this.field != null ? this.field.definition.getTitle() : ''
			});
		}

		return this.picker;
	}
}