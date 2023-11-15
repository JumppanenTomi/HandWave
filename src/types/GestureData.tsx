export type GestureData =
  | {
      category: string;
      confidence: number;
      hand: "left" | "right";
    }
  | undefined;
