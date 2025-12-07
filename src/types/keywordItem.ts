import { keyword, objects, router } from "@core";
import { FieldCombi, FieldInfo, FieldType, Context, Consumer } from "@types";

export class KeywordItem extends Context {

    html: JQuery<HTMLElement> | null = null;
    uid: string = "";
    contextName: string = "Schlüssel";
    values: Record<string, any> = {};
    primaryKey: string = "KEYWORDID";
    table: string = "KEYWORD";
    fields: FieldInfo[] = [
        new FieldInfo("KEYWORDID", FieldType.TEXT, "SchlüsselId"),
        new FieldInfo("KEYID", FieldType.TEXT, "Schlüssel"),
        new FieldInfo("TITLE", FieldType.TEXT, "Name"),
        new FieldInfo("CATEGORY_ID", FieldType.KEYWORD, "Kategorie", Consumer.fromFunction(async () => {
            let cats = await keyword.getCategories();
            let values:string[][] = [];
            
            for(let c of cats) {
                values.push([c["CATEGORYID"], c["NAME"]]);
            }
            
            return values;
        })),
        new FieldInfo("ICON", FieldType.ICON, "Icon"),
        new FieldInfo("COLOR", FieldType.COLOR, "Farbe"),
        new FieldInfo("ISACTIVE", FieldType.BOOL, "Aktiv")
    ];
    private _editStructure: FieldCombi[] | null = null;
    get editStructure(): FieldCombi[] {
        this._editStructure = [
            new FieldCombi(this, "CATEGORY_ID"),
            new FieldCombi(this, "KEYID", "TITLE"),
            new FieldCombi(this, "ICON", "COLOR"),
            new FieldCombi(this, "ISACTIVE")
        ];
        return this._editStructure;
    }

    createHtml(): JQuery<HTMLElement> {
        let name = this.getValue("NAME") ?? this.getValue("TITLE");
        let keyId = this.getValue("KEYID");
        let title = this.getValue("TITLE");
        let categoryId = this.getValue("CATEGORY_ID");
        let icon = this.getValue("ICON");
        let iconColor = this.getValue("COLOR");
        let isActive = this.getValue("ISACTIVE");
        let key = this;

        this.html = $(`
            <keyword-item keyid="${keyId}" title="${title}" icon="${icon}" color="${iconColor}" active="${isActive}"></keyword-item>
        `);

        return this.html;
    }

    select() {
        this.html?.addClass('selected');
    }

    deselect() {
        this.html?.removeClass('selected');
    }
}