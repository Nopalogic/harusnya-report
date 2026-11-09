import type { Control } from "react-hook-form";
import type { JournalType } from "./validation";

export type FieldController = {
	control: Control<JournalType>;
};
