import CollectionCards from '@/components/CollectionCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {eventsQuery} from '@/sanity/lib/queries'
export default async function Page(){const items=await sanityFetch<any[]>(eventsQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">Events</span><h1>Events</h1><CollectionCards items={items} basePath="/events"/></div></section>}
