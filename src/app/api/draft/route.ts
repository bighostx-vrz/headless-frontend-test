import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.enable();
  
  // Look at the URL to see if a specific slug was requested
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  // If there is a slug, go there. Otherwise, default to the homepage.
  redirect(slug ? slug : '/');
}