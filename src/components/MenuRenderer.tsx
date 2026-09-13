import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import {frontendModules} from '@/modules/generated'

const clean=(value:any,fallback='')=>String(stegaClean(value??fallback))

export function menuHref(link:any):string{
  if(!link) return '#'
  const type=clean(link.linkType,'internal')
  if(type==='custom') {
    const raw=clean(link.customUrl,'#').trim()
    if(raw.startsWith('/')||raw.startsWith('#')||/^https?:\/\//i.test(raw)||/^mailto:/i.test(raw)||/^tel:/i.test(raw)) return raw
    return '#'
  }
  if(type==='anchor') return `#${clean(link.anchor).replace(/^#/,'')}`
  if(type==='none') return '#'
  const target=link.internalTarget
  const slug=clean(target?.slug?.current)
  if(!target||!slug) return '#'
  const routes:Record<string,(s:string)=>string>={
    page:(s)=>s==='home'?'/':`/${s}`,
    post:(s)=>`/blog/${s}`,
    category:(s)=>`/category/${s}`,
  }
  const core=routes[target._type]?.(slug); if(core)return core; for(const module of frontendModules){const resolved=module.resolveInternalLink?.(target);if(resolved)return resolved} return `/${slug}`
}

function LinkView({link,label,className}:{link:any,label?:string,className?:string}){
  const href=menuHref(link)
  const text=label||clean(link?.label,'Link')
  if(clean(link?.linkType)==='none') return <span className={className}>{link?.iconText&&<span aria-hidden="true">{link.iconText} </span>}{text}{link?.badge&&<small className="menu-badge">{link.badge}</small>}</span>
  return <a className={className} href={href} target={link?.openNewTab?'_blank':undefined} rel={link?.openNewTab?'noopener noreferrer':undefined} aria-label={link?.ariaLabel||undefined}>{link?.iconText&&<span aria-hidden="true">{link.iconText} </span>}{text}{link?.badge&&<small className="menu-badge">{link.badge}</small>}</a>
}

function MegaBlock({block}:{block:any}){
  if(block?._type==='menuLinkGroup') return <div className="mega-link-group">{block.heading&&<h4>{block.heading}</h4>}{block.description&&<p>{block.description}</p>}<div className="mega-links">{block.links?.filter((x:any)=>x.enabled!==false).map((link:any,i:number)=><LinkView key={link._key||i} link={link}/>)}</div></div>
  if(block?._type==='menuPromoCard') return <div className="mega-promo">{block.image?.asset&&<Image src={urlFor(block.image).width(720).height(420).url()} alt={block.title||'Menu promotion'} width={360} height={210}/>}<div>{block.eyebrow&&<small>{block.eyebrow}</small>}{block.title&&<h4>{block.title}</h4>}{block.text&&<p>{block.text}</p>}{block.link&&<LinkView link={block.link}/>}</div></div>
  if(block?._type==='menuTextBlock') return <div className="mega-text">{block.eyebrow&&<small>{block.eyebrow}</small>}{block.heading&&<h4>{block.heading}</h4>}{block.text&&<p>{block.text}</p>}{block.link&&<LinkView link={block.link}/>}</div>
  if(block?._type==='menuImageBlock') {const image=block.image?.asset?<Image src={urlFor(block.image).width(720).height(420).url()} alt={block.alt||block.caption||'Menu image'} width={360} height={210}/>:null;return <div className="mega-image">{block.link?<a href={menuHref(block.link)}>{image}</a>:image}{block.caption&&<small>{block.caption}</small>}</div>}
  if(block?._type==='menuButtonBlock') return <LinkView link={{...block.link,label:block.label}} className={`button ${block.style==='secondary'?'button-secondary':block.style==='text'?'button-text':''}`}/>
  return null
}

function MegaPanel({layout}:{layout:any}){
  if(!layout) return null
  const widths=(layout.columns||[]).map((c:any)=>clean(c.width,'1fr')).join(' ')||'1fr'
  const style:any={
    '--mega-custom-width':clean(layout.customWidth,'1000px'),
    '--mega-bg':layout.backgroundColor?.hex||undefined,
    '--mega-text':layout.textColor?.hex||undefined,
    '--mega-accent':layout.accentColor?.hex||undefined,
    '--mega-radius':clean(layout.borderRadius,'12px'),
    gridTemplateColumns:widths,
  }
  return <div className={`bhx-mega-panel mega-width-${clean(layout.panelWidth,'container')} mega-gap-${clean(layout.columnGap,'medium')} mega-pad-${clean(layout.padding,'medium')} mega-theme-${clean(layout.theme,'light')} mega-shadow-${clean(layout.shadow,'medium')}`} style={style}>
    {layout.columns?.map((column:any,i:number)=><div className="mega-column" key={column._key||i}>{column.blocks?.map((block:any,j:number)=><MegaBlock key={block._key||j} block={block}/>)}</div>)}
  </div>
}

function StandardSubmenu({children}:{children:any[]}){
  return <div className="bhx-submenu">{children?.filter((x:any)=>x.enabled!==false).map((child:any,i:number)=><div className="bhx-submenu-item" key={child._key||i}><LinkView link={{...child.link,badge:child.badge,iconText:child.iconText}} label={child.label}/>{child.children?.length>0&&<div className="bhx-level3">{child.children.filter((x:any)=>x.enabled!==false).map((grand:any,j:number)=><LinkView key={grand._key||j} link={{...grand.link,badge:grand.badge,iconText:grand.iconText}} label={grand.label}/>)}</div>}</div>)}</div>
}

function DesktopItem({item,menu}:{item:any,menu:any}){
  const dropdown=clean(item.dropdownType,'none')
  const trigger=<LinkView link={{...item.link,badge:item.badge,iconText:item.iconText}} label={item.label} className={item.highlight?'menu-highlight':undefined}/>
  if(dropdown==='none') return <div className={`bhx-menu-item ${item.cssClass||''}`}>{trigger}</div>
  const panel=dropdown==='mega'?<MegaPanel layout={item.megaMenu}/>:<StandardSubmenu children={item.children||[]}/>
  if(clean(menu.openBehavior,'hover')==='click') return <details className={`bhx-menu-item has-dropdown click-dropdown ${item.cssClass||''}`}><summary>{item.label}</summary>{panel}</details>
  return <div className={`bhx-menu-item has-dropdown hover-dropdown ${item.cssClass||''}`}>{trigger}{panel}</div>
}

function MobileItem({item}:{item:any}){
  const dropdown=clean(item.dropdownType,'none')
  if(dropdown==='none') return <div className="bhx-mobile-item"><LinkView link={{...item.link,badge:item.badge,iconText:item.iconText}} label={item.label}/></div>
  return <details className="bhx-mobile-item"><summary>{item.label}</summary>{dropdown==='mega'?<MegaPanel layout={item.megaMenu}/>:<StandardSubmenu children={item.children||[]}/>}</details>
}

export default function MenuRenderer({menu,variant='desktop'}:{menu:any,variant?:'desktop'|'mobile'|'footer'|'utility'}){
  if(!menu?.items?.length) return null
  const style:any={
    '--menu-text':menu.textColor?.hex||undefined,
    '--menu-hover':menu.hoverColor?.hex||undefined,
    '--menu-active':menu.activeColor?.hex||undefined,
    '--dropdown-bg':menu.dropdownBackground?.hex||undefined,
    '--dropdown-text':menu.dropdownTextColor?.hex||undefined,
    '--dropdown-width':clean(menu.dropdownWidth,'260px'),
    '--dropdown-radius':clean(menu.dropdownRadius,'12px'),
    '--menu-weight':clean(menu.fontWeight,'600'),
  }
  if(variant==='mobile') return <nav className={`bhx-mobile-menu mobile-style-${clean(menu.mobileStyle,'dropdown')}`} style={style} aria-label={`${menu.title||'Mobile'} navigation`}>{menu.items.filter((x:any)=>x.enabled!==false).map((item:any,i:number)=><MobileItem key={item._key||i} item={item}/>)}</nav>
  if(variant==='footer') return <nav className="bhx-footer-menu" style={style} aria-label={`${menu.title||'Footer'} navigation`}>{menu.items.filter((x:any)=>x.enabled!==false).map((item:any,i:number)=><div key={item._key||i}><LinkView link={{...item.link,badge:item.badge,iconText:item.iconText}} label={item.label}/>{item.children?.length>0&&<div className="footer-submenu">{item.children.filter((x:any)=>x.enabled!==false).map((c:any,j:number)=><LinkView key={c._key||j} link={{...c.link,badge:c.badge,iconText:c.iconText}} label={c.label}/>)}</div>}</div>)}</nav>
  return <nav className={`bhx-menu bhx-menu-${variant} menu-layout-${clean(menu.desktopLayout,'horizontal')} menu-align-${clean(menu.alignment,'right')} menu-gap-${clean(menu.itemGap,'medium')} menu-size-${clean(menu.fontSize,'medium')} menu-animation-${clean(menu.dropdownAnimation,'fade')}`} style={style} aria-label={`${menu.title||'Primary'} navigation`}>{menu.items.filter((x:any)=>x.enabled!==false).map((item:any,i:number)=><DesktopItem key={item._key||i} item={item} menu={menu}/>)}</nav>
}
