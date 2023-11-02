import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {faInfo, faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AddAction from "./addAction";

export default function Actions() {
    const dummyData = [
        {
            id: 0,
            name: "dummy1",
            trigger: "thumbsup",
            actions: "keyboard_arrow_up"
        }
    ]

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Actions</h2>
                </Col>
                <Col xs={"auto"}>
                    <AddAction/>
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
                {dummyData.map((e, i) => (
                    <tr key={i}>
                        <td>{e.name}</td>
                        <td>{e.trigger}</td>
                        <td>{e.actions}</td>
                        <td>
                            <FontAwesomeIcon icon={faTrash}/>
                            <FontAwesomeIcon icon={faInfo}/>
                            <FontAwesomeIcon icon={faPenToSquare}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}