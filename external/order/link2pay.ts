import {createLink2pay} from "../../common/pay.helper";

export interface Link2payInput {
    body: any;
    token: string;
    payUrl: string;
}

export interface Link2payOutput {
    orderKey: string;
    url: string;
}

export type Link2payCallback = (output: Link2payOutput) => void;


export function createLink2payOrder(input: Link2payInput, output: Link2payOutput, callback: Link2payCallback) {
    return async ({request}: { request: any }): Promise<void> => {
        const response = await createLink2pay(request, input.body, input.token);
        output = {
            orderKey: response.orderKey,
            url: response.url,
        };
        callback(output);
    }
}