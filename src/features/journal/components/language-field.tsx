import { Controller } from "react-hook-form";

import { Field, FieldLabel } from "#/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";

import { LANGUAGE_OPTIONS } from "../constants/options";
import type { FieldController } from "../types";

const languageMap = new Map(
	LANGUAGE_OPTIONS.map((lang) => [lang.value, lang.label]),
);

export function LanguageField({ control }: FieldController) {
	return (
		<Controller
			name="language"
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} className="flex-1/4">
					<FieldLabel htmlFor={field.name} hidden>
						Language
					</FieldLabel>
					<Select value={field.value} onValueChange={field.onChange}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select language">
								{languageMap.get(field.value)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{LANGUAGE_OPTIONS.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</Field>
			)}
		/>
	);
}
