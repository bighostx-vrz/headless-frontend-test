import {stegaClean} from 'next-sanity'
export default function HtmlBlock({data}: {data:any}) {
  if (!data?.code) return null
  if (process.env.ALLOW_ADVANCED_CODE !== 'true') return <pre className="advanced-code-disabled">Advanced HTML is stored but execution is disabled. Set ALLOW_ADVANCED_CODE=true only in a private learning environment.</pre>
  return <div className="advanced-html" dangerouslySetInnerHTML={{__html: stegaClean(data.code)}} />
}
