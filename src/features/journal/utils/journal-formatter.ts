import type { Course } from "#/features/course";
import { formatLessonLabel } from "../constants/options";

type Params = {
	date: string;
	className: string;
	time: string;
	name: string;
	lessonList: string;
	generatedJournal: string;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
	dateStyle: "short",
});

function formatDate(date: string): string {
	const parsed = new Date(`${date}T00:00:00`);
	return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

export function journalFormatter({
	date,
	className,
	time,
	name,
	lessonList,
	generatedJournal,
}: Params): string {
	const header = [formatDate(date), `- ${className.toUpperCase()}`, time]
		.filter(Boolean)
		.join(" ");
	const lines = [header, name];
	if (lessonList) lines.push(lessonList);
	return `${lines.join("\n")}\n\n${generatedJournal}`;
}

export function buildLessonList(
	courses: Course[],
	courseId: string | undefined,
	lessons: { id: number }[],
): string {
	const course = courses.find((item) => String(item.id) === courseId);
	if (!course) return "";

	const selected = new Set(lessons.map((lesson) => lesson.id));
	return course.lessons
		.filter((lesson) => selected.has(lesson.id))
		.map(formatLessonLabel)
		.join("\n");
}
