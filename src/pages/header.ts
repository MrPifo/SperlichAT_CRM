import $ from "jquery";
import { entities } from "@core";
import { Entity } from "@models";

export class NavBar {

	entityList: JQuery<HTMLElement>;

	constructor() {
		this.entityList = $("#navbar-entities");
		this.render();
	}

	render() {
		this.entityList.empty();

		for (let key in entities.models) {
			let entity = entities.models[key];

			this.entityList.append(this.createNavbarLabel(entity));
		}
	}
	createNavbarLabel(entity: Entity):JQuery<HTMLElement> {
		let a = $('<a></a>');
		a.attr("href", `/crm/${entity.name}/filter`);
		a.html(entity.name);

		return a;
	}
}