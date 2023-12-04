import {faDisplay, faGear} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ipcRenderer} from 'electron';
import React, {useContext} from 'react';
import {Button, Col, Container, Nav, Navbar} from "react-bootstrap";
import {Link} from 'react-router-dom';
import {MinimalViewContext} from "@/App";


const NavBar: React.FC<{ hideElements: boolean, setHideElements: React.Dispatch<React.SetStateAction<boolean>>, recording: boolean, setRecording: React.Dispatch<React.SetStateAction<boolean>> }> = ({hideElements, setHideElements, recording, setRecording}) => {

    return (
        <Navbar expand={"lg"} className="drag"
                style={{justifyContent: hideElements ? "space-between" : "space-around"}}>
            <Container>
                <Nav>
                    <Navbar.Text>
                        <img
                            src={hideElements ? "/src/assets/handwave-favicon-color.svg" : "/src/assets/handwave-logo.svg"}
                            alt="logo"
                            style={{width: hideElements ? "4rem" : "16rem"}}
                        />
                    </Navbar.Text>
                </Nav>
                <Col style={{display: 'flex', justifyContent: "space-around"}}>
                    <Button className="no-drag" onClick={() => {
                        setHideElements(!hideElements)
                        ipcRenderer.send('toggle-elements', !hideElements)
                    }}>
                        <FontAwesomeIcon icon={faDisplay}/>
                    </Button>
                </Col>
                {hideElements && (
                    <div className={`video ${recording ? "recording minimized" : ""}`}
                         style={{width: 12, height: 12, margin: 4, objectFit: "cover", borderRadius: "50%"}}/>
                )}
            </Container>
        </Navbar>
    );
};

export default NavBar;
