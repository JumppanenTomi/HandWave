import { useState } from "react";
import { Form } from "react-bootstrap";


export default function useCheckboxInput(title: string, key: string, initial?: "true" | "false") {
  const [checkedValue, setCheckedValue] = useState<"true" | "false">(initial || "false");

  const clear = () => {
    setCheckedValue(initial || "false");
  };

  const element = (
    <>
      <Form.Check
        type="checkbox"
        label={title}
        checked={checkedValue === "true"}
        onChange={() => {
          setCheckedValue(checkedValue === "true" ? "false" : "true");
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
