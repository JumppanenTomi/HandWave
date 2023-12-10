import {useState} from "react";
import {Form} from "react-bootstrap";


/**
 * Creates a checkbox input element with the specified title, key, and initial value.
 *
 * @param {string} title - The title of the checkbox input.
 * @param {string} key - The key associated with the checkbox input.
 * @param {boolean} [initial=false] - The initial value of the checkbox input.
 *
 * @return {Object} - An object containing the checkbox input element,
 *                   the current checked value, the clear function, and the key.
 */
export default function useCheckboxInput(title: string, key: string, initial?: boolean) {
    const [checkedValue, setCheckedValue] = useState<boolean>(initial || false);

    const clear = () => {
        setCheckedValue(initial || false);
    };

    const element = (
        <>
            <Form.Check
                type="checkbox"
                label={title}
                checked={checkedValue}
                onChange={() => {
                    setCheckedValue(!checkedValue);
                }}
            />
        </>
    );

    return {
        element,
        checkedValue,
        clear,
        key,
    };
}
