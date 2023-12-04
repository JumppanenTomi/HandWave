import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import {faCompressArrowsAlt} from "@fortawesome/free-solid-svg-icons/faCompressArrowsAlt";
import SelectSourceModal from "@/Elements/SelectSourceModal";
import React from "react";
import {Link} from "react-router-dom";

export default function Maintoolbar({desktopCapturerOptions}: { desktopCapturerOptions: any }) {
    return (
        <Container className={"toolbar-container bottom"}>
            <Row className={"toolbar-row"}>
                <Col xs={"auto"}>
                    <Row>
                        <SelectSourceModal sources={desktopCapturerOptions.sources}
                                           changeSource={desktopCapturerOptions.changeSource}/>
                        <Col xs={"auto"} className={"toolbar-item"} onClick={desktopCapturerOptions.toggleRecording}>
                            <FontAwesomeIcon icon={faCircle} size={"lg"}/>
                            <p className={"toolbar-item-text"}>{desktopCapturerOptions.recording
                                ? `Stop Recording`
                                : "Start Recording"}</p>
                        </Col>
                        <Col xs={"auto"} className={"toolbar-item"}>
                            <FontAwesomeIcon icon={faCompressArrowsAlt} size={"lg"}/>
                            <p className={"toolbar-item-text"}>Minimize</p>
                        </Col>
                    </Row>
                </Col>
                <Col xs={"auto"}>
                    <Row>
                        <Link to={"/settings"} style={{color: "#fff", textDecoration: "none"}}>
                            <Col xs={"auto"} className={"toolbar-item"}>
                                <FontAwesomeIcon icon={faCog} size={"lg"}/>
                                <p className={"toolbar-item-text"}>Settings</p>
                            </Col>
                        </Link>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}