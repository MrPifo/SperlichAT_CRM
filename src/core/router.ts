export const router = {
    BASE_URL:import.meta.env.BASE_URL,
    API_URL:'https://sperlich.at/api/crm/',
    PAGES:{
        Login:"loginPage",
        Edit:"edit",
        Kontakt:"kontakt",
        Kategorie:"kategorie",
        Keyword:"keyword"
    },
    API:{
        login:"login",
        logout:"logout"
    },

    openPage(targetPage:string, params?:Record<string,string>) {
        let url = this.BASE_URL + "pages/" + targetPage;
        if(params) {
            const queryString = new URLSearchParams(params).toString();
            url += "?" + queryString;
        }
        
        window.location.href = url;
    },
    openLoginPage() {
        this.openPage(this.PAGES.Login);
    },
    openHomePage() {
        window.location.href = this.BASE_URL;
    }
};