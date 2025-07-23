import { Page,expect } from '@playwright/test'
import { getUserCredentials, UserType } from '../utils/getUserCredentials'

export class PetStorePage {

    readonly page: Page

    constructor(page:Page){
        this.page = page
    }

    async navigateToUrl(){
        await this.page.goto('https://training.testifi.io/login')
    }

    async login(page: Page, username: string, password: string){
        await this.page.getByRole('textbox', {name: 'Username'}).fill(username)
        await this.page.getByRole('textbox', {name: 'Password'}).fill(password)
        await this.page.locator('form').getByRole('button', {name: 'Login'}).click()
    }
}