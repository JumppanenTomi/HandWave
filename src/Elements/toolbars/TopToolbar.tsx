import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import {faDisplay} from "@fortawesome/free-solid-svg-icons";
import {ipcRenderer} from "electron";
import {MinimalViewContext} from "@/App";
import FaceDetectionSettingsModal from "@/Elements/SettingModals/FaceDetectionSettingsModal";

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