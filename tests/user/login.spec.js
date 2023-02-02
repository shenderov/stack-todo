import {LoginPage} from "../../pages/login.page";
import {TasksPage} from "../../pages/tasks.page";
import {credentials} from "../../flows/user-flows";
import {send} from "../../tools/influx-db-sender";

const { test, expect, chromium } = require('@playwright/test');

let loginPage;
let tasksPage;

test.describe('Login spec', () => {
    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('/');
        loginPage = new LoginPage(page);
        tasksPage = new TasksPage(page);
        await loginPage.sidebar.clickOnMenuItem('Login');
    });

    test('should require all fields', async () => {
        await loginPage.clickOnLoginButton();
        await expect(loginPage.errorLabels).toHaveText([
            `Please Enter a valid Email`,
            `Please Enter a valid Password`
        ]);
    });

    test('should not login with wrong credentials', async () => {
        await loginPage.enterEmail(credentials.email);
        await loginPage.enterPassword('short');
        await loginPage.clickOnLoginButton();
        await expect(loginPage.errorLabels).toHaveText([
            `Please Enter a valid Password`
        ]);
    });

    test('should log in with correct credentials', async () => {
        await loginPage.enterEmail(credentials.email);
        await loginPage.enterPassword(credentials.password);
        await loginPage.clickOnLoginButton();
        await expect(tasksPage.myTasksHeader).toBeVisible();
    });

    test.afterAll(async () => {
        await send(test.info().titlePath[1], test.info().title, test.info().status, test.info().duration);
    });
});
