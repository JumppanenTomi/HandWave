import {useState} from "react";
import {Form} from "react-bootstrap";


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
