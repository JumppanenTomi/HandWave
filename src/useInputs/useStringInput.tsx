import {useState} from "react";
import {Form, InputGroup} from "react-bootstrap";

type InputProps = {
    initial?: string,
    required?: boolean,
    placeholder?: string,
    unit?: string,
}

export default function useStringInput(title: string, key: string, props?: InputProps) {
    const [value, setValue] = useState<string>(props?.initial || "")

    const validate = (v: string) => {
        setValue(v)
    }

    const clear = () => {
        setValue(props?.initial || "")
    }

    const element = (
        <>
            <InputGroup.Text>{title}</InputGroup.Text>
            <Form.Control required={props?.required || false} type={"text"} placeholder={props?.placeholder || ""}
                          value={value} onChange={e => {
                validate(e.target.value)
            }}/>
            {props?.unit &&
                <InputGroup.Text>{props.unit}</InputGroup.Text>
            }
        </>
    )

    return {
        element,
        value,
        clear,
        key
    }
}