export class PreviewTab extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="viewTab" class="" style="display:none"></div>
        `;
    }
}