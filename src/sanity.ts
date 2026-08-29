import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "e3kyrsn9", 
  dataset: "testing", 
  apiVersion: "2024-01-01",
  useCdn: false, 
  stega: {
    studioUrl: process.env.NODE_ENV === 'development'
      ? "http://localhost:3333"
      : "https://bighostx-admin.sanity.studio", // <-- YOUR NEW LIVE STUDIO URL
  },
});

const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}