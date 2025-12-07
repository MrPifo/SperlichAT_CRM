import $ from 'jquery';
import 'fomantic-ui-css/semantic.css';
import 'fomantic-ui-css/semantic.js';
import '@/css/colors.css';
import '@/css/main.css';
import '@/css/header.css';
import '@/components/MenuTitleCard';
import '@/components/AppHeader';
import '@/components/ContactCard';
import '@/components/KeywordCategory';
import '@/components/KeywordItem';
import { auth, router } from '@core';

const publicPages = [router.PAGES.Login];
const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));

init();

async function init() {
    if (isPublicPage == false && await auth.isLoggedIn() == false) {
        router.openPage(router.PAGES.Login);
    }
}