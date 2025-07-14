import { Router } from './router/router';
import { PreviewTab } from '@component';

customElements.define('preview-tab', PreviewTab);
(window as any).router = new Router();