import { utils } from '@core';
import { Event } from '@libraries';
import $ from 'jquery';

export class Button {

	id: string;
	element: JQuery<HTMLElement>;
	config: IButtonConfig;
	public onClick: Event<MouseEvent>;
	private button!: JQuery<HTMLElement>;
	private icon!: JQuery<HTMLElement>;

	constructor(config:IButtonConfig) {
		this.id = utils.getUUID();
		this.config = config;
		this.onClick = new Event<MouseEvent>();
		this.element = this.render();

		if (config.existingElement != null) {
			this.render();
		}
	}
	private render(): JQuery<HTMLElement> {
		if (this.config.existingElement != null) {
			this.button = this.config.existingElement;
			this.icon = this.config.existingElement.find('.material-icons');

			if (this.icon != null) {
				this.config.icon = this.icon.html();
			}
			if (this.config.existingElement.attr('id') != null) {
				//@ts-ignore
				this.id = this.config.existingElement.attr('id');
			} else {
				this.config.existingElement.attr('id', this.id);
			}
		} else {
			this.button = $('<button style="z-index:2"></button>');
			this.icon = $('<span class="material-icons"></span>');
			this.button.attr('id', this.id);
		}
		
		if (this.config.classes != null && this.config.classes.length > 0) {
			this.config.classes.forEach(cl => {
				this.button.addClass(cl);
			});
		}

		if (this.config.icon == null) {
			this.icon.css('display', "none");
		} else {
			this.icon.html(this.config.icon);
			this.icon.css('display', 'inline');
		}

		if (this.config.title != null) {
			this.button.html(this.config.title);
		}
		
		if (this.config.iconRightAligned) {
			this.button.append(this.icon);
		} else {
			this.button.prepend(this.icon);
		}

		this.button[0].onclick = (e) => {
			//@ts-ignore
			this.onClick.invoke(e as MouseEvent);
		};
		
		return this.button;
	}
	setParent(parent:JQuery<HTMLElement>) {
		parent.append(this.element);
	}
	addClass(name: string | string[]) {
		if (Array.isArray(name)) {
			name.forEach(c => {
				this.element.addClass(c);
			});
		} else {
			this.element.addClass(name);
		}
	}
	removeClass(name: string|string[]) {
		if (Array.isArray(name)) {
			name.forEach(c => {
				this.element.removeClass(c);
			});
		} else {
			this.element.removeClass(name);
		}
	}
	lock() {
		this.element.prop("disabled", true);
	}
	unlock() {
		this.element.prop("disabled", false);
	}
	setLoading(state: boolean) {
		if (state) {
			this.button.addClass("is-loading");
		} else {
			this.button.removeClass("is-loading");
		}
	}
}
export interface IButtonConfig {

	title?: string;
	icon?: string;
	iconRightAligned?: boolean;
	classes?: string[];
	existingElement?: JQuery<HTMLElement>;

}