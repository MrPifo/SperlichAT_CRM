import { auth, router } from "@core";

class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="top-header">
                <div class="header-content">
                    <a href="/crm" class="home-link">
                        <i class="home icon"></i>
                        Home
                    </a>
                    <h1 class="header-title">CRM System</h1>
                    <div class="header-right">
                        <i class="bell icon notification-icon"></i>
                        <div class="ui dropdown account-dropdown large">
                            <i class="user circle icon account-icon"></i>
                            <div class="menu">
                                <div class="item">
                                    <i class="cog icon"></i>
                                    Einstellungen
                                </div>
                                <div id="logoutBtn" class="item">
                                    <i class="sign out icon"></i>
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const dropdown = this.querySelector('.account-dropdown');
        if (dropdown) {
            $(dropdown).dropdown();
        }

        $("#logoutBtn").on('click', async() => {
            if(await auth.logout()) {
                router.openLoginPage();
            }
        });
    }
}

customElements.define('app-header', AppHeader);