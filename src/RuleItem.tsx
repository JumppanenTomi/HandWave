import {Badge, Col, Container, Row} from "react-bootstrap";
import {TriggerData} from "@/types/TriggerData";
import {gestureData} from "@/staticData/gestureData";
import {useEffect, useMemo, useState} from "react";
import {ipcRenderer} from "electron";
import arrayIndexAsValue from "@/sharedUtilities/arrayIndexAsValue";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownLong, faUpLong} from "@fortawesome/free-solid-svg-icons";

export default function RuleItem({item, onClick}: { item: TriggerData, onClick: () => void; }) {
    const keyboard = useMemo( async () => {
        return await ipcRenderer.invoke('getKeyboardKeys') || undefined
    }, []);

    return (
        <Col xs={6} key={item.id}>
            <div className={'sourceItem'} onClick={onClick}>
                <p className={"sourceItemName"}>Gesture: "{item.trigger}"</p>
                <Container>
                    <Row>
                        {item.actions.map((e, i) => (
                            <Col xs={"auto"}>
                                <Badge>
                                    {e.type === "delay" && e.delay}
                                    {e.type === "keyboard" && e.key}
                                    {keyboard[0]}
                                    {(e.type === "keyboard" && e.press === "true") ? <FontAwesomeIcon icon={faDownLong} /> : <FontAwesomeIcon icon={faUpLong} />}
                                </Badge>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </Col>
    )
}