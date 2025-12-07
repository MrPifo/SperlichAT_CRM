import { FieldCombi, FieldInfo } from "@types";

export abstract class Context {

    abstract html: JQuery<HTMLElement> | null;
    abstract uid:string;
    abstract contextName:string;
    abstract primaryKey:string;
    abstract table:string;
    abstract fields: FieldInfo[];
    abstract editStructure: FieldCombi[];

    getField(name:string):FieldInfo|null {
        for(let f of this.fields) {
            if(f.name.toLocaleLowerCase() == name.toLocaleLowerCase()) {
                return f;
            }
        }
        return null;
    }

    getValue(name:string):any {
        let fieldInfo = this.getField(name);
        return fieldInfo?.value ?? null;
    }

    setValue(name:string, value:any):void {
        let fieldInfo = this.getField(name);
        if(fieldInfo) {
            fieldInfo.value = value;

            if(fieldInfo.name == this.primaryKey) {
                this.uid = value;
            }
        }
    }

    setValues(data:Record<string, any>):void {
        Object.keys(data).forEach(key => {
            this.setValue(key, data[key]);
        });
    }

    getFieldNames():string[] {
        return this.fields.map(f => f.name);
    }
}