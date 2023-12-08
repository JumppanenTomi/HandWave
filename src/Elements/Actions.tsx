import {Container, Row} from "react-bootstrap";
import {useContext} from "react";
import {ActionsDataContext} from "@/App";
import RuleItem from "@/RuleItem";

export default function Actions() {
    const {gestureData, setGestureData} = useContext(ActionsDataContext)

    return (
        <Container>
            <Row>
                {gestureData && gestureData.map((e, i) => (
                    <RuleItem item={e} onClick={() => console.log("moi")}/>
                ))}
            </Row>
        </Container>
    )
}