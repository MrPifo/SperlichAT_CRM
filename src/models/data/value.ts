export class Value {

	value: any;

	constructor(value: any) {
		this.value = value;
	}
	setValue(value: any) {
		this.value = value;
	}
	getValueAsString(): string {
		return this.value == null ? '' : this.value.toString();
	}
	getValueAsNumber(): number {
		return Number(this.value);
	}
	isNull(): boolean {
		return this.value == null;
	}
	isEmpty(): boolean {
		return this.value == null || this.value == '';
	}
}