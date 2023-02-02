const {SidebarPage} = require("./components/sidebar.page");

exports.SignupPage = class SignupPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.sidebar = new SidebarPage(page);
        this.nameInput = page.locator('#name');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.agreeToTermsCheckbox = page.locator('#agree');
        this.submitButton = page.locator('#submit');
        this.errorLabels = page.locator('label.error');
    }

    async enterName(name) {
        await this.nameInput.fill(name);
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async checkAgreeCheckbox() {
        await this.agreeToTermsCheckbox.check();
    }

    async clickSubmitButton() {
        await this.submitButton.first().click();
    }
}
