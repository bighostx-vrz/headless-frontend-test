import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import GalleryRuntimeV1 from './GalleryRuntimeV1'
import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'

const clean=(value:any)=>String(value??'').trim()
const safeHref=(value:any)=>{const raw=clean(value);if(!raw)return '';return raw.startsWith('#')||raw.startsWith('/')||/^(https?:|mailto:|tel:)/i.test(raw)?raw:''}
const imageUrl=(image:any,w=1600,h=1000)=>image?.asset?urlFor(image).width(w).height(h).fit('max').url():''

function legacyItems(data:any){
  return Array.isArray(data?.items)?data.items.filter((item:any)=>item?.enabled!==false).map((item:any,index:number)=>({_key:item?._key||`legacy-gallery-${index}`,image:item?.image,alt:item?.title||'',title:item?.title||'',caption:item?.text||'',url:item?.link?.url||'',linkTarget:item?.link?.newWindow?'new':'same'})):[]
}

export default function GalleryV1({data,ownerId}:{data:any;ownerId:string}){
  const direct=Array.isArray(data?.galleryItemsV1)?data.galleryItemsV1.filter(Boolean):[]
  const items=(direct.length?direct:legacyItems(data)).slice(0,80)
  const lightbox=data?.galleryLightboxV1!==false
  const lightboxItems=items.map((item:any)=>({src:imageUrl(item?.image,2200,1600),alt:clean(item?.alt||item?.title),title:clean(item?.title),caption:clean(item?.caption)}))
  const slidesPerViewDesktop=Math.max(1,Math.min(6,Number(data?.gallerySlidesPerViewV1||1)))
  const slidesPerViewMobile=Math.max(1,Math.min(2,Number(data?.gallerySlidesPerViewMobileV1||1)))
  const responsiveSizes=`(max-width: 767px) ${Math.ceil(100/slidesPerViewMobile)}vw, ${Math.ceil(100/slidesPerViewDesktop)}vw`
  const style:any={
    '--bhx-gallery-per-desktop':slidesPerViewDesktop,
    '--bhx-gallery-per-mobile':slidesPerViewMobile,
    '--bhx-gallery-gap':`${Math.max(0,Math.min(100,Number(data?.galleryGapV1||16)))}px`,
    '--bhx-gallery-radius':`${Math.max(0,Math.min(100,Number(data?.galleryRadiusV1||12)))}px`,
    '--bhx-gallery-fit':clean(data?.galleryFitV1)==='contain'?'contain':'cover',
  }
  return <div className="bhx-gallery-section-v1" data-bhx-gallery-v1="true" style={style}>
    <SectionHeaderV1 data={data}/>
    {items.length?<GalleryRuntimeV1
      ownerId={ownerId}
      slidesPerViewDesktop={slidesPerViewDesktop}
      slidesPerViewMobile={slidesPerViewMobile}
      autoplay={data?.galleryAutoplay===true}
      seconds={Math.max(0,Number(data?.galleryAutoplaySeconds||5))}
      arrows={data?.galleryShowArrows!==false}
      dots={data?.galleryShowDots!==false}
      drag={data?.galleryEnableDrag!==false}
      pauseOnHover={data?.galleryPauseOnHover!==false}
      lightbox={lightbox}
      lightboxItems={lightboxItems}
    >
      {items.map((item:any,index:number)=>{
        const src=imageUrl(item?.image,1600,1000)
        if(!src)return <figure className="bhx-gallery-item is-empty" key={item?._key||index}><div className="bhx-gallery-empty-media">Image not selected</div>{item?.title?<figcaption><strong>{item.title}</strong></figcaption>:null}</figure>
        const href=safeHref(item?.url)
        const target=item?.linkTarget==='new'?'_blank':undefined
        const rel=target?'noopener noreferrer':undefined
        const image=<Image src={src} alt={clean(item?.alt||item?.title)} width={1600} height={1000} sizes={responsiveSizes}/>
        const media=lightbox?<button type="button" className="bhx-gallery-open" data-bhx-gallery-open={index} aria-label={`Open ${clean(item?.title||`image ${index+1}`)} in lightbox`}>{image}</button>:href?<a className="bhx-gallery-link-media" href={href} target={target} rel={rel}>{image}</a>:image
        return <figure className="bhx-gallery-item" key={item?._key||index} data-gallery-index={index}>
          <div className="bhx-gallery-media">{media}</div>
          {(item?.title||item?.caption)?<figcaption>{item?.title?(href&&lightbox?<strong><a href={href} target={target} rel={rel}>{item.title}</a></strong>:<strong>{item.title}</strong>):null}{item?.caption?<span>{item.caption}</span>:null}</figcaption>:null}
        </figure>
      })}
    </GalleryRuntimeV1>:<div className="bhx-v1-empty">No gallery images added yet.</div>}
    <SectionActions data={data}/>
  </div>
}
