import { db } from "@/db/index";

import type { FullCourse } from "./types";

export async function listCourses(): Promise<FullCourse[]> {
  return await db.query.courses.findMany({
    with: {
      category: true,
      lessons: true,
    },
  });
}
