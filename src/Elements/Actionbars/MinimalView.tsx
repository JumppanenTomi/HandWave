import {Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import "@/styles/minimalView.css"
import {faMaximize} from "@fortawesome/free-solid-svg-icons/faMaximize";
import ToolbarItem from "@/Elements/Actionbars/ToolbarItem";
import {MinimalViewContext, RecordedTimeContext, RecordingContext} from "@/App";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import formatTime from "@/sharedUtilities/formatTime";

export interface ToolbarItemType {
    name: string,
    onClick: () => void,
    icon: React.JSX.Element
}

export default function MinimalView() {
    const {recording, setRecording} = useContext(RecordingContext)
    const {minimalView, setMinimalView} = useContext(MinimalViewContext)
    const {recordedTime} = useContext(RecordedTimeContext)

    const items: ToolbarItemType[] = [
        {
            name: "Maximize",
            onClick: () => {
                setMinimalView(!minimalView)
            },
            icon: <FontAwesomeIcon icon={faMaximize}/>
        },
        {
            name: recording ? "Stop recording "  + formatTime(recordedTime) : "Start recording",
            onClick: () => setRecording(!recording),
            icon: <FontAwesomeIcon icon={faCircle} color={recording ? "#ff0000" : undefined} />
        },
    ]


    return (
        <Container className="minimal-view-container drag">
            <Row className={"minimal-view-row"}>
                {items.map((e, i) => (
                    <ToolbarItem key={i} item={e}/>
                ))}
            </Row>
        </Container>
    )
}