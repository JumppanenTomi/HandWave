import {useState} from "react";
import {Form, InputGroup} from "react-bootstrap";

type InputProps = {
    initial?: string,
    required?: boolean,
}

export default function useSelectInput(title: string, key: string, items: string[], props?: InputProps) {
    const [value, setValue] = useState<string>();

    const validate = (v: string) => {
        setValue(v);
    }

    const clear = () => {
        setValue("")
    }

    const element = (
        <>
            <InputGroup.Text>{title}</InputGroup.Text>
            <Form.Select value={value} onChange={(e) => validate(e.target.value)}>
                {items.map((e, i) => (
                    <option key={i} value={e}>{e}</option>
                ))}
            </Form.Select>
        </>
    );

    return {
        element,
        value,
        clear,
        key
    }
}
