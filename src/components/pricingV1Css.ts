type AnyMap=Record<string,any>
const n=(value:any,fallback:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))
const c=(value:any,fallback:string)=>typeof value==='string'&&value?value:(typeof value?.hex==='string'&&value.hex?value.hex:fallback)
const mode=(value:any,allowed:string[],fallback:string)=>allowed.includes(String(value||''))?String(value):fallback
const family=(value:any)=>({
  'System UI':'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  'Arial / Helvetica':'Arial,Helvetica,sans-serif',Georgia:'Georgia,serif','Times New Roman':'"Times New Roman",Times,serif','Courier New':'"Courier New",Courier,monospace','Trebuchet MS':'"Trebuchet MS",Arial,sans-serif',Verdana:'Verdana,Geneva,sans-serif',inherit:'inherit',
} as Record<string,string>)[String(value||'inherit')]||'inherit'
const weight=(value:any)=>/^(300|400|500|600|700|800|900)$/.test(String(value||''))?String(value):'inherit'
const justify=(value:any)=>({start:'flex-start',center:'center',end:'flex-end'} as Record<string,string>)[String(value||'center')]||'center'
const basis=(columns:number,gap:number)=>columns<=0?'':columns===1?'100%':`calc(${(100/columns).toFixed(6)}% - ${((gap*(columns-1))/columns).toFixed(6)}px)`
const exactColumns=(value:any,max:number)=>{const s=String(value||'');const v=Number(s);return Number.isInteger(v)&&v>=1&&v<=max?v:0}

export function pricingV1Css(ownerId:string,data:AnyMap){
  const gap=n(data.pricingGapV1,30,0,100)
  const desktopExact=exactColumns(data.pricingColumnsDesktopModeV1,6)
  const desktopLegacy=n(data.pricingColumnsV1,3,1,4)
  const desktopColumns=String(data.pricingColumnsDesktopModeV1||'')?desktopExact:desktopLegacy
  const tabletMode=String(data.pricingColumnsTabletModeV1||'')
  const tabletExact=tabletMode==='inherit'?desktopColumns:exactColumns(tabletMode,6)
  const tabletLegacy=n(data.pricingColumnsTabletV1,2,1,4)
  const tabletColumns=tabletMode?tabletExact:tabletLegacy
  const mobileMode=String(data.pricingColumnsMobileModeV1||'')
  const mobileExact=exactColumns(mobileMode,2)
  const mobileLegacy=n(data.pricingColumnsMobileV1,1,1,2)
  const mobileColumns=mobileMode?mobileExact:mobileLegacy
  const desktopBasis=desktopColumns?basis(desktopColumns,gap):'280px'
  const tabletBasis=tabletColumns?basis(tabletColumns,gap):desktopBasis
  const mobileBasis=mobileColumns?basis(mobileColumns,20):(layoutMobile==='scroll'?'min(84vw,360px)':'100%')
  const layoutDesktop=mode(data.pricingLayoutDesktopV1,['floating_cards','glassmorphism','minimal'],'floating_cards')
  const layoutMobile=mode(data.pricingLayoutMobileV1,['scroll','stacked'],'scroll')
  const cardBg=c(data.pricingCardBackgroundV1,'#ffffff')
  const accent=c(data.pricingAccentColorV1,'#4f46e5')
  const borderWidth=layoutDesktop==='minimal'?1:n(data.pricingCardBorderWidthV1,1,0,15)
  const borderColor=layoutDesktop==='glassmorphism'?'rgba(255,255,255,.25)':c(data.pricingCardBorderColorV1,'#e5e7eb')
  const radius=n(data.pricingCardRadiusV1,16,0,50)
  const pad=n(data.pricingCardPaddingV1,28,0,120)
  const shadow=layoutDesktop==='floating_cards'?'box-shadow:0 16px 36px rgba(15,23,42,.12);':layoutDesktop==='glassmorphism'?'box-shadow:0 14px 34px rgba(15,23,42,.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);':''
  const glassBg=layoutDesktop==='glassmorphism'?`background:${cardBg};background:color-mix(in srgb,${cardBg} 72%,transparent);`:`background:${cardBg};`
  const featAlign=mode(data.pricingFeatureAlignV1,['left','center'],'left')
  const featItems=featAlign==='center'?'align-items:center;text-align:center;':'align-items:flex-start;text-align:left;'
  return `#${ownerId} .bhx-pricing-v1{--bhx-pricing-accent:${accent};--bhx-pricing-toggle-bg:${c(data.pricingToggleBackgroundV1,'#f3f4f6')};--bhx-pricing-toggle-text:${c(data.pricingToggleTextColorV1,'#6b7280')};--bhx-pricing-toggle-active-bg:${c(data.pricingToggleActiveBackgroundV1,'#4f46e5')};--bhx-pricing-toggle-active-text:${c(data.pricingToggleActiveTextColorV1,'#ffffff')};}
#${ownerId} .bhx-pricing-header-v1{max-width:800px;margin:0 auto 34px;}
#${ownerId} .bhx-pricing-header-v1 .eyebrow{display:block;margin-bottom:8px;font-size:.875rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${accent}}
#${ownerId} .bhx-pricing-header-v1 h2{margin:0 0 12px;}
#${ownerId} .bhx-pricing-header-v1 .lead{margin:0;}
#${ownerId} .bhx-pricing-cycle-scroll-v1{max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain;padding:2px 2px 10px;margin:0 auto 26px;scrollbar-width:thin;}
#${ownerId} .bhx-pricing-cycle-toggle-v1{position:relative;display:flex;width:max-content;gap:4px;padding:5px;border-radius:999px;background:var(--bhx-pricing-toggle-bg);isolation:isolate;}
#${ownerId} .bhx-pricing-cycle-toggle-v1 button{position:relative;z-index:1;border:0;background:transparent;color:var(--bhx-pricing-toggle-text);border-radius:999px;padding:9px 15px;font:inherit;font-weight:650;white-space:nowrap;cursor:pointer;transition:color .2s ease;}
#${ownerId} .bhx-pricing-cycle-toggle-v1 button[aria-selected=true]{color:var(--bhx-pricing-toggle-active-text);}
#${ownerId} .bhx-pricing-cycle-toggle-v1 button:focus-visible{outline:2px solid var(--bhx-pricing-accent);outline-offset:3px;}
#${ownerId} .bhx-pricing-cycle-pill-v1{position:absolute;z-index:0;top:5px;bottom:5px;border-radius:999px;background:var(--bhx-pricing-toggle-active-bg);transition:left .24s ease,width .24s ease,opacity .15s ease;pointer-events:none;}
#${ownerId} .bhx-pricing-status-v1{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;}
#${ownerId} .bhx-pricing-cards-v1{display:flex;flex-wrap:wrap;justify-content:${justify(data.pricingLastRowAlignDesktopV1)};gap:${gap}px;align-items:${data.pricingEqualHeightV1===false?'flex-start':'stretch'};}
#${ownerId} .bhx-pricing-card-v1{position:relative;box-sizing:border-box;flex:1 1 ${desktopBasis};max-width:${desktopColumns?desktopBasis:'420px'};padding:${pad}px;border:${borderWidth}px solid ${borderColor};border-radius:${radius}px;${glassBg}${shadow}display:flex;flex-direction:column;min-width:0;transition:transform .2s ease,box-shadow .2s ease;}
#${ownerId} .bhx-pricing-card-v1.is-featured{border-color:${accent};box-shadow:0 18px 44px color-mix(in srgb,${accent} 18%,transparent);transform:translateY(-5px);}
#${ownerId} .bhx-pricing-badge-v1{position:absolute;top:14px;right:14px;display:inline-flex;padding:5px 9px;border-radius:999px;background:${accent};color:#fff;font-size:11px;font-weight:800;letter-spacing:.06em;}
#${ownerId} .bhx-pricing-name-v1{margin:0 0 10px;font-family:${family(data.pricingPlanFontFamilyV1)};font-weight:${weight(data.pricingPlanFontWeightV1)};font-size:${n(data.pricingPlanSizeDesktopV1,24,1,160)}px;}
#${ownerId} .bhx-pricing-description-v1{margin:0 0 16px;opacity:.8;}
#${ownerId} .bhx-pricing-price-row-v1{display:flex;align-items:baseline;gap:7px;margin:5px 0 22px;font-family:${family(data.pricingSetupFontFamilyV1)};font-weight:${weight(data.pricingSetupFontWeightV1)};}
#${ownerId} .bhx-pricing-price-v1{font-size:${n(data.pricingPriceSizeDesktopV1,48,1,160)}px;line-height:1;font-weight:inherit;}
#${ownerId} .bhx-pricing-suffix-v1{font-size:${n(data.pricingSuffixSizeDesktopV1,14,1,160)}px;opacity:.72;}
#${ownerId} .bhx-pricing-features-v1{display:flex;flex-direction:column;${featItems}gap:10px;list-style:none;padding:0;margin:0 0 24px;font-family:${family(data.pricingFeaturesFontFamilyV1)};font-weight:${weight(data.pricingFeaturesFontWeightV1)};font-size:${n(data.pricingFeaturesSizeDesktopV1,15,1,160)}px;}
#${ownerId} .bhx-pricing-features-v1 li{display:flex;gap:8px;align-items:flex-start;}
#${ownerId} .bhx-pricing-feature-check-v1{flex:none;color:${accent};font-weight:800;}
#${ownerId} .bhx-pricing-button-wrap-v1{margin-top:auto;padding-top:4px;}
#${ownerId} .bhx-pricing-button-wrap-v1 .bhx-v1-button-pro{--bhx-btn-font:${n(data.pricingButtonSizeDesktopV1,16,1,160)}px;--bhx-btn-font-m:${n(data.pricingButtonSizeMobileV1,16,1,160)}px;font-family:${family(data.pricingButtonFontFamilyV1)};font-weight:${weight(data.pricingButtonFontWeightV1)};}
@media(max-width:900px){#${ownerId} .bhx-pricing-cards-v1{justify-content:${justify(data.pricingLastRowAlignTabletV1)};}#${ownerId} .bhx-pricing-card-v1{flex-basis:${tabletBasis};max-width:${tabletColumns?tabletBasis:'420px'};}}
@media(max-width:767px){#${ownerId} .bhx-pricing-header-v1{max-width:100%;margin-bottom:26px;}#${ownerId} .bhx-pricing-name-v1{font-size:${n(data.pricingPlanSizeMobileV1,24,1,160)}px;}#${ownerId} .bhx-pricing-price-v1{font-size:${n(data.pricingPriceSizeMobileV1,48,1,160)}px;}#${ownerId} .bhx-pricing-suffix-v1{font-size:${n(data.pricingSuffixSizeMobileV1,14,1,160)}px;}#${ownerId} .bhx-pricing-features-v1{font-size:${n(data.pricingFeaturesSizeMobileV1,15,1,160)}px;}#${ownerId} .bhx-pricing-card-v1.is-featured{transform:none;}#${ownerId} .bhx-pricing-cards-v1{justify-content:${layoutMobile==='scroll'?'flex-start':justify(data.pricingLastRowAlignMobileV1)};gap:20px;${layoutMobile==='scroll'?'flex-wrap:nowrap;overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-inline:contain;padding:4px 2px 14px;':'flex-wrap:wrap;'}}#${ownerId} .bhx-pricing-card-v1{flex:${layoutMobile==='scroll'?'0 0':'1 1'} ${mobileBasis};max-width:${layoutMobile==='scroll'?mobileBasis:(mobileColumns?mobileBasis:'100%')};${layoutMobile==='scroll'?'scroll-snap-align:start;':''}}}
@media(prefers-reduced-motion:reduce){#${ownerId} .bhx-pricing-cycle-pill-v1,#${ownerId} .bhx-pricing-card-v1{transition:none!important;scroll-behavior:auto!important;}}`
}
