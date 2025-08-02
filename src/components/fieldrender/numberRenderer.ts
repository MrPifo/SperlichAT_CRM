import { FieldRenderer } from "@component";

export class NumberRenderer extends FieldRenderer {

	onRendererCreated() {
		this.valueHtml.css("color-scheme", "dark");
		this.valueHtml.prop('type', "tel");
	}
	setDisplayValue(value: any | null) {
		let displayText = value == null ? "" : value.toString();
		displayText = parseFloat(displayText.trim());

		if (isNaN(displayText)) {
			displayText = 0;
		}

		if (this.field?.displayValue != null) {
			displayText = this.field.displayValue.getValueAsString(); 
		} else {
			displayText = this.formatNumber(displayText); 
		}

		if (this.noInputElement == true) {
			this.valueHtml?.html(displayText);
		} else {
			this.valueHtml?.val(displayText);
		}
	}
	formatNumber(num: number): string {
		if (num % 1 === 0) return num.toFixed(2); // Ganze Zahlen
    	return num.toFixed(2).replace(/0$/, ''); // Entferne nur die letzte 0
	}
}