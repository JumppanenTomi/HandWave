import {Col, Container, Row, Table} from "react-bootstrap";
import DeleteAction from "./deleteAction";
import {useContext} from "react";
import {ActionsDataContext} from "./App";
import EditAction from "./editAction";

export default function Actions() {
    const {actionData, setActionData} = useContext(ActionsDataContext)

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Actions</h2>
                </Col>
                <Col xs={"auto"}>
                    <EditAction button setToArray={setActionData} actionToModify={null}/>
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
                {actionData && actionData.map((e, i) => (
                    <tr key={i}>
                        <td>{e.name}</td>
                        <td>{e.trigger}</td>
                        <td>
                            <DeleteAction action_id={1}/>
                            <EditAction button={false} setToArray={setActionData} actionToModify={e}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}