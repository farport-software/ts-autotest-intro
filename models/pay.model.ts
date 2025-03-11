export interface Link2payRequest {
    externalRef: string;
    metadata: { payload: string; };
    template: { title: string; desc: string; paymentRef: string; };
    currency: string;
    amount: number;
    langLocale: string;
    sourceTypes: string[];
}

export interface Link2payResponse {
    orderKey: string;
    url: string;
}