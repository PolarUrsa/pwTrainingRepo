import { Locator, Page, expect } from '@playwright/test'
import path from 'path';
import fs from 'fs';

export type selectedSearchAttributeType = 'Status' | 'Tags' | 'Id'
export class PetStoreHomePage {

    readonly page: Page
    readonly petsMenuButton: Locator
    readonly petsMenuDropdown: Locator
    readonly petsMenuFindPetButton: Locator
    readonly petsMenuFindPetPopUp: Locator
    readonly findPetsByAttributeTypeDropdown: Locator
    readonly petsMenuAddANewViewButton: Locator
    readonly addCardViewButton : Locator
    readonly appCardView: Locator
    readonly addPetButton: Locator
    readonly addPetGeneralInfoButton: Locator
    readonly addPetGeneralInfoInput: Locator
    readonly addPetCategoryButton: Locator
    readonly addPetCategoryInput: Locator
    readonly addPetTagsButton: Locator
    readonly addPetTagsInput: Locator
    readonly addPetTagConfirm: Locator
    readonly addPetImages: Locator
    readonly addPetCreateSubmit: Locator

    constructor(page: Page){
        this.page = page
        this.petsMenuButton = page.getByRole('button', {name:"Pets"}).first()
        this.petsMenuDropdown = page.locator('app-pet-list').getByRole('button', {name:"Pets"})
        this.petsMenuFindPetButton = page.getByRole('menuitem', { name: 'Find Pet' })
        this.petsMenuFindPetPopUp = page.locator('mat-dialog-container')
        this.findPetsByAttributeTypeDropdown = page.locator('mat-select#attribute__select')
        this.petsMenuAddANewViewButton = page.locator('#menu__add-view')
        this.addCardViewButton = page.locator('#view-menu__card')
        this.appCardView = page.locator('app-card-view')
        this.addPetButton = page.locator('#menu-add_pet')
        this.addPetGeneralInfoButton = page.getByRole('button', { name: 'General Information' })
        this.addPetGeneralInfoInput = page.getByRole('textbox', {name: "Name" })
        this.addPetCategoryButton = page.getByRole('button', { name: 'Category' })
        this.addPetCategoryInput = page.getByRole('textbox', { name: 'Category' })
        this.addPetTagsButton = page.getByRole('button', { name: 'Tags' })
        this.addPetTagsInput = page.getByLabel('Tags').locator('..').getByRole('textbox')
        this.addPetTagConfirm = page.getByRole('button', { name: ' add tag' })
        this.addPetImages = page.getByRole('button', { name: 'Images' })
        this.addPetCreateSubmit = page.getByRole('button', {name: "CREATE"})
    }

    async clickOnNavbarPetsButton(){
        await this.petsMenuButton.click()
    }

    async clickOnPetsMenuDropdown(){
        await this.petsMenuDropdown.click()
        expect(await this.page.locator('.mat-menu-content')).toBeVisible()
    }

    async clickOnFindPetButton(){
        await this.petsMenuFindPetButton.click()
        expect(await this.petsMenuFindPetPopUp).toBeVisible()
    }

    async findPetBySpecificAttribute(selectedSearchAttributeType){
        const findPetsAttributeTypeOption = this.page.locator('mat-option', {hasText:selectedSearchAttributeType})
        await this.findPetsByAttributeTypeDropdown.click(selectedSearchAttributeType)
        await findPetsAttributeTypeOption.click()
    }

    async addCardView(addCardType: 'Card' | 'Table'){
        await this.petsMenuAddANewViewButton.click()
        await this.addCardViewButton.click()
        await this.appCardView.scrollIntoViewIfNeeded()
        expect(await this.appCardView.isVisible()).toBeTruthy()
    }

    async addPet(petName:string,petCategory:string,petTag: string,imagefileNameWithExtenstion?: string){
        await this.addPetButton.click()

        await this.addPetGeneralInfoButton.click()
        await this.addPetGeneralInfoInput.fill(petName)

        await this.addPetCategoryButton.click()
        await this.addPetCategoryInput.fill(petCategory)

        await this.addPetTagsButton.click()
        await this.addPetTagsInput.fill(petTag)
        await this.addPetTagConfirm.click()
        
        if(imagefileNameWithExtenstion){
            await this.addPetImages.click()
            await this.uploadImageForPet(imagefileNameWithExtenstion)
            }
        await this.addPetCreateSubmit.click()
    }

    async uploadImageForPet(imagefileNameWithExtenstion:string){
        // File to upload
        const filePath = path.resolve(__dirname, `../assets/${imagefileNameWithExtenstion}`); // adjust as needed
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = 'imagefileNameWithExtenstion';
        const mimeType = 'image/jpg';

        // Target drop zone
        const dropZone = await this.page.locator('.drag-drop__add'); // Replace with actual selector

        // Create DataTransfer with actual file
        const dataTransfer = await this.page.evaluateHandle(
            async ({ fileName, mimeType, buffer }) => {
            const dt = new DataTransfer();
            const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
            const file = new File([blob], fileName, { type: mimeType });
            dt.items.add(file);
            return dt;
            },
            {
            fileName,
            mimeType,
            buffer: [...fileBuffer],
            }
        );

        // Simulate drag-and-drop
        await dropZone.dispatchEvent('dragenter', { dataTransfer });
        await dropZone.dispatchEvent('dragover', { dataTransfer });
        await dropZone.dispatchEvent('drop', { dataTransfer });

        // Optional: confirm UI response
        await expect(this.page.locator('#images__remove-overlay')).toBeVisible();
    }

    async petTableValidation(valueToValidate:string){
        while(true){
            const petStoreRow = await this.page.locator('app-table-view tbody tr')
            const petStoreRowCount = await petStoreRow.count()

            for(let index = 0; index < petStoreRowCount; index++) {
                const currentRow = petStoreRow.nth(index)
                const currentRowText = await currentRow.textContent()

                if (currentRowText?.includes(valueToValidate)){
                    console.log(`${valueToValidate} found in row ${index + 1}`)
                    expect(currentRowText).toContain(valueToValidate)
                    return currentRow
                }                
            }

            //Trying in next page if valueToValidate was not present in the current page of the table
            
            const petsTableNextButton = this.page.getByRole('button', { name: 'Next page' })
            await petsTableNextButton.scrollIntoViewIfNeeded()
            const isDisabled = await petsTableNextButton.getAttribute('disabled')

            if (isDisabled !== null) {
                console.log('Reached last page. Value not found')
                return null
            }

            await petsTableNextButton.click()
            await this.page.locator('.mat-progress-bar-element').isHidden()
        }
    }

}