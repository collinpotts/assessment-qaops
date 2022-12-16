
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeAll(async () => {
    driver.get('http://34.207.161.102/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Clicking the Draw button displays the choices div', async () => {
    const drawButton = await driver.findElement(By.id('draw'))
    drawButton.click()
    await driver.sleep(2000);
    const choicesDiv = await driver.findElement(By.id('choices'))
    const displayed = await choicesDiv.isDisplayed()
    expect(displayed).toBe(true)
})

test('Bots shown when clicking all bots button', async () => {
    const allBotsBtn = await driver.findElement(By.id('see-all'))
    allBotsBtn.click()
    await driver.sleep(2000)

    const displayCard = await driver.findElement(By.className('bot-card')).isDisplayed()
    expect(displayCard).toBe(true)
    
})