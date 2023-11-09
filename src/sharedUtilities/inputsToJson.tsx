export type InputTypeInput = {
  element: JSX.Element;
  value: any;
  clear: () => void;
  key: string;
};

export default function InputsToJson(inputs: InputTypeInput[]): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  for (const input of inputs) {
    // Skip inputs with null or undefined values
    if (input.value != null && input.value.length !== 0) {
      result[input.key] = input.value;
    }
  }

  return result;
}