class KeywordCategory extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name') || '';
        const icon = this.getAttribute('icon') || 'tag';
        const color = this.getAttribute('color') || 'grey';
        const isActive = this.getAttribute('active') === 'true';
        const categoryId = this.getAttribute('categoryid') || '';
        const isUngrouped = this.getAttribute('ungrouped') === 'true';

        const actionsHtml = !isUngrouped 
            ? `<div class="category-actions">
                   <i class="pen icon category-edit"></i>
                   <i class="trash icon category-delete"></i>
               </div>`
            : '';

        this.innerHTML = `
            <div class="title ${isActive ? 'active' : ''}" data-category="${name}" data-categoryid="${categoryId}">
                <i class="dropdown icon"></i>
                <i class="large ${icon} icon ${color}" style="color: ${color}"></i>
                <span class="category-name" style="font-size:1.3em">${name}</span>
                ${actionsHtml}
            </div>
            <div class="content ${isActive ? 'active' : ''}">
                <div class="keyword-grid">
                    ${this.innerHTML}
                </div>
            </div>
        `;
    }
}

customElements.define('keyword-category', KeywordCategory);