import { ContentType } from '@models';
import { State, ViewMode } from '@core';
import { Entity, Recordcontainer } from '@models';
import { TableView, Page, GenericView } from '@views';

const person_entity = new Entity("Person");
person_entity.title = "Kontakt";
person_entity.db = new Recordcontainer("PERSON", "PERSONID");

person_entity.addField("PERSONID", {
	title:"ID",
	primaryKey:true,
	column: "PERSONID",
	state:State.READONLY
});
person_entity.addField("FIRSTNAME", {
	title:"Vorname",
	column: "true"
});
person_entity.addField("LASTNAME", {
	title:"Nachname",
	column:"true"
});
person_entity.addField("DATEOFBIRTH", {
	title:"Geburtstag",
	column: "true",
	contentType:ContentType.DATE
});
person_entity.addField("LOCATION", {
	title:"Stadt",
	column: "true"
});
person_entity.addField("Icon", {
	title:"Icon",
	contentType:ContentType.IMAGE
});

// Database/processes

// Filter-Page
const editPage = new Page("EditPage", person_entity);
const filterPage = new Page("FilterPage", person_entity);
const previewPage = new Page("PreviewPage", person_entity);
const lookupPage = new Page("LookupPage", person_entity);

editPage.appendViews(new GenericView("Stammdaten", [
	"PERSONID",
	"FIRSTNAME",
	"LASTNAME",
	"DATEOFBIRTH",
	"LOCATION"
], {
	showTitleBar:true
}));
filterPage.appendViews(
	new TableView("table", [
		"Icon",
		"FIRSTNAME",
		"LASTNAME",
		"DATEOFBIRTH",
		"LOCATION"
	], {
		enableSearch: false
	})
);
previewPage.appendViews(
	new GenericView("generic", [
		"FIRSTNAME",
		"LASTNAME",
		"DATEOFBIRTH",
		"LOCATION"
	], {
		title:"Kontaktdaten",
		showTitleBar:true
	})
);
lookupPage.appendViews(
	new TableView("table", [
		"FIRSTNAME",
		"LASTNAME"
	], {
		enableSearch: true,
		multiSelect: false,
		showTools: false,
		isLookup:true
	})
);

person_entity.setPage(editPage, ViewMode.NEW);
person_entity.setPage(editPage, ViewMode.EDIT);
person_entity.setPage(previewPage, ViewMode.DETAIL);
person_entity.setPage(filterPage, ViewMode.FILTER);
person_entity.setPage(lookupPage, ViewMode.LOOKUP);

export default person_entity;