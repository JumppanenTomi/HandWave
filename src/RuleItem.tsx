import {Badge, Col, Container, Row} from "react-bootstrap";
import {TriggerData} from "@/types/TriggerData";
import {gestureData} from "@/staticData/gestureData";
import {useEffect, useMemo, useState} from "react";
import {ipcRenderer} from "electron";
import arrayIndexAsValue from "@/sharedUtilities/arrayIndexAsValue";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownLong, faEdit, faTrash, faUpLong} from "@fortawesome/free-solid-svg-icons";
import DeleteAction from "@/Elements/deleteAction";
import EditAction from "@/Elements/editAction";
import {faRightLong} from "@fortawesome/free-solid-svg-icons/faRightLong";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {faStop} from "@fortawesome/free-solid-svg-icons/faStop";
import {faFlagCheckered} from "@fortawesome/free-solid-svg-icons/faFlagCheckered";
import {faPlay} from "@fortawesome/free-solid-svg-icons/faPlay";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";

export default function RuleItem({item}: { item: TriggerData}) {
    const [keyboard, setKeyboard] = useState<string[] | undefined>()
    const editAction = EditAction(item)

    const fetchKeyboard = async () => {
        try {
            await ipcRenderer.invoke('getKeyboardKeys').then((result) => {
                setKeyboard(result)
            })
        } catch (error) {
            return undefined;
        }
    }

    useEffect(() => {
        fetchKeyboard()
    }, []);

    return (
        <Col xs={6} key={item.id}>
            {editAction.element}
            <div className={'sourceItem'} onClick={editAction.open}>
                <Container>
                    <h3 className={"sourceItemName"}>{item.name}</h3>
                    <p className={"sourceItemName"}>Gesture: "{item.trigger}"</p>
                    <Row>
                        <Col xs={"auto"} className={"badgeRow"}>
                            <FontAwesomeIcon icon={faPlay}/>
                        </Col>
                        {item.actions.map((e, i) => (
                            <>
                                <Col xs={"auto"} className={"badgeRow"}>
                                    {e.type === "delay" && (
                                        <Badge><FontAwesomeIcon icon={faClock} /><p> {e.delay} ms</p></Badge>
                                    )}
                                    {(e.type === "keyboard" && e.key && keyboard) && (
                                        <Badge>
                                            <p>
                                                {keyboard[e.key]} {(e.press === "true") ?
                                                <FontAwesomeIcon icon={faDownLong}/> :
                                                <FontAwesomeIcon icon={faUpLong}/>}
                                            </p>
                                        </Badge>
                                    )}
                                </Col>
                                {i < item.actions.length - 1 ? (
                                    <Col xs={"auto"} className={"badgeRow"}>
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                    </Col>
                                ) : (
                                    <Col xs={"auto"} className={"badgeRow"}>
                                        <FontAwesomeIcon icon={faFlagCheckered}/>
                                    </Col>
                                )}
                            </>
                        ))}
                    </Row>
                </Container>
            </div>
        </Col>
    )
}