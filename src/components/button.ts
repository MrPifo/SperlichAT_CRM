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
	}
	private render(): JQuery<HTMLElement> {
		this.button = $('<button></button>');
		this.icon = $('<span class="material-icons"></span>');
		this.button.attr('id', this.id);

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

		this.button.on('click', (e) => {
			//@ts-ignore
			this.onClick.invoke(e as MouseEvent);
		});
		
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
}
export interface IButtonConfig {

	title?: string;
	icon?: string;
	iconRightAligned?: boolean;

}