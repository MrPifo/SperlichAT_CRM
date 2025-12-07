import $ from "jquery";
import { objects, router, SqlBuilder } from "@core";
import { Kontakt } from "@types";

let selectedKontakt: Kontakt | null = null;

init();

async function init() {
    const context = router.PAGES.Kontakt;
    const createBtn = $("#create-button");
    const editBtn = $("#edit-button");
    const deleteBtn = $("#delete-button");
    const contactList = $("#contact-list");
    
    contactList.html("");
    
    const persons: Kontakt[] = await objects.getAllKontakts();

    createBtn.on('click', () => {
        router.openPage(router.PAGES.Edit, {mode:"new", context:router.PAGES.Kontakt});
    });
    editBtn.on('click', () => {
        if(selectedKontakt) {
            router.openPage(router.PAGES.Edit, {mode:"edit", context:context, id:selectedKontakt.getValue("PERSONID")});
        }
    });
    deleteBtn.on('click', async () => {
        if(selectedKontakt) {
            await objects.deleteObject(context, selectedKontakt.uid);
            location.reload();
        }
    });
    $(document).on('click', (e) => {
        if (!$(e.target).closest('contact-card, #edit-button, #delete-button').length) {
            deselectAll();
        }
    });
    persons.forEach(p => {
        let card = p.createContactCard();
        card.on('click', () => {
            persons.forEach(p => p.deselect());
            card.addClass('selected');
            selectKontakt(p);
        });
        contactList.append(card);
    });

    function selectKontakt(kontakt:Kontakt) {
        editBtn.css("display", "");
        deleteBtn.css("display", "");
        selectedKontakt = kontakt;
        kontakt.select();
    }
    function deselectAll() {
        editBtn.css("display", "none");
        deleteBtn.css("display", "none");
        persons.forEach(p => p.deselect());
        selectedKontakt = null;
    }
}