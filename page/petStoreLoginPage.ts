import { Locator, Page,expect } from '@playwright/test'

export class PetStoreLoginPage {

    readonly page: Page
    readonly usernameInputField: Locator
    readonly passwordInputField: Locator
    readonly loginButton: Locator
    readonly logoutButton: Locator
    readonly petsIframeView: Locator
    readonly errorMessageSnackBarcontainer: Locator

    constructor(page:Page){
        this.page = page
        this.usernameInputField = page.getByRole('textbox', {name: 'Username'})
        this.passwordInputField = page.getByRole('textbox', {name: 'Password'})
        this.loginButton = page.locator('form').getByRole('button', {name: 'Login'})
        this.logoutButton = page.getByRole('button', { name: 'Logout' }).first()
        this.petsIframeView = page.frameLocator('#previews__pet iframe').locator('app-pet-list')
        this.errorMessageSnackBarcontainer = page.locator('simple-snack-bar')
    }

    async navigateToUrl(){
        await this.page.goto('https://training.testifi.io/login')
    }
    /**
     * This method performs the login to petstore page
     * @param username Username filled by GetUserCredentials helper functions need to select userType 
     * @param password Password filled by GetUserCredentials helper functions need to select userType
     * @param validUser Boolean value of credentials being valid or not, changes validation after login
     */
    async submitLogin(username: string, password: string, validUser: boolean){
        await this.usernameInputField.fill(username)
        await this.passwordInputField.fill(password)
        await this.loginButton.click()

        if(validUser){
            await this.page.waitForURL('**/home')
            expect(this.logoutButton).toBeVisible({timeout:2000})
            expect(await this.petsIframeView.isVisible()).toBeTruthy
        } else {
            await expect(this.logoutButton).toBeHidden()
            await expect(this.errorMessageSnackBarcontainer).toHaveText('Username or password are wrong')
        }
        
    }
}