export interface ChargeOrderResponse {
    lastKey: string;
    data: ChargeOrder[];
}

interface ChargeOrder {
    orderType: string;
    chargeKey: string;
    state: string;
    upstreamRef: string;
    orderKey: string;
    payMethod: PayMethod;
    amount: number;
    netAmount: number;
    currency: string;
    fees: Fees;
    upstreamStatus: string;
    order: Order;
    chargeRequest: Record<string, any>;
    modifiedOn: string;
    createdOn: string;
}

interface PayMethod {
    type: string;
    card: Card;
}

interface Card {
    brand: string;
    country: string;
    currency: string;
    funding: string;
    expMonth: string;
    expYear: string;
    last4: string;
    infoSecure: InfoSecure;
}

interface InfoSecure {
    enrollmentStatus: string;
    authenticationStatus: string;
    liabilityShift: string;
    exemption: string;
}

interface Fees {
    withholdFees: WithholdFee[];
}

interface WithholdFee {
    amount: number;
    type: string;
    event: string;
    composition: Composition;
}

interface Composition {
    source: string;
    feePercent: number;
    feeFixed: number;
}

interface Order {
    externalRef: string;
    metadata: Metadata;
    type: string;
}

interface Metadata {
    payload: string;
}