import {changePassword, credentials, login, logout} from "../../flows/user-flows";
import {ChangePasswordPage} from "../../pages/change-password.page";
import {TasksPage} from "../../pages/tasks.page";
import {chromium} from "@playwright/test";
import {send} from "../../tools/influx-db-sender";

const { test, expect } = require('@playwright/test');
let changePasswordPage;
let tasksPage;
const newPassword = `${credentials.password}new`;

test.describe('Change password spec', () => {
    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await login(page);
        changePasswordPage = new ChangePasswordPage(page);
        tasksPage = new TasksPage(page);
        await changePasswordPage.sidebar.selectChangePassword(credentials.name);
    });

    test('should require all fields', async () => {
        await changePasswordPage.clickOnUpdateButton();
        await expect(changePasswordPage.errorLabels).toHaveText([
            `Please Enter a valid Current password`,
            `Please Enter a valid New password`,
            `Please Enter a valid Password again`
        ]);
    });

    test('should not change password with wrong current password', async () => {
        await changePasswordPage.enterCurrentPassword('pass');
        await changePasswordPage.enterNewPassword(newPassword);
        await changePasswordPage.enterPasswordAgain(newPassword);
        await changePasswordPage.clickOnUpdateButton();
        await expect(changePasswordPage.errorLabels).toHaveText([
            `Please Enter a valid Current password`,
        ]);
    });

    test('should not change password to a short password', async () => {
        await changePasswordPage.enterCurrentPassword(credentials.password);
        await changePasswordPage.enterNewPassword('short');
        await changePasswordPage.enterPasswordAgain('short');
        await changePasswordPage.clickOnUpdateButton();
        await expect(changePasswordPage.errorLabels).toHaveText([
            `Please Enter a valid New password`,
            `Please Enter a valid Password again`
        ]);
    });

    test('should change password with a correct new password', async () => {
        await changePasswordPage.enterCurrentPassword(credentials.password);
        await changePasswordPage.enterNewPassword(newPassword);
        await changePasswordPage.enterPasswordAgain(newPassword);
        await changePasswordPage.clickOnUpdateButton();
        await expect(changePasswordPage.confirmMessage).toBeVisible();
    });

    test('should login with new password', async ({ page }) => {
        await changePasswordPage.sidebar.selectLogout(credentials.name);
        await login(page, {email: credentials.email, password: newPassword});
        await changePassword(page, credentials.password, {name: credentials.name, password: newPassword});
    });

    test.afterAll(async () => {
        await send(test.info().titlePath[1], test.info().title, test.info().status, test.info().duration);
    });
});
