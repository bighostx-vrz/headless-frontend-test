import WebSectionRenderer from '@/components/WebSectionRenderer'

export const completedConnectSectionTypes=['hero','services','textmedia','code','texttext','timeline','text_slider','testimonials','pricing','comp','cta','image_accent_cta','faq','flexible','gallery','album','content_filter','contact','sticky_nav','video_channel','benefits','text_cards','countdown','tabs','list_types','social_media','forms','news_magazine','profile_showcase','products','product_hero','product_categories','product_comparison'] as const
export type ConnectedSectionType=(typeof completedConnectSectionTypes)[number]

/**
 * Sanity Connect frontend adapter. It deliberately delegates to the canonical
 * Builder renderer instead of maintaining a second module renderer tree.
 */
export default function ConnectedSectionRenderer({section,instanceKey}:{section:any;instanceKey?:string}){
  const type=String(section?.sectionType||'')
  if(!completedConnectSectionTypes.includes(type as ConnectedSectionType))return null
  return <WebSectionRenderer row={{_key:instanceKey||section?._id||'bhx-connected',section}}/>
}
