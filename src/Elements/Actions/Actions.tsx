import {Container, Row} from "react-bootstrap";
import {useContext} from "react";
import {ActionsDataContext} from "@/App";
import RuleItem from "@/Elements/Actions/RuleItem";

/**
 * Renders a list of RuleItems based on gestureData in ActionsDataContext
 * @return {React.Component} - The rendered component
 */
export default function Actions() {
    const {gestureData, setGestureData} = useContext(ActionsDataContext)

    return (
        <Container>
            <Row>
                {gestureData && gestureData.map((e, i) => (
                    <RuleItem item={e}/>
                ))}
            </Row>
        </Container>
    )
}