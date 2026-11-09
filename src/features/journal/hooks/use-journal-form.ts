import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { INVALID_FORM } from "../constants/messages";
import type { JournalType } from "../validation";
import { journalSchema } from "../validation";
import { useGenerateContent } from "./use-generate-content";

const formatDate = (d: Date) => {
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const useJournalForm = () => {
	const form = useForm<JournalType>({
		resolver: zodResolver(journalSchema),
		mode: "onTouched",
		defaultValues: {
			date: formatDate(new Date()),
			time: "",
			class: "",
			name: "",
			language: "Indonesian",
			header: false,
			courseId: "",
			courseOtherText: "",
			lessons: [],
			character: [],
			characterOtherText: "",
			note: "",
			generated_report: "",
		},
	});

	const courseId = useWatch({ control: form.control, name: "courseId" });
	const previousCourseId = useRef(courseId);

	useEffect(() => {
		if (previousCourseId.current === courseId) return;
		previousCourseId.current = courseId;
		form.resetField("lessons", { defaultValue: [] });
		form.resetField("courseOtherText", { defaultValue: "" });
	}, [courseId, form.resetField]);

	const { generate, reset, isGenerating, error } = useGenerateContent({
		onChunk: (text) =>
			form.setValue("generated_report", text, { shouldDirty: true }),
	});

	const onSubmit = async (payload: JournalType) => {
		form.setValue("generated_report", "", { shouldDirty: true });
		await generate(payload);
	};

	const submit = form.handleSubmit(onSubmit, () => {
		toast.error(INVALID_FORM);
	});

	const clearForm = useCallback(() => {
		reset();
		form.reset();
	}, [form, reset]);

	return { form, submit, isGenerating, generateError: error, clearForm };
};
