import CollectionCards from '@/components/CollectionCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {insightsQuery} from '@/sanity/lib/queries'
export default async function Page(){const items=await sanityFetch<any[]>(insightsQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">Insights</span><h1>Thought leadership & insights</h1><CollectionCards items={items} basePath="/insights"/></div></section>}
