import { test, expect } from '@playwright/test'
import { PetStorePage } from '../page/petStorePage'
import { getUserCredentials } from '../utils/getUserCredentials'

test.describe('Login with valid users', ()=> {

    test.afterEach('validation of logout button',async({page})=>{
        const logoutButton = page.getByRole('button', { name: 'Logout' })
        await expect(logoutButton.isVisible).toBeTruthy
    })

    test('Petstore login scenario with demo user', async({page})=> {
        const petstore = new PetStorePage(page)
        const {username, password} = getUserCredentials('demo')

        await petstore.navigateToUrl()
        await petstore.login(page, username, password)
    })

    test('Petstore login scenario with admin user', async({page})=> {
        const petstore = new PetStorePage(page)
        const {username, password} = getUserCredentials('admin')

        await petstore.navigateToUrl()
        await petstore.login(page, username, password)
    })
})
test.describe('Login attempt with invalid users', ()=> {

    test.afterEach('validation of logout button',async({page})=>{
        const logoutButton = page.getByRole('button', { name: 'Logout' })
        await expect(logoutButton.isVisible).toBeFalsy

        await expect(page.locator('simple-snack-bar')).toHaveText('Username or password are wrong')
    })

    test('Petstore login scenario with invalid username and password', async({page})=> {
        const petstore = new PetStorePage(page)
        const {username, password} = getUserCredentials('invalidUserAndPass')

        await petstore.navigateToUrl()
        await petstore.login(page, username, password)
    })

    test('Petstore login scenario with invalid username and valid password', async({page})=> {
        const petstore = new PetStorePage(page)
        const {username, password} = getUserCredentials('invalidUsername')

        await petstore.navigateToUrl()
        await petstore.login(page, username, password)
    })

    test('Petstore login scenario with valid username and invalid password', async({page})=> {
        const petstore = new PetStorePage(page)
        const {username, password} = getUserCredentials('invalidPassword')

        await petstore.navigateToUrl()
        await petstore.login(page, username, password)
    })
})