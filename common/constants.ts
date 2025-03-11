import {Link2payRequest} from "../models/pay.model";


export const BEARER_TOKEN = 'AKCEAW5AlcsCuduXxqWFX5N38-KcRz-OAtkCbHWYPRhs6pnkeLSQ-50=';
export const CARD_NUMBER = '4242 4242 4242 4242';
export const EXPIRY_DATE = '02/28';
export const CVV = '444';
export const CARD_HOLDER = 'Pippo Rossi';
export const PAYMENT_API = 'https://api-tspaydev.tspay.app/orders/link2pay';
export const GET_CHARGE = 'https://api-tspaydev.tspay.app/charges/orders/';
export const ACTIVE = 'active';
export const AMOUNT = '1000';
export const PAGAMENTO = 'Pagamento';
export const ESEGUITA = 'Eseguita';
export const PAYMENT_URL ='https://secure-tspaydev.tspay.app/link2Pay/';
export const BODY: Link2payRequest = {
    externalRef: '20/01/2025',
    metadata: {payload: '{"message": "This is encoded"}'},
    template: {title: 'Lorem ipsum', desc: 'Description', paymentRef: 'PaymentRef'},
    currency: 'EUR',
    amount: 1000,
    langLocale: 'it-IT',
    sourceTypes: ['card'],
};