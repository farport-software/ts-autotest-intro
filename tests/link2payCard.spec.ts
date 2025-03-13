import {expect, test} from "@playwright/test";
import {BEARER_TOKEN, BODY, CARD_HOLDER, CARD_NUMBER, CVV, EXPIRY_DATE, PAYMENT_URL, PDF} from "../common/constants";
import {
    createLink2payOrder,
    Link2payInput,
    Link2payOutput,
    PaymentDetails, PaymentMethod,
    performPayment
} from "../external/order/link2pay";


test.describe.serial('Link2pay with Credit Card and Charge Order Flow', async () => {
    let paymentUrl: string;

    const input: Link2payInput = {
        body: BODY,
        token: BEARER_TOKEN,
        payUrl: PAYMENT_URL,
    };

    const expectedOutput: Link2payOutput = {
        url: PAYMENT_URL,
        orderKey: '',
    };

    const paymentDetails: PaymentDetails = {
        paymentMethod: PaymentMethod.CREDIT_CARD,
        cardHolder: CARD_HOLDER,
        cardNumber: CARD_NUMBER,
        expiryDate: EXPIRY_DATE,
        cvv: CVV,
    };

    test('1. Create Link2pay Order Card', createLink2payOrder(input, expectedOutput, (output: Link2payOutput) => {
        expect(output.orderKey).toBeTruthy();
        expect(output.url).toContain(`${input.payUrl}`);
        expect(output.orderKey.length).toEqual(27);
        paymentUrl = output.url;
        console.log("Link2pay Order -> ", output);
    }));

    test('2. Perform Payment with Credit Card', async ({ page }) => {
        expect(paymentUrl).toBeTruthy();
        await performPayment(paymentUrl, paymentDetails, PDF, (pdfPath: string) => {
            console.log("Recipt PDF downloaded at:", pdfPath);
            expect(pdfPath).toBe(PDF);
        })({ page });
    });


})
