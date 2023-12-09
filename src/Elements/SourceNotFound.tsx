import {Container, Row} from "react-bootstrap";

export default function SourceNotFound({text}:{text: String}){
    return (
        <Container style={{height: 250, display: "flex", alignItems: "center", textAlign: "center"}}>
                <h4>{text}</h4>
        </Container>
    )
}