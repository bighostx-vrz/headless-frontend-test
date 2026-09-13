import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import {SectionHeaderV1} from './WebSectionStaticV1'
import VideoChannelRuntimeV1,{type BhxVideoChannelItem} from './VideoChannelRuntimeV1'

const clean=(value:any)=>stegaClean(value==null?'':String(value)).trim()
const safeHttps=(value:any)=>{try{const url=new URL(clean(value));return url.protocol==='https:'?url.toString():''}catch{return ''}}
function youtubeId(value:any){const url=safeHttps(value);if(!url)return '';try{const parsed=new URL(url);const host=parsed.hostname.toLowerCase().replace(/^www\./,'');if(host==='youtu.be')return parsed.pathname.split('/').filter(Boolean)[0]?.slice(0,11)||'';if(host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com'){const fromQuery=parsed.searchParams.get('v');if(fromQuery&&/^[A-Za-z0-9_-]{11}$/.test(fromQuery))return fromQuery;const parts=parsed.pathname.split('/').filter(Boolean);const pos=parts.findIndex(x=>['embed','shorts','live'].includes(x));const id=pos>=0?parts[pos+1]:'';return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:''}}catch{}return ''}
function vimeoId(value:any){const url=safeHttps(value);if(!url)return '';try{const parsed=new URL(url);const host=parsed.hostname.toLowerCase().replace(/^www\./,'');if(host!=='vimeo.com'&&host!=='player.vimeo.com')return '';const parts=parsed.pathname.split('/').filter(Boolean);const id=[...parts].reverse().find(x=>/^\d{5,15}$/.test(x));return id||''}catch{return ''}}
function directVideo(value:any){const url=safeHttps(value);return url&&/\.(?:mp4|webm|ogg|ogv)(?:$|[?#])/i.test(url)?url:''}
function posterUrl(image:any,ytId:string){if(image?.asset){try{return urlFor(image).width(1280).height(720).fit('crop').url()}catch{}}return ytId?`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`:''}
function normalizedItems(data:any):BhxVideoChannelItem[]{
  const primary=Array.isArray(data?.videoChannelItemsV1)&&data.videoChannelItemsV1.length?data.videoChannelItemsV1:[]
  const legacy=!primary.length&&Array.isArray(data?.items)?data.items.filter((x:any)=>x?.enabled!==false).map((x:any)=>({_key:x?._key,title:x?.title,description:x?.text,thumbnail:x?.image,videoUrl:x?.videoUrl,duration:x?.duration||x?.value})):[]
  return [...primary,...legacy].slice(0,80).map((item:any,index:number)=>{
    const raw=safeHttps(item?.videoUrl),yt=youtubeId(raw),vm=vimeoId(raw),direct=directVideo(raw)
    const provider=yt?'youtube':vm?'vimeo':direct?'direct':'external'
    const embedUrl=yt?`https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`:vm?`https://player.vimeo.com/video/${vm}`:direct
    return {key:clean(item?._key||`video-${index}`),title:clean(item?.title).slice(0,220),description:clean(item?.description).slice(0,2000),duration:clean(item?.duration).slice(0,160),posterUrl:posterUrl(item?.thumbnail,yt),provider,embedUrl,externalUrl:raw}
  }).filter((item:BhxVideoChannelItem)=>item.title||item.embedUrl||item.externalUrl||item.posterUrl)
}
function layoutValue(value:any){const layout=clean(value||'grid');return ['theater','stacked_grid','stacked_scroll','scroll','grid','featured','slider'].includes(layout)?layout:'grid'}
export default function VideoChannelV1({data}:{data:any}){
  const items=normalizedItems(data)
  if(!items.length)return <><SectionHeaderV1 data={data}/><div className="bhx-v1-empty">No video items added yet.</div></>
  const layout=layoutValue(data?.videoChannelLayoutV1)
  return <><SectionHeaderV1 data={data}/><VideoChannelRuntimeV1 items={items} layout={layout} desktopColumns={Math.max(1,Math.min(5,Number(data?.videoChannelColumnsV1||3)))} legacySlider={{autoplay:data?.videoChannelAutoplay===true,seconds:Math.max(0,Math.min(60,Number(data?.videoChannelAutoplaySeconds??5))),showArrows:data?.videoChannelShowArrows!==false,showDots:data?.videoChannelShowDots!==false,enableDrag:data?.videoChannelEnableDrag!==false,pauseOnHover:data?.videoChannelPauseOnHover!==false}}/></>
}
