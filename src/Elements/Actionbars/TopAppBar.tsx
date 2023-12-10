import {faWindowMinimize, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ipcRenderer} from 'electron';
import React from 'react';
import {Col, Row} from 'react-bootstrap';

/**
 * React functional component representing the top app bar.
 *
 * @return {JSX.Element} The top app bar component.
 */
const TopAppBar: React.FC = () => {

    const minimizeWindow = () => {
        ipcRenderer.send('minimize-window');
    };

    const closeWindow = () => {
        ipcRenderer.send('close-window');
    };

    return (
        <div className="drag" style={{padding: 0, margin: 0, width: "100%", overflow: "hidden"}}
             onMouseDown={() => ipcRenderer.send('start-drag')}>
            <Row className="title-bar justify-content-end" style={{display: "grid"}}>
                <Col className="text-right no-drag">
                    <FontAwesomeIcon icon={faWindowMinimize} onClick={minimizeWindow}/>
                    <FontAwesomeIcon icon={faXmark} size="lg" onClick={closeWindow}/>
                </Col>
            </Row>
        </div>
    );
};

export default TopAppBar;
