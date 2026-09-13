import {V1_ICON_SVG} from './v1Icons'

export default function V1Icon({name,size=24,className=''}:{name?:string;size?:number;className?:string}){
  const key=String(name||'outline-check-circle')
  const markup=V1_ICON_SVG[key]||V1_ICON_SVG['outline-check-circle']||''
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{__html:markup}}/>
}
