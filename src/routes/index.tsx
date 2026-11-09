import { createFileRoute } from "@tanstack/react-router";
import { JournalCreatePage } from "#/features/journal";

export const Route = createFileRoute("/")({ component: JournalCreatePage });
