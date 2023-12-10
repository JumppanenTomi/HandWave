import {Col} from "react-bootstrap";
import React from "react";
import {ToolbarItemType} from "@/Elements/Actionbars/MinimalView";

/**
 * Render a toolbar item.
 *
 * @param {object} props - The props object.
 * @param {object} props.item - The toolbar item to render.
 * @param {function} props.item.onClick - The onClick event handler for the toolbar item.
 * @param {JSX.Element} props.item.icon - The icon component for the toolbar item.
 * @param {string} props.item.name - The name of the toolbar item.
 * @return {JSX.Element} - The rendered toolbar item.
 */
export default function ToolbarItem({item}: { item: ToolbarItemType }) {
    return (
        <Col xs={"auto"} onClick={item.onClick}>
            <Col xs={"auto"} className={"toolbar-item no-drag"}>
                {item.icon}
                <p className={"toolbar-item-text"}>{item.name}</p>
            </Col>
        </Col>
    )
}