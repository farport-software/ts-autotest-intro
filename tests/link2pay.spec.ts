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
    
})
