import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import {faDisplay} from "@fortawesome/free-solid-svg-icons";
import {ipcRenderer} from "electron";
import {MinimalViewContext} from "@/App";

export default function TopToolbar() {
    const {setMinimalView} = useContext(MinimalViewContext)

    return (
        <Container className={"toolbar-container top"}>
            <Row className={"toolbar-row"}>
                <Col>
                    <img
                        src={"/src/assets/handwave-logo.svg"}
                        alt="logo"
                        style={{width: "16rem"}}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Row>
                        <Col xs={"auto"} className={"toolbar-item no-drag"} onClick={() => {
                            setMinimalView("true")
                            ipcRenderer.send('toggle-elements', true)
                        }}>
                            <FontAwesomeIcon icon={faDisplay} size={"lg"}/>
                            <p className={"toolbar-item-text"}>Minimize</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}