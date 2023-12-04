import {Col, Container, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {MinimalViewContext} from "@/App";

export default function TopToolbar() {
    const {setMinimalView} = useContext(MinimalViewContext)

    return (
        <Container className={"logo-bar"}>
            <Row>
                <Col>
                    <img
                        src={"/src/assets/handwave-logo.svg"}
                        alt="logo"
                        style={{width: "10rem"}}
                    />
                </Col>
            </Row>
        </Container>
    )
}