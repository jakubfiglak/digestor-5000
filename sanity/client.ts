import { createClient } from "next-sanity";
import { cache } from "react";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: false,
  studioUrl: "/studio",
});

export const client = {
  ...sanityClient,
  fetch: cache(sanityClient.fetch.bind(sanityClient)),
};
