import { useMemo } from "react";
import type { FullCourse } from "#/features/course";

export const courseFormatter = (data: Omit<FullCourse, "lessons">[]) => {
  const courseNameMap = useMemo(
    () => new Map(data.map((c) => [String(c.id), c.name])),
    [data],
  );

  const groupedCourseOptions = useMemo(() => {
    const map = new Map<
      string,
      { label: string; options: { value: string; label: string }[] }
    >();
    for (const c of data) {
      const key = String(c.category.id);
      let group = map.get(key);
      if (!group) {
        group = { label: c.category.name, options: [] };
        map.set(key, group);
      }
      group.options.push({ value: String(c.id), label: c.name });
    }
    return [...map.values()];
  }, [data]);

  return { courseNameMap, groupedCourseOptions };
};
