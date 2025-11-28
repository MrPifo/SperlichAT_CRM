export class Router {

    private basePath: string = '/crm';
    static instance: Router;

    constructor() {
        console.log('Initializing Router');
        Router.instance = this;
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const relativePath = path.startsWith(this.basePath) ? path.slice(this.basePath.length) : path;
        const segments = relativePath.split('/').filter(s => s);
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (segments.length === 0) {
            this.loadHome();
            return;
        }

    }
    loadHome() {
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = `
               <h1>CRM Dashboard</h1>
               <div class="dashboard-grid">
                   <div class="dashboard-card">
                       <h2>Personen</h2>
                       <p>150 Einträge</p>
                       <a href="${this.basePath}/person/filter">Zur Filteransicht</a>
                       <a href="${this.basePath}/person/main">Zur Hauptansicht</a>
                   </div>
                   <div class="dashboard-card">
                       <h2>Unternehmen</h2>
                       <p>45 Einträge</p>
                       <a href="${this.basePath}/company/filter">Zur Filteransicht</a>
                       <a href="${this.basePath}/company/main">Zur Hauptansicht</a>
                   </div>
               </div>
           `;
        }
    }

    show404() {
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = `
               <h1>404 - Seite nicht gefunden</h1>
               <p>Die angeforderte Seite konnte nicht gefunden werden.</p>
               <a href="${this.basePath}/">Zur Startseite</a>
           `;
        }
    }

    navigate(url: string) {
        window.location.href = url;
    }
}

declare global {
    interface Window {
        router: Router;
    }
}