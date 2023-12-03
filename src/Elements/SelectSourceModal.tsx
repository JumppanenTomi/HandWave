import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import {Col, Container, Row, Tab, Tabs} from "react-bootstrap";

export default function SelectSourceModal({sources, changeSource}: { sources: Electron.DesktopCapturerSource[], changeSource: (sourceId: string) => void }) {
    const [show, setShow] = useState(false);

    const [windows, setWindows] = useState<Electron.DesktopCapturerSource[]>()
    const [screens, setScreens] = useState<Electron.DesktopCapturerSource[]>()
    const [others, setOthers] = useState<Electron.DesktopCapturerSource[]>()
    const [selectedSource, setSelectedSource] = useState<string | undefined>()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const submit = () => {
        if (selectedSource) {
            changeSource(selectedSource)
            handleClose()
        }
    }

    useEffect(() => {
        categorizeSources()
    }, [show]);

    function categorizeSources() {
        const windows = [];
        const screens = [];
        const others = [];

        for (const source of sources) {
            if (source.id.startsWith('window:')) {
                windows.push(source);
            } else if (source.id.startsWith('screen:')) {
                screens.push(source);
            } else {
                others.push(source);
            }
        }
        setWindows(windows)
        setScreens(screens)
        setOthers(others)
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Select other source
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <Container>
                        <Tabs defaultActiveKey="apps">
                            <Tab eventKey="apps" title="Apps">
                                <Row>
                                    {windows && windows.map((e) => (
                                        <Col xs={6}
                                             style={{overflowX: "hidden", display: "flex", alignContent: "center", justifyContent: "center", flexWrap: "wrap"}}
                                             onClick={() => setSelectedSource(e.id)}>
                                            <img src={e.thumbnail.toDataURL()} style={{height: 90}}/>
                                            <p style={{width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>{e.name}</p>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab>
                            <Tab eventKey="screens" title="Screens">
                                <Row>
                                    {screens && screens.map((e) => (
                                        <Col xs={6}
                                             style={{overflowX: "hidden", display: "flex", alignContent: "center", justifyContent: "center", flexWrap: "wrap"}}
                                             onClick={() => setSelectedSource(e.id)}>
                                            <img src={e.thumbnail.toDataURL()} style={{height: 90}}/>
                                            <p style={{width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>{e.name}</p>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab>
                            <Tab eventKey="other" title="Other">
                                <Row>
                                    {others && others.map((e) => (
                                        <Col xs={6}
                                             style={{overflowX: "hidden", display: "flex", alignContent: "center", justifyContent: "center", flexWrap: "wrap"}}
                                             onClick={() => setSelectedSource(e.id)}>
                                            <img src={e.thumbnail.toDataURL()} style={{height: 90}}/>
                                            <p style={{width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>{e.name}</p>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab>
                        </Tabs>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" disabled={selectedSource === undefined} onClick={submit}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

