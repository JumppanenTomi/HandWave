export type SupportedOS = "Windows" | "Mac" | "Linux";

export type KeyDataType = {
  key: string;
  description: string;
  supportedOS: SupportedOS[];
}[];