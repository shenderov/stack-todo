const {SidebarPage} = require("./components/sidebar.page");

exports.ChangePasswordPage = class ChangePasswordPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.sidebar = new SidebarPage(page);
        this.currentPasswordInput = page.locator('#password');
        this.newPasswordInput = page.locator('#new_password');
        this.newPasswordConfirmInput = page.locator('#password_again');
        this.updateButton = page.locator('#submit');
        this.errorLabels = page.locator('label.error');
        this.confirmMessage = page.locator('.alert-success')
    }

    async enterCurrentPassword(password) {
        await this.currentPasswordInput.fill(password);
    }

    async enterNewPassword(password) {
        await this.newPasswordInput.fill(password);
    }

    async enterPasswordAgain(password) {
        await this.newPasswordConfirmInput.fill(password);
    }

    async clickOnUpdateButton() {
        await this.updateButton.first().click();
    }
}
