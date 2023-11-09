export interface ActionType {
  id: number;
  type: "keyboard" | "delay";
  delay?: number;
  key?: string | number;
}