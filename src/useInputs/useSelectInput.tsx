import {useState} from "react";
import {Form, InputGroup} from "react-bootstrap";

type InputProps = {
    initial?: string,
    required?: boolean,
}

export type SelectInputType = {
    name: string | number,
    value: any
}

export default function useSelectInput(title: string, key: string, items: SelectInputType[], props?: InputProps) {
    const [value, setValue] = useState<string>(props?.initial || items[0].value);

    const validate = (v: string) => {
        setValue(v);
    }

    const clear = () => {
        setValue(undefined)
    }

    const element = (
        <>
            <InputGroup.Text>{title}</InputGroup.Text>
            <Form.Select value={value} onChange={(e) => validate(e.target.value)}>
                {items.map((e, i) => (
                    <option key={i} value={e.value}>{e.name}</option>
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
