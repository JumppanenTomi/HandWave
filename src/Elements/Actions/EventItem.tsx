import React, {useEffect, useState} from "react";
import {Col} from "react-bootstrap";
import {ipcRenderer} from "electron";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownLong, faUpLong,} from "@fortawesome/free-solid-svg-icons";
import {ActionType} from "@/types/ActionType";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import EditAction from "@/Elements/Actions/editAction";

/**
 * Renders an event item.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ActionType} props.item - The item of type ActionType.
 *
 * @returns {ReactElement} The rendered event item.
 */
export default function EventItem({item}: { item: ActionType}) {
    const [keyboard, setKeyboard] = useState<string[] | undefined>();
    const editAction = EditAction(item);

    const fetchKeyboard = async () => {
        try {
            const result = await ipcRenderer.invoke("getKeyboardKeys");
            setKeyboard(result);
        } catch (error) {
            return undefined;
        }
    };

    useEffect(() => {
        fetchKeyboard();
    }, []);

    return (
        <Col xs={"auto"} key={item.id}>
            {editAction.element}
            <div className={"sourceItem"}>
                {item.type === "keyboard" && keyboard && item.key && (
                    <h3 className={"sourceItemName"}>
                        {keyboard[item.key]} {item.press === "true" ? (
                        <FontAwesomeIcon icon={faDownLong}/>
                    ) : (
                        <FontAwesomeIcon icon={faUpLong}/>
                    )}
                    </h3>
                )}
                {item.type === "delay" && item.delay && (
                    <h3 className={"sourceItemName"}><FontAwesomeIcon icon={faClock} /> {item.delay} ms</h3>
                )}
            </div>
        </Col>
    );
}
