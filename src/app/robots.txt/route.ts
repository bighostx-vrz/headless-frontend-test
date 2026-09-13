import {client} from '@/sanity/lib/client'
import {siteSettingsQuery} from '@/sanity/lib/queries'
export async function GET(){const s=await client.fetch<any>(siteSettingsQuery);const base=String(s?.siteUrl||'http://localhost:3000').replace(/\/$/,'');const rules=s?.siteNoIndex?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;return new Response(rules,{headers:{'content-type':'text/plain'}})}
