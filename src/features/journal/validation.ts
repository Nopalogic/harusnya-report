import z from "zod";

const lesson = z.object({
	id: z.number().int().positive("Lesson is required"),
	progress: z.array(z.string()),
	progressOtherText: z.string(),
});

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const journalSchema = z
	.object({
		date: z
			.string()
			.optional()
			.refine((val) => !val || DATE_PATTERN.test(val), {
				message: "Date must be in YYYY-MM-DD format",
			}),
		time: z
			.string()
			.optional()
			.refine(
				(val) =>
					!val || /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/.test(val),
				{ message: "Time must be in HH:MM-HH:MM format (24-hour)" },
			),
		class: z.string().optional(),
		name: z.string().min(1, "Student name is required"),
		header: z.boolean(),
		language: z.enum(["Indonesian", "English"]),
		courseId: z.string().optional(),
		courseOtherText: z.string().optional(),
		lessons: z.array(lesson),
		character: z.array(z.string()).min(1, "At least one character is required"),
		characterOtherText: z.string().optional(),
		note: z.string(),
		generated_report: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.header) {
			if (!data.date?.trim()) {
				ctx.addIssue({
					code: "custom",
					message: "Date is required",
					path: ["date"],
				});
			}

			if (!data.class?.trim()) {
				ctx.addIssue({
					code: "custom",
					message: "Class is required",
					path: ["class"],
				});
			}

			if (!data.time) {
				ctx.addIssue({
					code: "custom",
					message: "Time is required",
					path: ["time"],
				});
			}
		}

		if (!data.courseId) {
			ctx.addIssue({
				code: "custom",
				message: "Course is required",
				path: ["courseId"],
			});
		}

		if (data.courseId === "other" && !data.courseOtherText?.trim()) {
			ctx.addIssue({
				code: "custom",
				message: "Please specify the course or purpose",
				path: ["courseOtherText"],
			});
		}

		if (data.courseId && data.courseId !== "other" && !data.lessons.length) {
			ctx.addIssue({
				code: "custom",
				message: "Lesson is required",
				path: ["lessons"],
			});
		}

		if (data.character.includes("other") && !data.characterOtherText?.trim()) {
			ctx.addIssue({
				code: "custom",
				message: "Please specify the other character",
				path: ["characterOtherText"],
			});
		}
	});

export type JournalType = z.infer<typeof journalSchema>;
