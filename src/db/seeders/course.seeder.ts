import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sql } from "drizzle-orm";

import type { Category, Course } from "@/features/course";

import { categories, courses, lessons } from "../schema";
import type { DB } from "../seed";

const CHUNK_SIZE = 500;

function chunk<T>(items: T[], size = CHUNK_SIZE): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		result.push(items.slice(i, i + size));
	}
	return result;
}

type DataType = Category & { courses: Course[] };

export async function courseSeeder(db: DB) {
	const file = resolve(process.cwd(), "src/db/seeders/data/courses.json");
	const data: DataType[] = JSON.parse(readFileSync(file, "utf-8"));

	const categoryRows = data.map((p) => ({ id: p.id, name: p.name }));

	const courseRows = data.flatMap((p) =>
		p.courses.map((c) => ({ id: c.id, name: c.name, categoryId: p.id })),
	);

	const lessonRows = data.flatMap((p) =>
		p.courses.flatMap((c) =>
			c.lessons.map((l) => ({
				id: l.id,
				courseId: c.id,
				number: l.number,
				name: l.name,
				objectives: l.objectives,
			})),
		),
	);

	await db.transaction(async (tx) => {
		await tx.execute(sql`
			CREATE TABLE IF NOT EXISTS "categories" (
				"id" serial PRIMARY KEY NOT NULL,
				"name" text NOT NULL,
				"created_at" timestamp DEFAULT now()
			)
		`);
		await tx.execute(sql`
			CREATE TABLE IF NOT EXISTS "courses" (
				"id" serial PRIMARY KEY NOT NULL,
				"category_id" integer NOT NULL REFERENCES "categories"("id") ON DELETE cascade,
				"name" text NOT NULL,
				"created_at" timestamp DEFAULT now()
			)
		`);
		await tx.execute(sql`
			CREATE TABLE IF NOT EXISTS "lessons" (
				"id" serial PRIMARY KEY NOT NULL,
				"course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE cascade,
				"name" text NOT NULL,
				"number" integer NOT NULL,
				"objectives" text[] NOT NULL,
				"created_at" timestamp DEFAULT now()
			)
		`);

		await tx.execute(
			sql`TRUNCATE TABLE ${lessons}, ${courses}, ${categories} RESTART IDENTITY CASCADE`,
		);

		await tx.insert(categories).values(categoryRows);
		for (const part of chunk(courseRows)) {
			await tx.insert(courses).values(part);
		}
		for (const part of chunk(lessonRows)) {
			await tx.insert(lessons).values(part);
		}

		for (const table of ["categories", "courses", "lessons"]) {
			await tx.execute(
				sql`SELECT setval(
              pg_get_serial_sequence(${table}, 'id'),
              COALESCE((SELECT MAX(id) FROM ${sql.identifier(table)}), 1),
              (SELECT COUNT(*) > 0 FROM ${sql.identifier(table)})
            )`,
			);
		}
	});

	console.log(
		`Done: ${categoryRows.length} categories, ${courseRows.length} courses, ${lessonRows.length} lessons`,
	);
}
