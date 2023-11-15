export type InputTypeInput = {
    element: JSX.Element;
    value: any;
    clear: () => void;
    key: string;
    isValid?: boolean; // Add an optional isValid property
};

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
