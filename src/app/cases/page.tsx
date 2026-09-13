import CasesBrowser from '@/components/CasesBrowser'
import {sanityFetch} from '@/sanity/lib/fetch'
import {casesQuery} from '@/sanity/lib/queries'
export default async function Page(){const items=await sanityFetch<any[]>(casesQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">Case Studies</span><h1>Proof, not promises — outcomes we've shipped.</h1><p className="lead">Filter by industry, service or region.</p><CasesBrowser items={items}/></div></section>}
