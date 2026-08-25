import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "testing", 
  apiVersion: "2024-01-01",
  useCdn: false,
  // 🔒 This tells Next.js to look for a secret variable on Vercel!
  token: process.env.SANITY_API_READ_TOKEN, 
  stega: {
    enabled: true, 
    studioUrl: "YOUR_LIVE_STUDIO_URL", // e.g., "https://inspira-studio.sanity.studio"
  },
});

const builder = createImageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}