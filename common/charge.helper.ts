import {GET_CHARGE} from "./constants";
import {APIRequestContext} from "@playwright/test";
import {ChargeOrderResponse} from "../models/charge.model";

/**
 * Makes a GET call /charges/orders/{orderKey}
 * to retrieve charge key, state, amount, etc.
 */
export async function getChargeOrder(request: APIRequestContext, orderKey: string, bearerToken: string): Promise<ChargeOrderResponse> {
    const url = `${GET_CHARGE}${orderKey}`;
    const response = await request.get(url, {headers: {Authorization: `Bearer ${bearerToken}`,},});
    if (!response.ok()) {
        throw new Error(
            `Errore nella GET charge order: ${response.status()} - ${await response.text()}`
        );
    }
    return await response.json();
}