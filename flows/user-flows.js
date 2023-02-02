import {LoginPage} from "../pages/login.page";
import {expect} from "@playwright/test";
import {ChangePasswordPage} from "../pages/change-password.page";
import {TasksPage} from "../pages/tasks.page";

const userName = process.env['TEST_USER_NAME'] || 'Jane Doe';
const userEmail = process.env['USER_CREDENTIALS_EMAIL'] || 'jane.doe@company.com';
const userPassword = process.env['USER_CREDENTIALS_PASSWORD'] || '';

export const credentials = {
    name: userName,
    email: userEmail,
    password: userPassword
};

export async function login(page, creds = credentials) {
    await page.goto('/');
    const loginPage = new LoginPage(page);
    const tasksPage = new TasksPage(page);
    await loginPage.sidebar.clickOnMenuItem("Login");
    await loginPage.enterEmail(creds.email);
    await loginPage.enterPassword(creds.password);
    await loginPage.clickOnLoginButton();
    await expect(tasksPage.myTasksHeader).toBeVisible();
    return loginPage;
}

export async function logout(page, creds = credentials) {
    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.sidebar.selectLogout(creds.name);
}

export async function changePassword(page, newPassword, creds = credentials) {
    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.sidebar.selectChangePassword(creds.name);
    await changePasswordPage.enterCurrentPassword(creds.password);
    await changePasswordPage.enterNewPassword(newPassword);
    await changePasswordPage.enterPasswordAgain(newPassword);
    await changePasswordPage.clickOnUpdateButton();
    await expect(changePasswordPage.confirmMessage).toBeVisible();
}