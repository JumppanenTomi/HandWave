import {Col, Container, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {MinimalViewContext} from "@/App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLifeRing} from "@fortawesome/free-solid-svg-icons";
import ToolbarItem from "@/Elements/Actionbars/ToolbarItem";
import {openWebpage} from "@/sharedUtilities/openWebpage";
import logo from '@/assets/handwave-logo.svg';


/**
 * Renders a top toolbar component with a logo and support button.
 * @returns {JSX.Element} The top toolbar component.
 */
export default function TopToolbar() {
    const {setMinimalView} = useContext(MinimalViewContext)

    return (
        <Container className={"logo-bar"}>
            <Row className={"logo-bar-row"}>
                <Col>
                    <img src={logo} alt="logo" style={{width: "10rem", userSelect: "none"}}/>
                </Col>
                <ToolbarItem item={{
                    name: "Support",
                    onClick: () => openWebpage('https://github.com/JumppanenTomi/presentation-tool-with-hand-gestures/wiki'),
                    icon: <FontAwesomeIcon icon={faLifeRing}/>
                }}/>
            </Row>
        </Container>
    )
}