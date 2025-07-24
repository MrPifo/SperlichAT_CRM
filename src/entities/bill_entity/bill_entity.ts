import { ContentType } from '@models';
import { State, ViewMode } from '@core';
import { Entity, Recordcontainer } from '@models';
import { TableView, Page, GenericView } from '@views';

const bill_entity = new Entity("Bill");
bill_entity.title = "Rechnung";
bill_entity.db = new Recordcontainer("BILL", "BILLID");

bill_entity.addConsumer({
	name:"Persons",
	context: "Person"
});
bill_entity.addField("BILLID", {
	title:"Bestellnummer",
	primaryKey:true,
	column: "true",
	state:State.READONLY
});
bill_entity.addField("Icon", {
	title:"",
	contentType:ContentType.IMAGE
});
bill_entity.addField("DATE", {
	title:"Datum",
	column: "true",
	contentType:ContentType.DATE
});
bill_entity.addField("PAYMETHOD", {
	title:"Zahlungsart",
	column:"true"
});
bill_entity.addField("PERSON_ID", {
	title:"Kontakt",
	column: "true",
	consumer:"Persons"
});
bill_entity.addField("AMOUNT", {
	title: "Betrag",
	column:"true",
	contentType: ContentType.NUMBER,
	showRawValueInEditMask:true
});
bill_entity.addField("CATEGORY", {
	title: "Kategorie",
	column:"true"
});
bill_entity.addField("SUBCATEGORY", {
	title: "Unterkategorie",
	column:"true"
});
bill_entity.addField("REFERENCE", {
	title: "Referenznummer",
	column:"true"
});
bill_entity.addField("DESCRIPTION", {
	title: "Beschreibung",
	column:"true"
});
bill_entity.addField("IMPORTDATE", {
	title: "Importdatum",
	column: "true",
	contentType:ContentType.DATE
});
bill_entity.addField("TRANSACTIONTYPE", {
	title: "Transaktionsart",
	column:"true"
});
bill_entity.addField("INCOMESOURCE", {
	title: "Einnahmequelle",
	column:"true"
});
bill_entity.addField("ISRECURRING", {
	title: "Wiederkehrend",
	column: "true",
	contentType:ContentType.BOOLEAN
});
bill_entity.addField("RECURRINGDATE", {
	title: "Nächste Wiederholung",
	column: "true",
	contentType:ContentType.DATE
});

// Database/processes

// Filter-Page
const editPage = new Page("EditPage", bill_entity);
const filterPage = new Page("FilterPage", bill_entity);
const previewPage = new Page("PreviewPage", bill_entity);

editPage.appendViews(new GenericView("view1", [
	"BILLID",
	"TRANSACTIONTYPE",
	"DATE",
	"PAYMETHOD",
	"PERSON_ID",
	"AMOUNT",
	"CATEGORY",
	"SUBCATEGORY",
	"REFERENCE",
	"DESCRIPTION",
	"INCOMESOURCE",
	"ISRECURRING",
	"RECURRINGDATE"
], {
	showTitleBar: true,
	title:"Rechnungs Informationen"
}));
filterPage.appendViews(
	new TableView("table", [
		"Icon",
		"BILLID",
		"CATEGORY",
		"SUBCATEGORY",
		"AMOUNT",
		"DATE",
		"PAYMETHOD",
		"TRANSACTIONTYPE"
	], {
		enableSearch: false
	})
);
previewPage.appendViews(
	new GenericView("generic", [
		"BILLID",
		"DATE",
		"CATEGORY",
		"SUBCATEGORY",
		"AMOUNT",
	], {
		showTitleBar: true,
		title:"Zahlungsinformationen"
	}),
	new GenericView("generic2", [
		"PERSON_ID",
		"REFERENCE",
		"PAYMETHOD",
		"TRANSACTIONTYPE",
		"DESCRIPTION",
		"ISRECURRING",
		"RECURRINGDATE"
	], {
		showTitleBar: true,
		title: "Weitere Informationen",
		hideEmptyFields:true
	})
);

bill_entity.setPage(editPage, ViewMode.NEW);
bill_entity.setPage(editPage, ViewMode.EDIT);
bill_entity.setPage(previewPage, ViewMode.DETAIL);
bill_entity.setPage(filterPage, ViewMode.FILTER);

export default bill_entity;