import V1Icon from './V1Icon'
import StickyNavRuntimeV1 from './StickyNavRuntimeV1'

type StickyItem={_key?:string;label?:string;anchor?:string;icon?:string}

function normalizeAnchor(value:any){
  const raw=String(value||'').trim().replace(/^#+/,'').trim()
  if(!raw||/[\u0000-\u001f\u007f]/.test(raw))return ''
  return raw.slice(0,160)
}

function normalizedItems(data:any){
  const rows=Array.isArray(data?.stickyNavItemsV1)?data.stickyNavItemsV1.slice(0,40):[]
  return rows.map((item:any,index:number)=>({
    _key:String(item?._key||`sticky-${index}`),
    label:String(item?.label||'').trim().slice(0,120),
    anchor:normalizeAnchor(item?.anchor),
    icon:String(item?.icon||'').trim(),
  })).filter((item:StickyItem)=>item.label&&item.anchor)
}

function StaticNav({items}:{items:StickyItem[]}){
  return <div className="bhx-sticky-nav-host" data-bhx-sticky-runtime="static">
    <nav className="bhx-sticky-nav" aria-label="Section navigation">
      {items.map(item=><a key={item._key} href={`#${encodeURIComponent(item.anchor||'')}`}>
        {item.icon?<V1Icon name={item.icon} size={18}/>:null}<span>{item.label}</span>
      </a>)}
    </nav>
  </div>
}

export default function StickyNavV1({data}:{data:any}){
  const items=normalizedItems(data)
  if(!items.length)return <div className="bhx-v1-empty">No navigation links added yet.</div>
  const sticky=data?.stickyNavEnabledV1!==false
  const trackActive=data?.stickyNavShowActiveV1!==false
  // When both behaviors are off, emit plain server/static anchor navigation with
  // zero Sticky Navigation hydration. Existing saved items remain untouched.
  if(!sticky&&!trackActive)return <StaticNav items={items}/>
  return <StickyNavRuntimeV1 items={items} sticky={sticky} trackActive={trackActive} offset={Math.max(0,Math.min(300,Number(data?.stickyNavOffsetV1||0)))}/>
}
