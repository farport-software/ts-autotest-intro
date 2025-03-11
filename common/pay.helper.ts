import {APIRequestContext} from "@playwright/test";
import {PAYMENT_API} from "./constants";
import {Link2payRequest, Link2payResponse} from "../models/pay.model";

/**
 * Makes the POST call /orders/link2pay
 */
export async function createLink2pay(request: APIRequestContext, body: Link2payRequest, bearerToken: string): Promise<Link2payResponse> {
    const response = await request.post(PAYMENT_API, { headers: {Authorization: `Bearer ${bearerToken}`,}, data: body,});
    if (!response.ok()) {
        throw new Error(
            `Error: ${response.status()} - ${await response.text()}`
        );
    }
    return response.json();
}