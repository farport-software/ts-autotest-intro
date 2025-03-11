import {expect, test} from "@playwright/test";
import {createLink2pay} from "../common/pay.helper";
import {ACTIVE, AMOUNT, BEARER_TOKEN, BODY, CARD_HOLDER, CARD_NUMBER, CVV, ESEGUITA, EXPIRY_DATE, PAGAMENTO, PAYMENT_URL} from "../common/constants";
import * as fs from "node:fs";
import {getChargeOrder} from "../common/charge.helper";
import {formatAmount, formatedExpiryDate, parsePdfToModel} from "../common/pdf.helper";


test.describe.serial('Link2pay and Charge Order Flow',() =>{
    let orderKey: string;
    let chargeKey: string;
    let paymentUrl: string;
    const pdfPath = `./recipts/ricevuta_${Date.now()}.pdf`;

    /**
     * Test 1: Create Link2pay Order
     *
     * Creates a payment order via API and check the orderKey and paymentUrl.
     *
     * @param APIRequestContext request - The API request context provided by Playwright.
     */
    test('1. Create Link2pay Order', async ({ request }) => {
        const response =await createLink2pay(request, BODY, BEARER_TOKEN);
        orderKey = response.orderKey;
        paymentUrl = response.url;
        console.log(`Order Created -> orderKey: ${orderKey} | Payment URL: ${paymentUrl}`);
        expect(orderKey).toBeTruthy();
        expect(paymentUrl).toContain(PAYMENT_URL);
    });

    /**
     * Test 2: Link2pay Payment Test
     *
     * Navigates to the payment URL, fills in the card details,
     * and triggers the payment process. Once payment is confirmed,
     * downloads the receipt PDF and verifies that the file exists.
     *
     * @param Page page - The Playwright page object.
     */
    test('2. Link2pay Payment Test', async ({ page }) => {
        await page.goto(paymentUrl);

        await page.locator('#cardholderName').fill(CARD_HOLDER);

        const cardNumberFrame = page.frameLocator('#cardNumber');
        await cardNumberFrame.locator('input[name="cardnumber"]').fill(CARD_NUMBER);

        const expiryFrame = page.frameLocator('#expiryDate');
        await expiryFrame.locator('#checkout-frames-expiry-date').fill(EXPIRY_DATE);

        const cvvFrame = page.frameLocator('#cvv');
        await cvvFrame.locator('#checkout-frames-cvv').fill(CVV);

        await page.waitForSelector('#btnSavePaymentMethod:not([disabled])');
        await page.click('#btnSavePaymentMethod');

        await page.waitForURL('**/cko/thank-you', {timeout: 15000});
        await expect(page.locator('text=PAGAMENTO concluso con successo!')).toBeVisible();

        const downloadPromise = page.waitForEvent('download');
        await page.click('#btnPrint');
        const download = await downloadPromise;

        await download.saveAs(pdfPath);

        const fileExists = fs.existsSync(pdfPath);
        expect(fileExists).toBe(true);
        console.log(`PDF downloaded -> Path: ${pdfPath}`);
    });

    /**
     * Test 3: Get Charge Key Test
     *
     * Retrieve the chargeKey (and other information) via a GET call using the generated orderKey.
     * Check if chargeKey exist, if state is active and the amount.
     * Save the chargeKey for comparison in the next test.
     * @param APIRequestContext request - The API request context provided by Playwright.
     */
    test('3. Get Charge Key Test', async ({ request }) => {
        expect(orderKey).toBeTruthy();
        const response = await getChargeOrder(request, orderKey, BEARER_TOKEN)
        const res = response.data[0];
        console.log(`Charge Order Retrieved -> chargeKey: ${res.chargeKey} | State: ${res.state} | Amount: ${res.amount}`);
        expect(res.chargeKey).toBeTruthy();
        expect(res.state).toBe(ACTIVE);
        expect(res.amount).toBe(AMOUNT);
        chargeKey = res.chargeKey;
    });

    /**
     * Test 4: Analyze Recipt PDF
     *
     * Analyzes the downloaded PDF by extracting the receipt data,
     * such as amount, card, expiration date, transaction type, transaction date, transaction code and status.
     * Compares the extracted values with the expected ones.
     */
    test('4. Analyze Recipt PDF', async () => {
        const fileExists = fs.existsSync(pdfPath);
        expect(fileExists).toBe(true);

        const pdfModel = await parsePdfToModel(pdfPath);

        const amount = formatAmount(parseInt(AMOUNT))
        expect(pdfModel.amount).toBe(amount);

        expect(pdfModel.card).toContain("4242");

        const expiryDate = formatedExpiryDate(EXPIRY_DATE);
        expect(pdfModel.expiryDate).toBe(expiryDate);

        expect(pdfModel.operationType).toBe(PAGAMENTO);

        const today = new Date().toLocaleDateString('it-IT');
        expect(pdfModel.operationDate).toBe(today);

        console.log(`Recipt Analysis -> Transaction Code: ${pdfModel.transactionCode} | ChargeKey: ${chargeKey}`);
        expect(pdfModel.transactionCode).toBe(chargeKey);

        expect(pdfModel.state).toContain(ESEGUITA);
    })
})
