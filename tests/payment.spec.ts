import {expect, test} from "@playwright/test";
import {createPaymentOrder} from "../common/pay.helper";
import {
    ACTIVE,
    AMOUNT,
    BEARER_TOKEN,
    BODY,
    CARD_HOLDER,
    CARD_NUMBER,
    CVV,
    EXPIRY_DATE,
    RECIPT_STATE_SUCCESS,
    RECIPT_TITLE
} from "../common/constants";
import * as fs from "node:fs";
import {getChargeOrder} from "../common/charge.helper";
// @ts-ignore
import pdfjs from "pdf-parse";

test.describe.serial('Payment and Charge Order Flow',() =>{
    let orderKey: string;
    let paymentUrl: string;

    test('1. Create Order', async ({ request }) => {
        const response =await createPaymentOrder(request, BODY, BEARER_TOKEN);
        orderKey = response.orderKey;
        paymentUrl = response.url;

        console.log('orderKey: ',orderKey,' | url: ',paymentUrl);
        expect(orderKey).toBeTruthy();
        expect(paymentUrl).toContain('https://secure-tspaydev.tspay.app/link2Pay/');
    });


    test('2. Payment Test', async ({ page }) => {
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

        const pdfPath = './recipts/ricevuta.pdf';
        await download.saveAs(pdfPath);

        const fileExists = fs.existsSync(pdfPath);
        expect(fileExists).toBe(true);

        console.log('PDF scaricato in:', pdfPath);

        const dataBuffer = fs.readFileSync(pdfPath);
        await pdfjs(dataBuffer).then((data) =>{
            console.log('PDF TEXT: ',data.text);
            console.log('PDF INFO: ',data.info);
            console.log('PDF METADATA: ',data.metadata);
            console.log('PDF NUMBER PAGES: ', data.numpages);
            expect(data.text).toContain(RECIPT_TITLE);
            expect(data.text).toContain(RECIPT_STATE_SUCCESS);
            expect(data.numpages).toEqual(1);
        })
    });

    test('3. Get Charge Key Test', async ({ request }) => {
        expect(orderKey).toBeTruthy();
        const response = await getChargeOrder(request, orderKey, BEARER_TOKEN)
        console.log('chargeKey: ',response.chargeKey,' | state: ',response.state,' | amount: ', response.amount );
        expect(response.chargeKey).toBeTruthy();
        expect(response.state).toBe(ACTIVE);
        expect(response.amount).toBe(AMOUNT)
    });

})
