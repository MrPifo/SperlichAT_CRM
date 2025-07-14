export class Parameter {

	name: string;
	private value?: string | null;

	constructor(name:string, value?:any) {
		this.name = name;
		this.value = value ?? null;
	}
	setValue(value: any) {
		this.value = value;
	}
	getValue(): any {
		return this.value;
	}
	clear() {
		this.value = undefined;
	}
}