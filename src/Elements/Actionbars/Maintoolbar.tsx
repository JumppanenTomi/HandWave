import {Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import React, {useContext, useEffect} from "react";
import ToolbarItem from "@/Elements/Actionbars/ToolbarItem";
import formatTime from "@/sharedUtilities/formatTime";
import {ToolbarItemType} from "@/Elements/Actionbars/MinimalView";
import {MinimalViewContext, RecordedTimeContext, RecordingContext} from "@/App";
import {faMinimize} from "@fortawesome/free-solid-svg-icons/faMinimize";
import {faDesktop} from "@fortawesome/free-solid-svg-icons/faDesktop";
import {faHand} from "@fortawesome/free-solid-svg-icons";
import {faSection} from "@fortawesome/free-solid-svg-icons/faSection";

const { ipcRenderer } = window.require('electron');


/**
 * Renders the main toolbar component.
 *
 * @param {Object} options - The options for the main toolbar.
 * @param {Object} options.sourceModal - The source modal.
 * @param {Object} options.processingSettingModal - The processing setting modal.
 * @param {Object} options.macroModal - The macro modal.
 * @returns {JSX.Element} The rendered main toolbar component.
 */
export default function Maintoolbar({sourceModal, processingSettingModal, macroModal}: { sourceModal: any, processingSettingModal: any, macroModal: any }) {
    const {recording, setRecording} = useContext(RecordingContext)
    const {minimalView, setMinimalView} = useContext(MinimalViewContext)
    const {recordedTime} = useContext(RecordedTimeContext)

    const items: ToolbarItemType[] = [
        {
            name: "Minimize",
            onClick: () => {
                setMinimalView(!minimalView)
            },
            icon: <FontAwesomeIcon icon={faMinimize}/>
        },
        {
            name: "Select source",
            onClick: () => {
                sourceModal.setShow(true)
            },
            icon: <FontAwesomeIcon icon={faDesktop}/>
        },
        {
            name: recording ? "Stop recording " + formatTime(recordedTime) : "Start recording",
            onClick: () => setRecording(!recording),
            icon: <FontAwesomeIcon icon={faCircle} color={recording ? "#ff0000" : undefined}/>
        },
        {
            name: "Processing settings",
            onClick: () => processingSettingModal.setShow(true),
            icon: <FontAwesomeIcon icon={faHand}/>
        },
        {
            name: "Rules",
            onClick: () => macroModal.setShow(true),
            icon: <FontAwesomeIcon icon={faSection}/>
        },
    ]

    useEffect(() => {
        ipcRenderer.on('window-blur', () => {
          console.log('Window blurred');
            setMinimalView(true);
        });
    
        // Clean up the event listeners when the component unmounts
        return () => {
          ipcRenderer.removeAllListeners('window-blur');
        };
      }, []);

    return (
        <Container className={"toolbar-container bottom"}>
            <Row className={"toolbar-row"}>
                {items.map((e, i) => (
                    <ToolbarItem key={i} item={e}/>
                ))}
            </Row>
        </Container>
    )
}