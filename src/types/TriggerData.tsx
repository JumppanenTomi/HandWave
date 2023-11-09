import {ActionType} from "./ActionType";

export interface TriggerData {
  id: number;
  name: string;
  trigger: string;
  actions: ActionType[];
};