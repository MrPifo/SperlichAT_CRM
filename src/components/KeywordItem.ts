import { utils } from "@/core";

class KeywordItem extends HTMLElement {
    connectedCallback() {
        const keyid = this.getAttribute('keyid') || '';
        const title = this.getAttribute('title') || '';
        var icon = this.getAttribute('icon') || '';
        const color = this.getAttribute('color') || '#FFF';
        const active = this.getAttribute('active');
        const isActive = active === 'true' || active === '1';
        
        this.className = `keyword-item ${!isActive ? 'inactive' : ''}`;
        this.dataset.keyid = keyid;
        this.dataset.active = isActive.toString();

        if(utils.isNotNullOrEmpty(icon)) {
            icon += " icon";
        }
        
        this.innerHTML = `
            <i class="large ${icon}" style="color: ${color};"></i>
            <div>
                <div class="keyword-title">${title}</div>
                <div class="keyword-id">${keyid}</div>
            </div>
            ${!isActive ? '<i class="eye slash icon grey" style="margin-left: auto;"></i>' : ''}
        `;
    }
}

customElements.define('keyword-item', KeywordItem);