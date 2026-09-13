import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import AlbumLightboxV1 from './AlbumLightboxV1'
import {SectionHeaderV1} from './WebSectionStaticV1'

const clean=(value:any)=>String(value??'').trim()
const imageUrl=(image:any,w=1600,h=1100)=>image?.asset?urlFor(image).width(w).height(h).fit('max').url():''
const align=(value:any)=>['start','center','end','stretch'].includes(clean(value))?clean(value):'start'

type LightboxImage={src:string;alt:string;title:string;caption:string}
type LightboxAlbum={title:string;images:LightboxImage[]}

function albumImages(album:any):LightboxImage[]{
  const images=(Array.isArray(album?.images)?album.images:[]).filter((item:any)=>item?.image?.asset).slice(0,80).map((item:any)=>({
    src:imageUrl(item.image,2200,1600),alt:clean(item.alt||item.title||album?.title),title:clean(item.title),caption:clean(item.caption),
  })).filter((item:LightboxImage)=>Boolean(item.src))
  if(!images.length&&album?.cover?.asset){const src=imageUrl(album.cover,2200,1600);if(src)images.push({src,alt:clean(album?.title),title:clean(album?.title),caption:clean(album?.description)})}
  return images
}

export default function AlbumV1({data,ownerId}:{data:any;ownerId:string}){
  const albums=(Array.isArray(data?.albumsV1)?data.albumsV1.filter(Boolean):[]).slice(0,24)
  const lightbox=data?.albumLightboxV1!==false
  const lightboxAlbums:LightboxAlbum[]=albums.map((album:any)=>({title:clean(album?.title),images:albumImages(album)}))
  const desktop=Math.max(1,Math.min(6,Number(data?.albumColumnsV1||3)))
  const tablet=Math.max(1,Math.min(4,Number(data?.albumColumnsTabletV1||2)))
  const mobile=Math.max(1,Math.min(2,Number(data?.albumColumnsMobileV1||1)))
  const classes=['bhx-album-grid-v1',`bhx-album-align-desktop-${align(data?.albumLastRowAlignDesktopV1)}`,`bhx-album-align-tablet-${align(data?.albumLastRowAlignTabletV1)}`,`bhx-album-align-mobile-${align(data?.albumLastRowAlignMobileV1)}`].join(' ')
  const style:any={'--bhx-album-cols-desktop':desktop,'--bhx-album-cols-tablet':tablet,'--bhx-album-cols-mobile':mobile}
  return <div className="bhx-album-section-v1" data-bhx-album-v1="true">
    <SectionHeaderV1 data={data}/>
    {albums.length?<div className={classes} style={style}>{albums.map((album:any,albumIndex:number)=>{
      const images=lightboxAlbums[albumIndex]?.images||[]
      const coverSrc=imageUrl(album?.cover,1200,840)||(images[0]?.src||'')
      const openAttrs=lightbox&&images.length?{'data-bhx-album-open':'true','data-album-index':albumIndex,'data-image-index':0}:{}
      return <article className="bhx-album-card-v1" key={album?._key||albumIndex}>
        {coverSrc?<a className="bhx-album-cover-v1" href={images[0]?.src||coverSrc} target="_blank" rel="noopener noreferrer" aria-label={lightbox&&images.length?`Open ${clean(album?.title||'album')} gallery`:`Open ${clean(album?.title||'album')} image`} {...openAttrs}><Image src={coverSrc} alt={clean(album?.title)} width={1200} height={840} sizes="(max-width: 767px) 100vw, (max-width: 900px) 50vw, 33vw"/></a>:<div className="bhx-album-cover-v1 is-empty" aria-hidden="true">Cover image not selected</div>}
        <div className="bhx-album-copy-v1">{album?.title?<h3>{album.title}</h3>:null}{album?.description?<p>{album.description}</p>:null}</div>
        {images.length?<div className="bhx-album-thumbs-v1" aria-label={`${clean(album?.title||'Album')} image previews`}>{images.slice(0,4).map((item,imageIndex)=>{const attrs=lightbox?{'data-bhx-album-open':'true','data-album-index':albumIndex,'data-image-index':imageIndex}:{};return <a className="bhx-album-thumb-v1" key={`${album?._key||albumIndex}-${imageIndex}`} href={item.src} target="_blank" rel="noopener noreferrer" aria-label={lightbox?`Open image ${imageIndex+1} of ${clean(album?.title||'album')}`:`Open image ${imageIndex+1}`} {...attrs}><Image src={item.src} alt={item.alt} width={360} height={260} sizes="(max-width: 767px) 25vw, 120px"/></a>})}</div>:null}
      </article>
    })}</div>:<div className="bhx-v1-empty">No albums added yet.</div>}
    {lightbox&&lightboxAlbums.some(album=>album.images.length)?<AlbumLightboxV1 ownerId={ownerId} albums={lightboxAlbums}/>:null}
  </div>
}
