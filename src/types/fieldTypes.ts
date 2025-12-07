import { keyword, utils } from "@core";
import { Consumer, Context } from "@types";

export enum FieldType {
    TEXT = "TEXT",
    LONGTEXT = "LONGTEXT",
    DATE = "DATE",
    KEYWORD = "KEYWORD",
    BOOL = "BOOLEAN",
    ICON = "ICON",
    COLOR = "COLOR"
}

export class FieldInfo {

    name: string;
    type: FieldType;
    label: string;
    value:string|number|null = null;
    consumer:Consumer|null = null;
    keywords:string[][]|null = null;

    constructor(name: string, type: FieldType, label?: string, consumer?: Consumer) {
        this.name = name;
        this.type = type;
        this.label = label ?? name;
        this.consumer = consumer ?? null;
        
        if(type == FieldType.KEYWORD && consumer != null) {
            consumer.getValues().then(values => {
                this.keywords = values;
            });
        }
    }

    async getKeywordValues():Promise<string[][]> {
        let values = await this.consumer!.getValues();
        return values;
    }
}

export class FieldCombi {
    fields: FieldInfo[];

    constructor(context: string | Context, ...fieldNames: string[]) {
        this.fields = [];
        
        let ctx: Context;
        if (typeof context === 'string') {
            ctx = utils.getContextByName(context)!;
        } else {
            ctx = context;
        }
        
        fieldNames.forEach(name => {
            const fieldInfo = ctx.getField(name);
            
            if (fieldInfo) {
                this.fields.push(fieldInfo);
            }
        });
    }

    get columnCount(): number {
        return this.fields.length;
    }
}