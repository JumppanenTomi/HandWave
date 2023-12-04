import {Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import ToolbarItem from "@/Elements/toolbars/ToolbarItem";
import formatTime from "@/sharedUtilities/formatTime";
import {ToolbarItemType} from "@/Elements/toolbars/MinimalView";
import {MinimalViewContext, RecordedTimeContext, RecordingContext} from "@/App";
import {faMinimize} from "@fortawesome/free-solid-svg-icons/faMinimize";
import {faDesktop} from "@fortawesome/free-solid-svg-icons/faDesktop";
import {faHand} from "@fortawesome/free-solid-svg-icons";

export default function Maintoolbar({sourceModal, processingSettingModal}:{sourceModal: any, processingSettingModal: any}) {
    const {recording, setRecording} = useContext(RecordingContext)
    const {minimalView, setMinimalView} = useContext(MinimalViewContext)
    const {recordedTime} = useContext(RecordedTimeContext)

    const navigate = useNavigate();

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
            name: recording ? "Stop recording" : "Start recording " + formatTime(recordedTime),
            onClick: () => setRecording(!recording),
            icon: <FontAwesomeIcon icon={faCircle} color={recording ? "#ff0000" : undefined}/>
        },
        {
            name: "Processing settings",
            onClick: () => processingSettingModal.setShow(true),
            icon: <FontAwesomeIcon icon={faHand}/>
        },
        {
            name: "Settings",
            onClick: () => navigate("/settings"),
            icon: <FontAwesomeIcon icon={faCog}/>
        },
    ]

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