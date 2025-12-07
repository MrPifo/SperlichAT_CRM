import { api, router } from "@core";

export const auth = {
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    },
    setToken(token: string, createDate: string, expireDate: string): void {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_token_createDate', createDate);
        localStorage.setItem('auth_token_expireDate', expireDate);
    },
    clearToken(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_createDate');
        localStorage.removeItem('auth_token_expireDate');
    },
    isLoggedIn(): boolean {
        const token = this.getToken();
        
        if (!token) return false;

        const expireDate = new Date(localStorage.getItem('auth_token_expireDate') as string);
        return expireDate > new Date();
    },
    async login(user: string, password: string): Promise<boolean> {
        var res = await api.request(router.API.login, {
            user: user,
            password: password
        });

        if (res.status == 200) {
            const data = await res.data;
            this.setToken(data.token, data.createDate, data.expireDate);

            return true;
        } else {
            return false;
        }
    },
    async logout(): Promise<boolean> {
        const token = this.getToken();
        
        var res = await api.request(router.API.logout, {
            token:token
        });

        if(res.status != 200) {
            console.log(res);
            return false;
        }

        this.clearToken();
        return true;
    }
};