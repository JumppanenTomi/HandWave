import {Table} from "react-bootstrap";
import {useContext} from "react";
import {ActionsDataContext} from "./App";
import EditAction from "@/Elements/editAction";
import DeleteAction from "@/Elements/deleteAction";

export default function Actions() {
    const {gestureData, setGestureData} = useContext(ActionsDataContext)

    return (
        <Table variant={"dark"}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Triggering gesture</th>
                <th>Action(s)</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {gestureData && gestureData.map((e, i) => (
                <tr key={i}>
                    <td>{e.name}</td>
                    <td>{e.trigger}</td>
                    <td>
                        <DeleteAction action_id={e.id}/>
                        <EditAction button={false} actionToModify={e}/>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    )
}