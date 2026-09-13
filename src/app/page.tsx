import PageBuilder from '@/components/PageBuilder'
import WebPageSections from '@/components/WebPageSections'
import {sanityFetch} from '@/sanity/lib/fetch'
import {homePageQuery} from '@/sanity/lib/queries'
export default async function Home(){const page=await sanityFetch<any>(homePageQuery);if(!page)return <section className="content-section"><div className="section-inner width-contained"><h1>BigHostX Sanity Site Builder</h1><p>Create a Web Page with slug <code>home</code> or run the Core demo seeder.</p></div></section>;return page.sections?.length?<WebPageSections sections={page.sections}/>:<PageBuilder blocks={page.pageBuilder}/>}
