import { login } from "../../flows/user-flows";
import { randomString } from '../../tools/data-generator';
import {send} from "../../tools/influx-db-sender";

const { test, expect, chromium } = require('@playwright/test');
const { TasksPage } = require('../../pages/tasks.page');

let tasksPage;
const task1 = randomString();
const task2 = randomString();
const task3 = randomString();
const editedTask = randomString();

test.describe('Task spec', () => {
    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await login(page);
        tasksPage = new TasksPage(page);
        await tasksPage.deleteAllTasks();
    });

    test('should show no task added message', async () => {
        await expect(tasksPage.myTasksHeader).toBeVisible();
    });

    test('should add new tasks', async () => {
        await tasksPage.clickOnAddNewTaskLink();
        await tasksPage.enterTask(task1);
        await tasksPage.clickOnSaveTaskButton();
        await tasksPage.expectTaskInTheTable(task1);

        await tasksPage.sidebar.selectAddTask();
        await tasksPage.enterTask(task2);
        await tasksPage.clickOnSaveTaskButton();
        await tasksPage.expectTaskInTheTable(task2);

        await tasksPage.sidebar.selectAddTask();
        await tasksPage.enterTask(task3);
        await tasksPage.clickOnSaveTaskButton();
        await tasksPage.expectTaskInTheTable(task3);

        await tasksPage.expectNumberOfTasks(3);
    });

    test('should view a new task', async () => {
        await tasksPage.clickOnViewByName(task1);
        await tasksPage.expectTaskCardText(task1);
        await tasksPage.sidebar.selectMyTasks();
    });

    test('should edit a task', async () => {
        await tasksPage.clickOnEditByName(task1);
        await tasksPage.enterTask(editedTask);
        await tasksPage.clickOnSaveTaskButton();
        await tasksPage.expectTaskInTheTable(editedTask);
    });

    test('should delete tasks', async () => {
        await tasksPage.clickOnDeleteByName(editedTask);
        await tasksPage.clickOnDeleteByName(task2);
        await tasksPage.expectNumberOfTasks(1);
        await tasksPage.expectTaskInTheTable(task3);
    });

    test.afterAll(async () => {
        await tasksPage.deleteAllTasks();
        await send(test.info().titlePath[1], test.info().title, test.info().status, test.info().duration);
    });
});
