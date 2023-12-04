import {Col} from "react-bootstrap";
import React from "react";
import {ToolbarItemType} from "@/Elements/Actionbars/MinimalView";

export default function ToolbarItem({item}: { item: ToolbarItemType }) {
    return (
        <Col xs={"auto"} onClick={item.onClick}>
            <Col xs={"auto"} className={"toolbar-item"}>
                {item.icon}
                <p className={"toolbar-item-text"}>{item.name}</p>
            </Col>
        </Col>
    )
}