import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import {Container, Row, Tab, Tabs} from "react-bootstrap";
import SourceItem from "@/Elements/SourceItem";
import SourceNotFound from "@/Elements/SourceNotFound";

/**
 * Represents a modal for selecting a source for capturing.
 *
 * @param {Electron.DesktopCapturerSource[]} sources - The list of available sources for capturing.
 * @param {Function} changeSource - The callback function to be called when a source is selected.
 * @return {Object} An object with two properties: setShow and element.
 */
export default function SelectSourceModal(sources: Electron.DesktopCapturerSource[], changeSource: (sourceId: string) => void) {
    const [show, setShow] = useState(false);

    const [windows, setWindows] = useState<Electron.DesktopCapturerSource[]>()
    const [screens, setScreens] = useState<Electron.DesktopCapturerSource[]>()
    const [others, setOthers] = useState<Electron.DesktopCapturerSource[]>()
    const [selectedSource, setSelectedSource] = useState<string | undefined>()

    const handleClose = () => setShow(false);

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

    const element = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className={"noDrag"}>
                <Container>
                    <div style={{textAlign: "center", height: 120}}>
                        <h2>Select display source</h2>
                        <p>Choose the source you wish to capture for recording.</p>
                    </div>
                    <Tabs defaultActiveKey="apps">
                        <Tab eventKey="apps" title="Apps">
                            <Row className={"justifyContent"}>
                                {(windows && windows?.length > 0) ?
                                    windows.map((e) => (
                                        <SourceItem item={e} selectedSource={selectedSource}
                                                    onClick={() => setSelectedSource(e.id)}/>
                                    )) : (
                                        <SourceNotFound text={"No windows open that can be captured"}/>
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
                                        <SourceNotFound text={"No screens open that can be captured"}/>
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
                                        <SourceNotFound text={"No other instances available that can be captured"}/>
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
    )

    return {
        setShow,
        element
    };
};

