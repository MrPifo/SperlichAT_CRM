import $ from 'jquery';
import { auth, router } from '@core';

$('#loginBtn').on('click', async () => {
    const username = $("#username").val();
    const password = $("#password").val();

    const loginSuccess = await auth.login(username, password);

    if(loginSuccess) {
        router.openHomePage();
    }
});