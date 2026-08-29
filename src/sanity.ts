import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "e3kyrsn9", // YOUR TRUE ID
  dataset: "testing",    // REPLACE THIS with whatever word is in your Datasets tab!
  apiVersion: "2024-01-01",
  useCdn: false, 
  stega: {
    studioUrl: process.env.NODE_ENV === 'development'
      ? "http://localhost:3333"
      : "https://e3kyrsn9.sanity.studio",
  },
});

const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}