import {stegaClean} from 'next-sanity'
const clean=(v:any)=>stegaClean(v==null?'':String(v)).trim()
const n=(v:any,d:number,min:number,max:number)=>{const x=Number(v);return Number.isFinite(x)?Math.max(min,Math.min(max,x)):d}
const c=(v:any,d:string)=>{const x=typeof v==='string'?clean(v):clean(v?.hex);return /^#[0-9a-f]{3,8}$/i.test(x)?x:d}
export function stickyNavV1Css(id:string,data:any){
  const align=['left','center','right'].includes(clean(data.stickyNavAlignV1))?clean(data.stickyNavAlignV1):'center'
  const justify=align==='left'?'flex-start':align==='right'?'flex-end':'center'
  const radius=n(data.stickyNavRadiusV1,12,0,100)
  const z=n(data.stickyNavZIndexV1,20,0,9999)
  const bg=c(data.stickyNavBackgroundV1,'#ffffff'),text=c(data.stickyNavTextColorV1,'#111827'),active=c(data.stickyNavActiveColorV1,'#4f46e5')
  return `#${id} .bhx-sticky-nav-host{position:relative;width:100%}#${id} .bhx-sticky-nav{position:relative;z-index:${z};display:flex;align-items:center;justify-content:${justify};gap:8px;max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:thin;padding:10px;background:${bg};color:${text};border:1px solid rgba(128,128,128,.2);border-radius:${radius}px;box-shadow:0 4px 18px rgba(15,23,42,.05);backdrop-filter:blur(10px);-webkit-overflow-scrolling:touch}#${id} .bhx-sticky-nav.is-stuck{position:fixed;box-shadow:0 10px 28px rgba(15,23,42,.16)}#${id} .bhx-sticky-nav a{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;white-space:nowrap;text-decoration:none;color:${text};padding:8px 12px;border-radius:${Math.min(radius,18)}px;scroll-snap-align:center;transition:background-color .16s ease,color .16s ease,box-shadow .16s ease}#${id} .bhx-sticky-nav a:hover{background:color-mix(in srgb,${active} 12%,transparent)}#${id} .bhx-sticky-nav a.is-active,#${id} .bhx-sticky-nav a[aria-current="location"]{background:${active};color:#fff}#${id} .bhx-sticky-nav a:focus-visible{outline:3px solid ${active};outline-offset:2px}@media(max-width:767px){#${id} .bhx-sticky-nav{justify-content:flex-start;scroll-snap-type:x proximity;border-radius:${Math.min(radius,18)}px}#${id} .bhx-sticky-nav a{scroll-snap-stop:normal}}@media(prefers-reduced-motion:reduce){#${id} .bhx-sticky-nav a{transition:none!important;scroll-behavior:auto!important}}`
}
