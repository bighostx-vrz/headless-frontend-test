import CollectionCards from '@/components/CollectionCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {newsQuery} from '@/sanity/lib/queries'
export default async function Page(){const items=await sanityFetch<any[]>(newsQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">News</span><h1>News & recognition</h1><CollectionCards items={items} basePath="/news"/></div></section>}
