const {SidebarPage} = require("./components/sidebar.page");

exports.LoginPage = class LoginPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.sidebar = new SidebarPage(page);
        this.emailInput = page.locator('#login');
        this.passwordInput = page.locator('#password');
        this.rememberMeCheckbox = page.locator('#remember');
        this.submitButton = page.locator('#submit');
        this.errorLabels = page.locator('label.error');
        this.errorMessage = page.locator('.alert-danger')
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async checkRememberMeCheckbox() {
        await this.rememberMeCheckbox.check();
    }

    async clickOnLoginButton() {
        await this.submitButton.first().click();
    }
}
