import { Fragment } from "react";
import { Controller, useWatch } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import type { FullCourse } from "@/features/course";

import type { FieldController } from "../types";
import { courseFormatter } from "../utils/course-formatter";

const OTHER_COURSE = "other";

type Props = {
	courseOptions: Omit<FullCourse, "lessons">[];
} & FieldController;

function CourseOtherField({ control }: FieldController) {
	const courseId = useWatch({ control, name: "courseId" });
	if (courseId !== OTHER_COURSE) return null;

	return (
		<Controller
			name="courseOtherText"
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>Please specify</FieldLabel>
					<Input
						id={field.name}
						placeholder="Type the course or activity..."
						{...field}
						value={field.value ?? ""}
					/>
					{fieldState.error && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}

export function CourseField({ control, courseOptions }: Props) {
	const { courseNameMap, groupedCourseOptions } =
		courseFormatter(courseOptions);

	return (
		<>
			<Controller
				name="courseId"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Course</FieldLabel>
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="w-full min-w-0">
								<SelectValue placeholder="Select course">
									{field.value === OTHER_COURSE ? (
										"Other"
									) : field.value ? (
										(courseNameMap.get(field.value) ?? "Select course")
									) : (
										<span>Select course</span>
									)}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{groupedCourseOptions.map(({ label, options }) => (
										<Fragment key={label}>
											<SelectLabel>{label}</SelectLabel>
											{options.map((course) => (
												<SelectItem
													key={`course-${course.value}`}
													value={String(course.value)}
												>
													{course.label}
												</SelectItem>
											))}
										</Fragment>
									))}
								</SelectGroup>
								<SelectGroup>
									<SelectLabel>Other</SelectLabel>
									<SelectItem value={OTHER_COURSE}>Other</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						{fieldState.error && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<CourseOtherField control={control} />
		</>
	);
}
