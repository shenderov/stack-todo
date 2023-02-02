import {send} from "../../tools/influx-db-sender";

const { test, expect, chromium } = require('@playwright/test');
const { SignupPage } = require('../../pages/signup.page');
const { TasksPage } = require('../../pages/tasks.page');
import { randomString } from '../../tools/data-generator';

let signupPage;
let tasksPage;
const userName = "Joe Doe";
const email = `${randomString(6)}@company.com`;
const password = randomString();

test.describe('Signup spec', () => {
    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('/');
        signupPage = new SignupPage(page);
        tasksPage = new TasksPage(page);
        await signupPage.sidebar.clickOnMenuItem('Sign Up');
    });

    test('should require all fields', async () => {
        await signupPage.clickSubmitButton();
        await expect(signupPage.errorLabels).toHaveText([
            `Please Enter a valid Name`,
            `Please Enter a valid Email`,
            `Please Enter a valid Password`,
            `This checkbox is required`
        ]);
    });

    test('should require minimum 6 character password', async () => {
        await signupPage.enterName(userName);
        await signupPage.enterEmail(email);
        await signupPage.enterPassword('short');
        await signupPage.checkAgreeCheckbox();
        await signupPage.clickSubmitButton();
        await expect(signupPage.errorLabels).toHaveText([
            `Please Enter a valid Password`
        ]);
    });

    test('should sign up with correct values', async () => {
        await signupPage.enterPassword(password);
        await signupPage.clickSubmitButton();
        await expect(tasksPage.myTasksHeader).toBeVisible();
    });

    test.afterAll(async () => {
        await send(test.info().titlePath[1], test.info().title, test.info().status, test.info().duration);
    });
});
