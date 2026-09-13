import CollectionCards from '@/components/CollectionCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {servicesQuery} from '@/sanity/lib/queries'
export default async function Page(){const items=await sanityFetch<any[]>(servicesQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">Services</span><h1>Services</h1><CollectionCards items={items} basePath="/services"/></div></section>}
