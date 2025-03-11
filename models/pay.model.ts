export interface PaymentRequest {
    externalRef: string;
    metadata: { payload: string; };
    template: { title: string; desc: string; paymentRef: string; };
    currency: string;
    amount: number;
    langLocale: string;
    sourceTypes: string[];
}

export interface PaymentResponse {
    orderKey: string;
    url: string;
}