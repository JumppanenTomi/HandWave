import { faWindowMinimize, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

const TopAppBar: React.FC = () => {

  const minimizeWindow = () => {
    ipcRenderer.send('minimize-window');
  };

  const closeWindow = () => {
    ipcRenderer.send('close-window');
  };

  return (
    <Container className="drag" fluid style={{padding: 0}} onMouseDown={() => ipcRenderer.send('start-drag')}>
    <Row className="window-top-bar justify-content-end" style={{display: "grid"}}>
      <Col className="text-right no-drag">
        <Button variant="link" onClick={minimizeWindow}>
          <FontAwesomeIcon icon={faWindowMinimize} />
        </Button>
        <Button variant="link" onClick={closeWindow}>
          <FontAwesomeIcon icon={faXmark} size="lg"/>
        </Button>
      </Col>
    </Row>
  </Container>
  );
};

export default TopAppBar;
