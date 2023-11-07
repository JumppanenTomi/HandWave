import {ActionType} from "./ActionType";

export type TriggerData = {
  id: number;
  name: string;
  trigger: string;
  actions: ActionType[];
};