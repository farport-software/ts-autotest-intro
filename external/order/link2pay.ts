import {createLink2pay} from "../../common/pay.helper";
import {expect} from "@playwright/test";
import * as fs from "node:fs";

export interface Link2payInput {
    body: any;
    token: string;
    payUrl: string;
}

export interface Link2payOutput {
    orderKey: string;
    url: string;
}

export type Callback = (data: any) => void;


export enum PaymentMethod {
    CREDIT_CARD= 'CREDIT_CARD',
    SEPA_DEBIT = 'SEPA_DEBIT',
}


export interface Card {
    paymentMethod: PaymentMethod.CREDIT_CARD
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export interface SepaDebit {
    paymentMethod: PaymentMethod.SEPA_DEBIT;
    email: string;
    iban: string;
    cardHolder: string
}

export type PaymentDetails = Card | SepaDebit;

export function createLink2payOrder(input: Link2payInput, output: Link2payOutput, callback: Callback) {
    return async ({request}: { request: any }): Promise<void> => {
        const response = await createLink2pay(request, input.body, input.token);
        output = {
            orderKey: response.orderKey,
            url: response.url,
        };
        callback(output);
    }
}

export function performPayment(paymentUrl: string, paymentDetails: PaymentDetails, pdfPath: string, callback: Callback) {
    return async ({page} ): Promise<void> => {

        await page.goto(paymentUrl);

        if(paymentDetails.paymentMethod === PaymentMethod.CREDIT_CARD){
            await page.click('text=Carta di credito o debito');

            await page.locator('#cardholderName').fill(paymentDetails.cardHolder);

            const cardNumberFrame = page.frameLocator('#cardNumber');
            await cardNumberFrame.locator('input[name="cardnumber"]').fill(paymentDetails.cardNumber);

            const expiryFrame = page.frameLocator('#expiryDate');
            await expiryFrame.locator('#checkout-frames-expiry-date').fill(paymentDetails.expiryDate);

            const cvvFrame = page.frameLocator('#cvv');
            await cvvFrame.locator('#checkout-frames-cvv').fill(paymentDetails.cvv);

            await page.waitForSelector('#btnSavePaymentMethod:not([disabled])');
            await page.click('#btnSavePaymentMethod');

            await page.waitForURL('**/cko/thank-you', { timeout: 15000 });
        }

        else if (paymentDetails.paymentMethod === PaymentMethod.SEPA_DEBIT){
            await page.click('text=Addebito diretto in conto');

            await page.locator('#contactEmail').fill(paymentDetails.email);

            await page.locator('#numericOnly').fill(paymentDetails.iban);

            await page.locator('#customerName').fill(paymentDetails.cardHolder);

            await page.waitForSelector('#btnSavePaymentMethod:not([disabled])');
            await page.click('#btnSavePaymentMethod');

        }

        await expect(page.locator('text=PAGAMENTO concluso con successo!')).toBeVisible();

        const downloadPromise = page.waitForEvent('download');
        await page.click('#btnPrint');
        const download = await downloadPromise;
        await download.saveAs(pdfPath);

        expect(fs.existsSync(pdfPath)).toBe(true);
        callback(pdfPath);
    }
}

