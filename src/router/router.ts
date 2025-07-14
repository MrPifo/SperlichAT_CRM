import { Entity } from '@/models';
import { sys, entities, ViewMode, utils } from '@core';
import $ from 'jquery';
import { Page } from '@/views';
import { PageBuilder } from '@/pages/viewBuilder';
import PreviewWindow from '@/pages/previewWindow';
import { NavBar } from '@/pages/header';

interface ViewConfig {
   name: string;
   component?: any;
   requiresId?: boolean;
}

export class Router {
   private basePath: string = '/crm';
   public previewWindow: PreviewWindow;
   public navBar: NavBar;
   public viewContent: JQuery<HTMLElement>;
   static instance: Router;
   pageBuilder: PageBuilder;
   private activePage: Page | null = null;
   
   private viewModes: Record<string, ViewConfig> = {
       [ViewMode.FILTER]: { name: "Filter", requiresId: false },
       [ViewMode.NEW]: { name: "New", requiresId: true },
       [ViewMode.EDIT]: { name: "Edit", requiresId: true },
       [ViewMode.MAIN]: { name: "Main", requiresId: false },
       [ViewMode.DETAIL]: { name: "Detail", requiresId: true }
   };
   
   constructor() {
       console.log('Initializing Router');
       Router.instance = this;
       this.viewContent = $("#viewContent");
       this.pageBuilder = new PageBuilder();
       this.previewWindow = new PreviewWindow();
       this.navBar = new NavBar();
       this.handleRoute();
   }
   
   private getViewModeFromName(name: string): ViewMode {
       const entry = Object.entries(this.viewModes).find(
           ([_, config]) => config.name.toLowerCase() === name.toLowerCase()
       );
       return entry ? parseInt(entry[0]) : ViewMode.FILTER;
   }
   
   handleRoute() {
       const path = window.location.pathname;
       const relativePath = path.startsWith(this.basePath) ? path.slice(this.basePath.length) : path;
       const segments = relativePath.split('/').filter(s => s);
       const urlParams = new URLSearchParams(window.location.search);
       const id = urlParams.get('rowid');
       
       if (this.previewWindow.isOpen) {
           this.previewWindow.close();
       }
       
       if (segments.length === 0) {
           this.loadHome();
           return;
       }
       
       const entityName = segments[0].toLowerCase();
       let viewMode: ViewMode = ViewMode.FILTER;
       
       if (segments.length >= 2) {
           viewMode = this.getViewModeFromName(segments[1]);
       }
       
       this.loadEntity(entityName, viewMode, id);
   }
   
   isViewName(segment: string): boolean {
       return Object.keys(this.viewModes).includes(segment);
   }
   
   loadEntity(entityName: string, viewMode: ViewMode, id: string | null) {
       const entity = entities.models[entityName];
       
       if (entity == null) {
           console.error(`Entity ${entityName} not found`);
           this.show404();
           return;
       }
       
       this.renderEntity(entity, viewMode, id);
   }
   
   public openContext(entity: Entity, viewMode: ViewMode, id: string | null) {
       if (viewMode == ViewMode.NEW && !id) {
           id = utils.getUUID();
       }
       const url = this.buildUrl(entity.name, viewMode, id);
       window.location.href = url;
   }
   
   private renderEntity(entity: Entity, viewMode: ViewMode, id: string | null) {
       sys.viewMode = viewMode;
       sys.currentContext = entity.name;
       const viewConfig = this.viewModes[viewMode];
       let activePage: Page | null = entity.getPageByViewMode(viewMode);
       this.clearViewContent();
       
       if (!viewConfig) {
           console.error(`View ${viewMode} not found`);
           this.show404();
           return;
       }
       
       if (viewConfig.requiresId && !id) {
           console.error(`View ${viewMode} requires an ID`);
           this.show404();
           return;
       }
       
       sys.currentId = id;
       
       if (activePage != null) {
           if (id) {
               activePage.setRowId(id);
           }
           
           if (sys.isEditMode()) {
               activePage.isEditMask = true;
           }
           
           this.pageBuilder.buildePage(activePage, viewMode);
           
           if (viewMode != ViewMode.NEW) {
               activePage.loadData();
           } else {
               //@ts-ignore
               activePage.createNewInstance(entity.name, id);
           }
       }
   }
   
   openPreviewWindow(entityName: string, viewMode: ViewMode, id: string) {
       let entity: Entity = entities.getEntity(entityName);
       let activePage: Page | null = entity.getPageByViewMode(viewMode);
       
       if (activePage != null) {
           sys.currentId = id;
           this.previewWindow.open(activePage, entityName, viewMode, id);
       }
   }
   
   closePreviewWindow() {
       this.previewWindow.close();
   }
   
   public saveMask() {
   }
   
   loadHome() {
       this.clearViewContent();
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
   
   clearViewContent() {
       this.viewContent.empty();
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
   
   public buildUrl(entityName: string, viewMode: ViewMode, id?: string | null): string {
       const viewModeName = this.viewModes[viewMode].name.toLowerCase();
       const path = `${this.basePath}/${entityName}/${viewModeName}`;
       return id ? `${path}?rowid=${id}` : path;
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