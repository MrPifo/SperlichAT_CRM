import { Field } from "@/models";
import { FieldRenderer, IRenderParams } from "@component";
import $ from 'jquery';

export class DropdownRenderer extends FieldRenderer {

	public listHtml!: JQuery<HTMLElement>;
    public listValues: IListValue[] = [];
    private instanceRef: DropdownRenderer;
    private isDropdownOpen: boolean = false;

    constructor(field: Field, parentElement:JQuery<HTMLElement>, params:IRenderParams) {
        super(field, parentElement, params);
        this.instanceRef = this;
        this.setupDropdown();
    }

    createHtml() {
        this.rowHtml = $(`<div class="field is-horizontal"></div>`);

        if (this.hideLabel === false) {
            this.labelHtml = $(`<label for="${this.renderID}" class="field-label is-normal">${this.fieldInfo?.getTitle()}</label>`);
            this.rowHtml.append(this.labelHtml);
        }

        if (this.noInputElement == true) {
			this.rowHtml.addClass('fieldReadOnlyValue');
			this.valueHtml = $(`<span id="${this.renderID}" class="field"></span>`);
			this.valueHtml.css("color", this.field?.color ?? '#FFF');
		} else {
			this.rowHtml.addClass('fieldEditValue');
			this.valueHtml = $(`<input type="text" id="${this.renderID}" class="input field" placeholder="${this.fieldInfo?.getTitle()}">`);
		}
        

        this.addFieldClass(this.viewType);
        this.rowHtml.append(this.valueHtml);
        this.parentElement.append(this.rowHtml);
    }

    private setupDropdown(): void {
        const instance = this.instanceRef; // Lokale Referenz
        
        // Dropdown erstellen
        this.listHtml = $(`<ul class="field-dropdown"></ul>`);
        this.rowHtml?.append(this.listHtml);

        // Items hinzufügen
        for (let i = 0; i < 16; i++) {
            this.addItem({
                text: "Item " + i,
                text2: "Info" + i,
                value: i
            });
        }
        
        // Focus-Events wie in LookupWindow
        this.valueHtml.on('focus', () => {
            instance.showDropdown();
        });
        
        this.valueHtml.on('focusout', (e) => {
            if (instance.isDropdownOpen) {
                instance.hideDropdown();
                instance.valueHtml.blur();
            }
        });
        this.listHtml.on('mousedown', (e) => {
            e.preventDefault();
        });
        this.onFocus.addListener(() => {
            instance.showDropdown();
        });

        this.hideDropdown();
    }
	renderDropdown(): JQuery<HTMLElement> {
		this.listValues = [];
		this.listHtml = $(`<ul class="field-dropdown"></ul>`);

		return this.listHtml;
    }
    setItems(items: IListValue[], autoRefresh:boolean) {
        if (autoRefresh == null) {
            autoRefresh = false;
        }

        this.listValues = [];

        for (let item of items) {
            this.addItem(item);
        }

        if (autoRefresh == true) {
            this.refresh();
        }
    }
	addItem(item: IListValue) {
		this.listValues.push(item);
	}
    refresh(items?: IListValue[]) {
        const self = this.instanceRef;
		if (items == null) {
			items = this.listValues;
		}

        this.listHtml.empty();
        

		for (let value of items) {
			let itemHtml = $(`
                <li value="${value.value}" class="is-flex">
                    <span class="is-flex-grow-1">${value.text}</span>
                </li>
            `);
            if (value.text2 != null) {
                itemHtml.append($(`
                    <span class="is-flex-grow-1">${value.text2}</span>
                `));
            }
            itemHtml.on('click', function () {
                if (self.isDropdownOpen) {
                    //@ts-ignore
                    self.selectItem(this);
                }
            }.bind(value));

			this.listHtml.append(itemHtml);
		}
	}
    selectItem(item: IListValue) {
        this.valueHtml.val(item.value);
        this.onValueChange.invoke(item.value);
        this.setDisplayValue(item.text);
        this.hideDropdown();
    }
    hideDropdown() {
        this.isDropdownOpen = false;
        this.listHtml.css('display', "none");
        this.instanceRef.valueHtml.blur();
	}

    showDropdown() {
        this.isDropdownOpen = true;
		this.refresh();
		this.listHtml.css('display', "");
	}
}
export interface IListValue {
	value: any;
    text: string;
    text2?: string;
}