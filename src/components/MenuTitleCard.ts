class MenuTitleCard extends HTMLElement {
    connectedCallback() {
        const href = this.getAttribute('href') || '#';
        const icon = this.getAttribute('icon') || 'file';
        const color = this.getAttribute('color') || 'blue';
        const title = this.getAttribute('title') || '';
        const base = import.meta.env.BASE_URL;

        this.className = 'column';
        this.innerHTML = `
            <div class="ui card tile fluid" onclick="location.href='${base}${href}'">
                <div class="content">
                    <i class="${icon} icon huge ${color}"></i>
                    <div class="header">${title}</div>
                </div>
            </div>
        `;
    }
}
customElements.define('tile-card', MenuTitleCard);