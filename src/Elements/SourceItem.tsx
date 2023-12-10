import {Col} from "react-bootstrap";

/**
 * Represents a source item.
 *
 * @function SourceItem
 *
 * @param {Object} props - The properties for the source item.
 * @param {Electron.DesktopCapturerSource} props.item - The Electron desktop capturer source for the item.
 * @param {string | undefined} props.selectedSource - The ID of the selected source, or undefined if none selected.
 * @param {Function} props.onClick - The function to be called when the item is clicked.
 *
 * @returns {JSX.Element} - The rendered source item component.
 */
export default function SourceItem({item, selectedSource, onClick}: { item: Electron.DesktopCapturerSource, selectedSource: string | undefined, onClick: () => void; }) {
    return (
        <Col xs={6} key={item.id}>
            <div className={`sourceItem ${selectedSource === item.id && "selectedSourceItem"}`} onClick={onClick}>
                <img src={item.thumbnail.toDataURL()}
                     className={"sourceItemImage"}/>
                <p className={"sourceItemName"}>{item.name}</p>
            </div>
        </Col>
    )
}