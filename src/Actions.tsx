import {Col, Container, Row, Table} from "react-bootstrap";
import ModAction from "./modAction";
import DeleteAction from "./deleteAction";
import {useState} from "react";
import {TriggerData} from "./types/TriggerData";

export default function Actions() {
    const [actionsData, setActionsData] = useState<TriggerData[]>()

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Actions</h2>
                </Col>
                <Col xs={"auto"}>
                    <ModAction button idToUse={0} setToArray={setActionsData}/>
                </Col>
            </Row>
            <Table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Triggering gesture</th>
                    <th>Action(s)</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {actionsData && actionsData.map((e, i) => (
                    <tr key={i}>
                        <td>{e.name}</td>
                        <td>{e.trigger}</td>
                        <td>
                            <DeleteAction action_id={1}/>
                            <ModAction button={false} idToUse={0} setToArray={setActionsData}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}