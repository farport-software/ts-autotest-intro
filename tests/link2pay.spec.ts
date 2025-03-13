import {expect, test} from "@playwright/test";
import {BEARER_TOKEN, BODY, PAYMENT_URL} from "../common/constants";
import {createLink2payOrder, Link2payInput, Link2payOutput} from "../external/order/link2pay";


test.describe.serial('Link2pay and Charge Order Flow', () => {

    const input: Link2payInput = {
        body: BODY,
        token: BEARER_TOKEN,
        payUrl: PAYMENT_URL,
    };

    const expectedOutput: Link2payOutput = {
        url: PAYMENT_URL,
        orderKey: '',
    };

    test('1. Create Link2pay Order', createLink2payOrder(input, expectedOutput, (output: Link2payOutput) => {
        expect(output.orderKey).toBeTruthy();
        expect(output.url).toContain(`${input.payUrl}`);
        expect(output.orderKey.length).toEqual(27);
        console.log("Link2pay Order Callback:", output);
    }));
    /**
     * Test 2: Link2pay Payment Test
     *
     * Navigates to the payment URL, fills in the card details,
     * and triggers the payment process. Once payment is confirmed,
     * downloads the receipt PDF and verifies that the file exists.
     *
     * @param Page page - The Playwright page object.
     */
    // test('2. Link2pay Payment Test', async ({ page }) => {
    //     await page.goto(paymentUrl);
    //
    //     await page.locator('#cardholderName').fill(CARD_HOLDER);
    //
    //     const cardNumberFrame = page.frameLocator('#cardNumber');
    //     await cardNumberFrame.locator('input[name="cardnumber"]').fill(CARD_NUMBER);
    //
    //     const expiryFrame = page.frameLocator('#expiryDate');
    //     await expiryFrame.locator('#checkout-frames-expiry-date').fill(EXPIRY_DATE);
    //
    //     const cvvFrame = page.frameLocator('#cvv');
    //     await cvvFrame.locator('#checkout-frames-cvv').fill(CVV);
    //
    //     await page.waitForSelector('#btnSavePaymentMethod:not([disabled])');
    //     await page.click('#btnSavePaymentMethod');
    //
    //     await page.waitForURL('**/cko/thank-you', {timeout: 15000});
    //     await expect(page.locator('text=PAGAMENTO concluso con successo!')).toBeVisible();
    //
    //     const downloadPromise = page.waitForEvent('download');
    //     await page.click('#btnPrint');
    //     const download = await downloadPromise;
    //
    //     await download.saveAs(pdfPath);
    //
    //     const fileExists = fs.existsSync(pdfPath);
    //     expect(fileExists).toBe(true);
    //     console.log(`PDF downloaded -> Path: ${pdfPath}`);
    // });

    /**
     * Test 3: Get Charge Key Test
     *
     * Retrieve the chargeKey (and other information) via a GET call using the generated orderKey.
     * Check if chargeKey exist, if state is active and the amount.
     * Save the chargeKey for comparison in the next test.
     * @param APIRequestContext request - The API request context provided by Playwright.
     */
    // test('3. Get Charge Key Test', async ({ request }) => {
    //     expect(orderKey).toBeTruthy();
    //     const chargeOrderResponse = await getChargeOrder(request, orderKey, BEARER_TOKEN)
    //     const response = chargeOrderResponse.data[0];
    //     console.log(`Charge Order Retrieved -> chargeKey: ${response.chargeKey} | State: ${response.state} | Amount: ${response.amount}`);
    //     expect(response.chargeKey).toBeTruthy();
    //     expect(response.state).toBe(ACTIVE);
    //     expect(response.amount).toBe(AMOUNT);
    //     chargeKey = response.chargeKey;
    // });

    /**
     * Test 4: Analyze Recipt PDF
     *
     * Analyzes the downloaded PDF by extracting the receipt data,
     * such as amount, card, expiration date, transaction type, transaction date, transaction code and status.
     * Compares the extracted values with the expected ones.
     */
    // test('4. Analyze Recipt PDF', async () => {
    //     const fileExists = fs.existsSync(pdfPath);
    //     expect(fileExists).toBe(true);
    //
    //     const pdfModel = await parsePdfToModel(pdfPath);
    //
    //     const amount = formatAmount(parseInt(AMOUNT))
    //     expect(pdfModel.amount).toBe(amount);
    //
    //     expect(pdfModel.card).toContain("4242");
    //
    //     const expiryDate = formatedExpiryDate(EXPIRY_DATE);
    //     expect(pdfModel.expiryDate).toBe(expiryDate);
    //
    //     expect(pdfModel.operationType).toBe(PAGAMENTO);
    //
    //     const today = new Date().toLocaleDateString('it-IT');
    //     expect(pdfModel.operationDate).toBe(today);
    //
    //     console.log(`Recipt Analysis -> Transaction Code: ${pdfModel.transactionCode} | ChargeKey: ${chargeKey}`);
    //     expect(pdfModel.transactionCode).toBe(chargeKey);
    //
    //     expect(pdfModel.state).toContain(ESEGUITA);
    // })


    // test('5. Link2Pay Payment test with invalid payment method ', async ({page}) => {
    //     await page.goto(paymentUrl);
    //     await page.locator('#cardholderName').fill(CARD_HOLDER);
    //
    //     const cardNumberFrame = page.frameLocator('#cardNumber');
    //     await cardNumberFrame.locator('input[name="cardnumber"]').fill('0000000000000000000');
    //
    //     const expiryFrame = page.frameLocator('#expiryDate');
    //     await expiryFrame.locator('#checkout-frames-expiry-date').fill('12/20');
    //
    //     const cvvFrame = page.frameLocator('#cvv');
    //     await cvvFrame.locator('#checkout-frames-cvv').fill('00');
    //
    //     await expect(page.locator('span[aria-hidden="true"]', { hasText: 'Carta non è supportato' })).toBeVisible();
    //     await expect(page.locator('span[aria-hidden="true"]',{hasText: 'La data di scadenza è nel passato'})).toBeVisible();
    //     const errors= await page.locator('span[aria-hidden="true"]').allInnerTexts();
    //     console.log('All errors alerts:', errors);
    // })


})
