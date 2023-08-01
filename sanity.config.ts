import { visionTool } from '@sanity/vision';
import { defineConfig } from '@sanity-typed/types';
import { deskTool } from 'sanity/desk';
import { media } from 'sanity-plugin-media';

import { env } from '@/env.mjs';
import { schemas } from '@/sanity/schemas';

export default defineConfig({
  basePath: '/studio', // <-- important that `basePath` matches the route you're mounting your studio from, it applies to both `/pages` and `/app`
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [deskTool(), visionTool(), media()],
  schema: {
    types: schemas,
  },
});
