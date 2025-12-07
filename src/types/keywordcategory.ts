import { objects, router } from "@/core";
import { FieldCombi, FieldInfo, FieldType, Context } from "@types";

export class KeywordCategory extends Context {

    html: JQuery<HTMLElement> | null = null;
    uid: string = "";
    contextName: string = "Kategorie";
    values: Record<string, any> = {};
    primaryKey: string = "CATEGORYID";
    table: string = "CATEGORY";
    fields: FieldInfo[] = [
        new FieldInfo("CATEGORYID", FieldType.TEXT, "KategorieId"),
        new FieldInfo("NAME", FieldType.TEXT, "Name"),
        new FieldInfo("ICON", FieldType.ICON, "Icon"),
        new FieldInfo("COLOR", FieldType.COLOR, "Farbe")
    ];
    private _editStructure: FieldCombi[] | null = null;
    get editStructure(): FieldCombi[] {
        this._editStructure = [
            new FieldCombi(this, "NAME"),
            new FieldCombi(this, "ICON", "COLOR")
        ];
        return this._editStructure;
    }

    createHtml(): JQuery<HTMLElement> {
        let name = this.getValue("NAME") ?? this.getValue("TITLE");
        let icon = this.getValue("ICON");
        let iconColor = this.getValue("COLOR");
        let categoryId = this.getValue("CATEGORYID");
        const isUngrouped = categoryId === "UNGROUPED";

        this.html = $(`
            <keyword-category name="${name}" icon="${icon}" color="${iconColor}" categoryid="${categoryId}" active="false" ungrouped="${isUngrouped}">
        `);

        return this.html;
    }

    attachEvents() {
        let category = this;

        this.html!.find('.category-edit').on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();

            router.openPage(router.PAGES.Edit, {
                mode: "edit",
                context: router.PAGES.Kategorie,
                id: category.uid
            });
        });

        this.html!.find('.category-delete').on("click", async function (e) {
            e.stopPropagation();
            e.preventDefault();

            await objects.deleteObject(router.PAGES.Kategorie, category.uid);
            location.reload();
        });
    }

    select() {
        this.html?.addClass('selected');
    }

    deselect() {
        this.html?.removeClass('selected');
    }
}