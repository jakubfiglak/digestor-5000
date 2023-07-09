import { env } from "@/env.mjs";
import { article } from "@/sanity/schemas/article";
import { defineConfig } from "@sanity-typed/types";
import { visionTool } from "@sanity/vision";
import { deskTool } from "sanity/desk";

export default defineConfig({
  basePath: "/studio", // <-- important that `basePath` matches the route you're mounting your studio from, it applies to both `/pages` and `/app`
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [article],
  },
});
