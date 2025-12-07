import { FieldCombi, FieldInfo, FieldType, Context, Consumer } from "@types";

export class Kontakt extends Context {
    
    html: JQuery<HTMLElement> | null = null;

    uid:string = "";
    contextName:string = "Kontakt";
    values:Record<string, any> = {};
    colors = { male: '#5989b6', female: '#9b59b6' };
    primaryKey:string = "PERSONID";
    table:string = "PERSON";
    fields: FieldInfo[] = [
        new FieldInfo("PERSONID", FieldType.TEXT, "PersonId"),
        new FieldInfo("FIRSTNAME", FieldType.TEXT, "Vorname"),
        new FieldInfo("LASTNAME", FieldType.TEXT, "Nachname"),
        new FieldInfo("DATEOFBIRTH", FieldType.DATE, "Geburtsdatum"),
        new FieldInfo("LOCATION", FieldType.TEXT, "Adresse"),
        new FieldInfo("GENDER", FieldType.KEYWORD, "Geschlecht", Consumer.fromCategory("Geschlecht")),
        new FieldInfo("MAIL", FieldType.TEXT, "E-Mail"),
        new FieldInfo("PHONE", FieldType.TEXT, "Telefon")
    ];
    private _editStructure: FieldCombi[] | null = null;
    get editStructure(): FieldCombi[] {
        this._editStructure = [
            new FieldCombi(this, "FIRSTNAME", "LASTNAME"),
            new FieldCombi(this, "GENDER", "DATEOFBIRTH"),
            new FieldCombi(this, "MAIL", "PHONE"),
            new FieldCombi(this, "LOCATION")
        ];
        return this._editStructure;
    }

    get avatarColor(): string {
        return this.getValue("GENDER") == 'M' ? this.colors.male : this.colors.female;
    }

    createContactCard(): JQuery<HTMLElement> {
        this.html = $(`
            <contact-card firstname="${this.getValue("FIRSTNAME")}" lastname="${this.getValue("LASTNAME")}" email="${this.getValue("MAIL")}"
            phone="${this.getValue("PHONE")}" gender="${this.getValue("GENDER")}" birthday="${this.getValue("DATEOFBIRTH")}"></contact-card>
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