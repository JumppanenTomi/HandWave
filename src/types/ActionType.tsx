export type ActionType = {
  id: number;
  type: "keyboard" | "delay";
  press: "true" | "false";
  delay?: number;
  key?: string | number;
};