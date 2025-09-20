import { ReactElement } from "react";

export type ActionType = {
  id: string;
  label: string;
  icon: ReactElement;
  disabled?: boolean;
  content: ReactElement;
};
