const { expect } = require('@playwright/test');

exports.SidebarPage = class SidebarPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.homeLink = page.locator('a', { hasText: 'StackTodo' });
        this.menu = page.locator('.navbar-nav');
        this.dropDown = page.locator('.dropdown-menu.show');
    }

    async clickOnHomeLink() {
        await this.homeLink.click();
    }

    async clickOnMenuItem(name) {
        await this.menu
            .locator(`//a[text()='${name}']`)
            .click();
    }

    async selectDropdownValue(menuItem, dropdownValue) {
        await this.clickOnMenuItem(menuItem);
        const dropdown = this.dropDown.locator(`//*[@class='dropdown-item' and text()='${dropdownValue}']`).first();
        await dropdown.waitFor();
        await dropdown.click();
    }

    async selectAddTask() {
        await this.selectDropdownValue("Tasks", "Add Task");
    }

    async selectMyTasks() {
        await this.selectDropdownValue("Tasks", "My Tasks");
    }

    async selectChangePassword(username) {
        await this.selectDropdownValue(username, "Change Password");
    }

    async selectLogout(username) {
        await this.selectDropdownValue(username, "Logout");
    }
}
