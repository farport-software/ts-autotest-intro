import {PdfModel} from "../models/pdf.model";
import * as fs from "node:fs";
// @ts-ignore
import pdfjs from "pdf-parse";

/**
 * Returns the next line from a given label.
 * Finds the line that exactly matches `label` (case-insensitive)
 * and returns the next line, if it exists.
 *
 * @param label - Label to search for
 * @param lines - Array of text lines
 * @returns string - Value of the next line
 */
export function getNextLineValue(label: string, lines: string[]): string {
    const idx = lines.findIndex(line => line.toLowerCase() === label.toLowerCase());
    if (idx !== -1 && idx + 1 < lines.length) {
        return lines[idx + 1].trim();
    }
    return '';
}


/**
 * Searches for a line that starts with the label,
 * es. "Scadenza: 2/2028", splits on ':' and returns the part after the colon.
 *
 * @param label - Label to search for
 * @param lines - Array of lines of text
 * @returns string - The value extracted after the colon
 */
export function getValueAfterColon(label: string, lines: string[]): string {
    const line = lines.find(l => l.toLowerCase().startsWith(label.toLowerCase()));
    if (line) {
        const parts = line.split(':');
        if (parts.length > 1) {
            return parts[1].trim();
        }
    }
    return '';
}


/**
 * Parses the PDF file and extracts receipt data into a PdfModel.
 *
 * Reads the PDF from the specified path, extracts its text content,
 * splits the content into lines, and uses helper functions to extract:
 * - amount (next line after "PaymentRef")
 * - card (next line after "Carta di credito/debito")
 * - expiryDate (value after "Scadenza:")
 * - operationDate (next line after "Data operazione")
 * - operationType (next line after "Tipo operazione")
 * - transactionCode (next line after "Codice transazione")
 * - state (next line after "Stato")
 *
 * @param {string} pdfPath - The path to the PDF file.
 * @returns {Promise<PdfModel>} A promise that resolves to a PdfModel with the extracted data.
 */
export async function parsePdfToModel(pdfPath: string): Promise<PdfModel> {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfjs(dataBuffer);
    const text = data.text;
    const lines = text.split('\n').map(line => line.trim());
    const amount = getNextLineValue('PaymentRef', lines);
    const card = getNextLineValue('Carta di credito/debito', lines);
    const expiryDate = getValueAfterColon('Scadenza', lines);
    const operationDate = getNextLineValue('Data operazione', lines);
    const operationType = getNextLineValue('Tipo operazione', lines);
    const transactionCode = getNextLineValue('Codice transazione', lines);
    const state = getNextLineValue('Stato', lines);
    return {amount, card, expiryDate, operationDate,operationType, transactionCode, state};
}

/**
 * Formats the expiration date.
 *
 * Converts an expiration date from the format "MM/YY" to "M/YYYY",
 *
 * @param {string} expiry - The expiration date in the format "MM/YY".
 * @returns {string} The formatted expiration date (es., "2/2028").
 */
export function formatedExpiryDate(expiry: string): string {
    let [month, year] = expiry.split('/');
    if (month.startsWith('0')) {
        month = month.slice(1);
    }
    if (year.length === 2) {
        year = `20${year}`;
    }
    return `${month}/${year}`;
}

/**
 * Formats an amount from cents to Euro format.
 *
 * Converts the amount form cents to a string in Euro format,
 * with two decimals, replacing the decimal point with a comma, and appending ' €'.
 *
 * @param {number} amount - The amount in cents.
 * @returns {string} The formatted amount (es. "10,00 €").
 */
export function formatAmount(amount: number): string {
    const euros = (amount / 100).toFixed(2);
    return euros.replace('.', ',') + ' €';
}