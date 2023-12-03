import {Col} from "react-bootstrap";

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