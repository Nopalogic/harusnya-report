import { queryOptions } from "@tanstack/react-query";

import { getCourses } from "#/features/course/course.function";

export const coursesQueryOptions = () =>
	queryOptions({
		queryKey: ["courses"],
		queryFn: () => getCourses(),
		staleTime: "static",
	});
