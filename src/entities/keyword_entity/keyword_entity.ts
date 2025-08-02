import { ContentType } from '@models';
import { State, ViewMode } from '@core';
import { Entity, Recordcontainer } from '@models';
import { TableView, Page, GenericView } from '@views';

const keyword_entity = new Entity("Keyword");
keyword_entity.title = "Keyword";
keyword_entity.db = new Recordcontainer("KEYWORD", "KEYID");

keyword_entity.addField("KEYWORDID", {
	title:"KeywordID",
	primaryKey:true,
	column: "KEYWORDID",
	state:State.READONLY
});
keyword_entity.addField("KEYID", {
	title:"Schlüssel",
	column: "true"
});
keyword_entity.addField("TITLE", {
	title:"Titel",
	column:"true"
});
keyword_entity.addField("CATEGORY", {
	title:"Kategorie",
	column: "true",
	contentType:ContentType.KEYWORD
});
keyword_entity.addField("ISACTIVE", {
	title:"Aktiv",
	column: "true",
	contentType:ContentType.BOOLEAN
});

// Database/processes

// Filter-Page
const editPage = new Page("EditPage", keyword_entity);
const filterPage = new Page("FilterPage", keyword_entity);
const previewPage = new Page("PreviewPage", keyword_entity);
const lookupPage = new Page("LookupPage", keyword_entity);

editPage.appendViews(new GenericView("generic", [
	"KEYWORDID",
	"KEYID",
	"TITLE",
	"CATEGORY",
	"ISACTIVE"
], {
	showTitleBar:true
}));
filterPage.appendViews(
	new TableView("table", [
		"KEYID",
		"TITLE",
		"CATEGORY"
	], {
		enableSearch: false
	})
);
previewPage.appendViews(
	new GenericView("generic", [
		"KEYID",
		"TITLE",
		"CATEGORY"
	], {
		title:"Schlüsselwort",
		showTitleBar:false
	})
);
lookupPage.appendViews(
	new TableView("table", [
		"KEYID",
		"TITLE"
	], {
		enableSearch: true,
		multiSelect: false,
		showTools: false,
		isLookup:true
	})
);

keyword_entity.setPage(editPage, ViewMode.NEW);
keyword_entity.setPage(editPage, ViewMode.EDIT);
keyword_entity.setPage(previewPage, ViewMode.DETAIL);
keyword_entity.setPage(filterPage, ViewMode.FILTER);
keyword_entity.setPage(lookupPage, ViewMode.LOOKUP);

export default keyword_entity;