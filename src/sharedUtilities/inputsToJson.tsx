import React from "react";

/**
 * Represents an input type
 * @typedef {object} InputTypeInput
 * @property {JSX.Element} element - The JSX element representing the input
 * @property {any} value - The value of the input
 * @property {function} clear - Clears the input value
 * @property {string} key - The key used to identify the input
 * @property {boolean} [isValid] - Optional property indicating if the input is valid
 */
export type InputTypeInput = {
    element: React.JSX.Element;
    value: any;
    clear: () => void;
    key: string;
    isValid?: boolean; // Add an optional isValid property
};

/**
 * Converts the given array of input objects to a JSON object.
 * Only includes inputs with valid values.
 *
 * @param {InputTypeInput[]} inputs - The array of input objects.
 * @returns {object | null} - The resulting JSON object or null if there are validation errors.
 */
export default function InputsToJson(inputs: InputTypeInput[]): { [key: string]: any } | null {
    const result: { [key: string]: any } = {};

    for (const input of inputs) {
        // Check if the input has a validation status
        if ('isValid' in input && !input.isValid) {
            // Skip invalid input
            continue;
        }

        if (input.value !== undefined && input.value !== null) {
            result[input.key] = input.value;
        }
    }

    // Check if there are any validation errors
    const isValid = Object.keys(result).length === inputs.length;
    return isValid ? result : null;
}
