import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "testing", // (Or whatever your dataset name was!)
  apiVersion: "2024-01-01",
  useCdn: false,
});

// This builds the image URLs for Next.js to use
const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}