const { expect } = require('@playwright/test');
const {SidebarPage} = require("./components/sidebar.page");

exports.TasksPage = class TasksPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.sidebar = new SidebarPage(page);
        this.myTasksHeader = page.locator('th', {hasText: 'My Tasks'});
        this.addTaskLink = page.locator('a', {hasText: 'add a task'});
        this.taskTextArea = page.locator('#task');
        this.saveTaskButton = page.locator('#submit');
        this.tableRow = page.locator('tbody tr');
        this.taskCard = page.locator('.card-text');
    }

    async clickOnAddNewTaskLink() {
        await this.addTaskLink.click();
    }

    async enterTask(task) {
        await this.taskTextArea.fill(task);
    }

    async clickOnSaveTaskButton() {
        await this.saveTaskButton.click();
    }

    async clickOnViewByName(name) {
        await this.tableRow.locator(`//*[text()='${name}']/..//*[text()='View']`).click();
    }

    async clickOnEditByName(name) {
        await this.tableRow.locator(`//*[text()='${name}']/..//*[text()='Edit']`).click();
    }

    async clickOnDeleteByName(name) {
        const deleteButton = await this.tableRow.locator(`//*[text()='${name}']/..//*[text()='Delete']`);
        await deleteButton.click();
        await deleteButton.waitFor({state: "detached"});
    }

    async deleteAllTasks() {
        const taskNames = await this.getAllTaskNames();
        for(let i = 0; i < taskNames.length; i++){
            await this.clickOnDeleteByName(taskNames[i]);
        }
    }

    async getAllTaskNames() {
        let names = [];
        if(!await this.addTaskLink.isVisible()){
            const tasks = await this.tableRow.all();
            for(let i = 0; i < tasks.length; i++) {
                names.push(await tasks[i].locator('td').first().innerText());
            }
        }
        return names;
    }

    async expectNumberOfTasks(number) {
        await expect(this.tableRow).toHaveCount(number);
    }

    async expectTaskInTheTable(name) {
        await expect(this.tableRow.locator(`//td[text()='${name}']`)).toHaveCount(1);
    }

    async expectTaskCardText(text) {
        await expect(this.taskCard).toHaveText(text);
    }
}
