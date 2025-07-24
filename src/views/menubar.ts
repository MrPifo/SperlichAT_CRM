import { entities } from "@core";
import $ from 'jquery';

export class MenuBar {

	containerHtml: JQuery<HTMLElement>;
	menuContainerHtml: JQuery<HTMLElement>;
	menus: Record<string, IMenuContext[]>;

	constructor() {
		this.containerHtml = $('#menubar');
		this.menuContainerHtml = $('#menubar');
		this.menus = this.getMenus();
		this.render();
	}
	render() {
		this.menuContainerHtml.empty();

		for (let menuLabel in this.menus) {
			let menuContexts = this.menus[menuLabel];
			let menuLabelHtml = $(`<p class="menu-label">${menuLabel}</p>`);
			let menuList = $(`
				<ul class="menu-list"></ul>`
			);
			for (let i = 0; i < menuContexts.length; i++) {
				let entry = menuContexts[i];

				if (entities.hasEntity(entry.entity)) {
					const entity = entities.getEntity(entry.entity);
					let item = $(`<li><a href="/crm/${entity.name}/filter">${entity.title}</a></li>`);
					//item.attr("href", `/crm/${entity.name}/filter`);
					menuList.append(item);
				} else if (entry.entity == "Home") {
					let item = $(`<li><a href="/crm/">${entry.entity}</a></li>`);
					menuList.append(item);
				}
			}

			this.containerHtml.append(menuLabelHtml);
			this.containerHtml.append(menuList);
		}
	}
	getMenus(): Record<string, IMenuContext[]> {
		let menus: Record<string, IMenuContext[]> = {};
		
		menus["Dashboard"] = [{
            entity: "Home"
        }];
		menus["Kontakte"] = [{
			entity: "Person"
		}];
		menus["Finanzen"] = [{
			entity: "Bill"
		}];
		
		return menus;
	}
}
interface IMenuContext {

	entity: string;

}