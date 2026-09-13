import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import MenuRenderer,{menuHref} from '@/components/MenuRenderer'

function LegacyMenu({items,searchLabel}:{items:any[],searchLabel:string}){return <nav className="main-nav legacy-nav" aria-label="Main navigation">{items?.filter((x:any)=>x.visible!==false).map((item:any,i:number)=><div className="nav-item" key={`${item.label}-${i}`}><a href={item.link||'#'}>{item.label}</a>{item.children?.length>0&&<div className="nav-children">{item.children.filter((x:any)=>x.visible!==false).map((child:any,j:number)=><a href={child.link||'#'} key={j}>{child.label}</a>)}</div>}</div>)}<a href="/search">{searchLabel||'Search'}</a></nav>}

export default function SiteHeader({settings}:{settings:any}){
  const template=settings?.activeHeaderTemplate
  const primary=template?.primaryMenu||settings?.primaryMenu
  const utility=template?.utilityMenu||settings?.utilityMenu
  const mobile=template?.mobileMenu||settings?.mobileMenu||primary
  const sticky=template?.sticky??settings?.headerSticky
  const mobileBreakpoint=mobile?.mobileBreakpoint||900
  const layout=template?.layout||'logo-left'
  const headerStyle:any={
    '--header-height':`${template?.height||72}px`,
    '--header-bg':template?.backgroundColor?.hex||undefined,
    '--header-text':template?.textColor?.hex||undefined,
    '--header-logo-width':`${template?.logoWidth||180}px`,
    '--header-mobile-logo-width':`${template?.mobileLogoWidth||140}px`,
  }
  return <header id="top" className={`site-header bhx-header header-${layout} breakpoint-${mobileBreakpoint} ${sticky?'sticky':''} ${template?.transparentOverHero?'header-transparent':''} ${template?.borderBottom?'header-border':''}`} style={headerStyle}>
    {utility&&<div className="utility-bar"><div className="utility-inner"><MenuRenderer menu={utility} variant="utility"/></div></div>}
    <div className={`site-header-inner header-width-${template?.containerWidth||'global'}`}>
      <a className="site-logo" href="/">{settings?.logo?.asset?<Image src={urlFor(settings.logo).height(100).url()} alt={settings.siteTitle||'Site'} width={template?.logoWidth||180} height={70}/>:<strong>{settings?.siteTitle||'BigHostX Site Builder'}</strong>}</a>
      <div className="desktop-menu-slot">{primary?<MenuRenderer menu={primary}/>:<LegacyMenu items={settings?.mainNav||[]} searchLabel={settings?.aiSearchLabel}/>}</div>
      {template?.ctaLabel&&<a className="header-cta button" href={menuHref(template.ctaLink)}>{template.ctaLabel}</a>}
      <details className={`mobile-menu-shell mobile-style-${mobile?.mobileStyle||'dropdown'}`}>
        <summary aria-label="Open navigation"><span className="hamburger" aria-hidden="true">☰</span><span>{mobile?.mobileToggleLabel||'Menu'}</span></summary>
        <div className="mobile-menu-panel">{mobile?<MenuRenderer menu={mobile} variant="mobile"/>:<LegacyMenu items={settings?.mainNav||[]} searchLabel={settings?.aiSearchLabel}/>}</div>
      </details>
    </div>
  </header>
}
