import { Context } from "@types";
import { db, Formular, router, SqlBuilder, utils } from "@core";
import $ from "jquery";

const params = new URLSearchParams(window.location.search);
const type = params.get('context') ?? '';
const uid = params.get('id') ?? utils.getUUID();
const mode = params.get('mode') != null ? params.get('mode')?.toLowerCase() : "new";
const editForm = $("#edit-formular-fields");
const cancelBtn = $("#cancel-btn");
const saveBtn = $("#save-btn");
editForm.html("");
init();

async function init() {
    var context :Context = utils.getContextByName(type);
    var values:any|null = null;

    if(mode == "edit") {
        values = await new SqlBuilder()
            .select(context!.getFieldNames())
            .from(context!.table)
            .where(context!.primaryKey, uid)
            .row(true);
    } else if(mode == "new") {
        context = utils.getContextByName(type);
        context.setValue(context.primaryKey, uid);
        values = {};
        values[context.primaryKey] = uid;
    }

    const form = new Formular(type, mode, uid);
    editForm.append(form.html);
    cancelBtn.on("click", () => {
        let sendToPage = type;
        form.setLocked(true);

        if(type == router.PAGES.Kategorie || type == router.PAGES.Keyword) {
            sendToPage = "keywords";
        }

        router.openPage(sendToPage);
    });
    saveBtn.on("click", async () => {
        let sendToPage = type;
        form.setLocked(true);
        
        if (mode == "new") {
            let columns = context.getFieldNames();
            let values = form.getValuesAsArray(columns);
            
            // UID für PrimaryKey setzen
            const pkIndex = columns.indexOf(context.primaryKey);
            if (pkIndex !== -1) {
                values[pkIndex] = uid;
            }
            
            await db.insertData(context.table, columns, values);
        } else if (mode == "edit") {
            const { columns, values } = form.getChangedValuesAsArray();
            if (columns.length > 0) {
                await db.updateById(context.table, context.primaryKey, columns, values, uid);
            }
        }
        
        if(type == router.PAGES.Kategorie || type == router.PAGES.Keyword) {
            sendToPage = "keywords";
        }

        router.openPage(sendToPage);
    });

    if(uid != null) {
        form.setLoading(true);
        form.setValues(values);
        form.setLoading(false);
    }
}