import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import {Container, Row, Tab, Tabs} from "react-bootstrap";
import SourceItem from "@/Elements/SourceItem";

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
                <Modal.Body className={"noDrag"}>
                    <Container>
                        <Tabs defaultActiveKey="apps">
                            <Tab eventKey="apps" title="Apps">
                                <Row className={"justifyContent"}>
                                    {(windows && windows?.length > 0) ?
                                        windows.map((e) => (
                                            <SourceItem item={e} selectedSource={selectedSource}
                                                        onClick={() => setSelectedSource(e.id)}/>
                                        )) : (
                                            <label>No windows open that can be captured</label>
                                        )}
                                </Row>
                            </Tab>
                            <Tab eventKey="screens" title="Screens">
                                <Row className={"justifyContent"}>
                                    {(screens && screens?.length > 0) ?
                                        screens.map((e) => (
                                            <SourceItem item={e} selectedSource={selectedSource}
                                                        onClick={() => setSelectedSource(e.id)}/>
                                        )) : (
                                            <label>No screens open that can be captured</label>
                                        )}
                                </Row>
                            </Tab>
                            <Tab eventKey="other" title="Other">
                                <Row className={"justifyContent"}>
                                    {(others && others?.length > 0) ?
                                        others.map((e) => (
                                            <SourceItem item={e} selectedSource={selectedSource}
                                                        onClick={() => setSelectedSource(e.id)}/>
                                        )) : (
                                            <label>No other instances available that can be captured</label>
                                        )}
                                </Row>
                            </Tab>
                        </Tabs>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        disabled={selectedSource === undefined}
                        onClick={submit}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

