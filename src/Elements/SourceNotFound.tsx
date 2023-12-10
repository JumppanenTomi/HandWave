import {Container} from "react-bootstrap";

/**
 * Renders a component to display a message indicating that the source was not found.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.text - The text to display in the message.
 *
 * @return {ReactElement} - The rendered component.
 */
export default function SourceNotFound({text}:{text: String}){
    return (
        <Container className={"sourceNotFound"}>
                <h4>{text}</h4>
        </Container>
    )
}