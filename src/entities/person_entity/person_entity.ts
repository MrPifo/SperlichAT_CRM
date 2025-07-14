import { ViewMode } from '@core';
import { Entity } from '@models';
import { TableView, Page, GenericView } from '@views';

const person_entity = new Entity("Person");

person_entity.addField("PERSONID", {
	primaryKey:true,
	column:"PERSONID"
});
person_entity.addField("FIRSTNAME", {
	title:"Vorname",
	column:"true"
});
person_entity.addField("LASTNAME", {
	title:"Nachname",
	column:"true"
});
person_entity.addField("DATEOFBIRTH", {
	title:"Geburtstag",
	column:"true"
});
person_entity.addField("LOCATION", {
	title:"Stadt",
	column:"true"
});
person_entity.addField("HasLocation", {

});

// Database/processes

// Filter-Page
const editPage = new Page("EditPage", person_entity);
const filterPage = new Page("FilterPage", person_entity);
const previewPage = new Page("PreviewPage", person_entity);

editPage.appendViews(new GenericView("generic", [
	"FIRSTNAME",
	"LASTNAME",
	"DATEOFBIRTH",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION"
], {

}));
editPage.appendViews(new GenericView("generic2", [
	"FIRSTNAME",
	"LASTNAME",
	"DATEOFBIRTH",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION",
	"LOCATION"
], {
	showTitleBar: true,
	title:"Optionen"
}));
filterPage.appendViews(
	new TableView("table", [
		"FIRSTNAME",
		"LASTNAME",
		"DATEOFBIRTH",
		"LOCATION",
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
		
	})
);

person_entity.setPage(editPage, ViewMode.NEW);
person_entity.setPage(editPage, ViewMode.EDIT);
person_entity.setPage(previewPage, ViewMode.DETAIL);
person_entity.setPage(filterPage, ViewMode.FILTER);

export default person_entity;