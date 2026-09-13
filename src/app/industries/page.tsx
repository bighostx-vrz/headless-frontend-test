import CollectionCards from '@/components/CollectionCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {industriesQuery} from '@/sanity/lib/queries'
export default async function Page(){const items=await sanityFetch<any[]>(industriesQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">Industries</span><h1>Industries</h1><CollectionCards items={items} basePath="/industries"/></div></section>}
