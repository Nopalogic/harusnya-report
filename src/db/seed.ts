import "./env";

import type { drizzle } from "drizzle-orm/node-postgres";
import { db } from ".";
import type * as schema from "./schema";
import { courseSeeder } from "./seeders/course.seeder";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

async function main() {
	try {
		// add seeder function
		await courseSeeder(db);
	} catch (err) {
		console.error("Seeding failed: ", err);
		process.exitCode = 1;
	} finally {
		await db.$client.end();
	}
}

await main();
