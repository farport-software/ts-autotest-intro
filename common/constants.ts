import {PaymentRequest} from "../models/pay.model";

export const BEARER_TOKEN = 'AKCEAW5AlcsCuduXxqWFX5N38-KcRz-OAtkCbHWYPRhs6pnkeLSQ-50=';
export const AMEX = '372688581899681';
export const EXPIRY_DATE = '02/28';
export const CVV = '444';
export const CARD_HOLDER = 'Pippo Rossi';
export const PAYMENT_API = 'https://api-tspaydev.tspay.app/orders/link2pay';
export const GET_CHARGE = 'https://api-tspaydev.tspay.app/charges/orders/';
export const ACTIVE = 'active';
export const AMOUNT = "1000";

export const BODY: PaymentRequest = {
    externalRef: '20/01/2025',
    metadata: {payload: '{"message": "This is encoded"}'},
    template: {title: 'Lorem ipsum', desc: 'Description', paymentRef: 'PaymentRef'},
    currency: 'EUR',
    amount: 1000,
    langLocale: 'it-IT',
    sourceTypes: ['card'],
};