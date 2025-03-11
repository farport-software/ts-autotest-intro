import {APIRequestContext} from "@playwright/test";
import {PAYMENT_API} from "./constants";
import {PaymentRequest} from "../models/pay.model";

/**
 * Makes the POST call /orders/link2pay
 */
export async function createPaymentOrder(request: APIRequestContext, body: PaymentRequest, bearerToken: string): Promise<PaymentResponse> {
    const response = await request.post(PAYMENT_API, { headers: {Authorization: `Bearer ${bearerToken}`,}, data: body,});
    if (!response.ok()) {
        throw new Error(
            `Error: ${response.status()} - ${await response.text()}`
        );
    }
    return (await response.json()) as PaymentResponse;
}