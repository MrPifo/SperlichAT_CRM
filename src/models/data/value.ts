export class Value {

	value: string | Number | Object | null;

	constructor(value: string | Number | Object | null) {
		this.value = value;
	}
	setValue(value: string | Number | Object | null) {
		this.value = value;
	}
	getValueAsString(): string {
		return this.value == null ? '' : this.value.toString();
	}
	getValueAsNumber(): Number {
		return this.value as Number;
	}
}