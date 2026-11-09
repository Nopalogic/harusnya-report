import { Controller, useWatch } from "react-hook-form";

import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldLabel } from "#/components/ui/field";
import type { FieldController } from "../types";
import { ClassField } from "./class-field";
import { DateField } from "./date-field";
import { TimeField } from "./time-field";

export function HeaderFields({ control }: FieldController) {
	const isUseHeader = useWatch({ control, name: "header" });
	return (
		<>
			<Controller
				control={control}
				name="header"
				render={({ field }) => (
					<Field orientation="horizontal">
						<Checkbox checked={field.value} onCheckedChange={field.onChange} />
						<FieldLabel>Use header</FieldLabel>
					</Field>
				)}
			/>

			{isUseHeader && (
				<>
					<DateField control={control} />
					<TimeField control={control} />
					<ClassField control={control} />
				</>
			)}
		</>
	);
}
