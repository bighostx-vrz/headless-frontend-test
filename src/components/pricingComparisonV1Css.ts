type AnyMap=Record<string,any>
const n=(value:any,fallback:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))
const c=(value:any,fallback:string)=>typeof value==='string'&&value?value:(typeof value?.hex==='string'&&value.hex?value.hex:fallback)
const mode=(value:any,allowed:string[],fallback:string)=>allowed.includes(String(value||''))?String(value):fallback
const family=(value:any)=>({
  'System UI':'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif','Arial / Helvetica':'Arial,Helvetica,sans-serif',Georgia:'Georgia,serif','Times New Roman':'"Times New Roman",Times,serif','Courier New':'"Courier New",Courier,monospace','Trebuchet MS':'"Trebuchet MS",Arial,sans-serif',Verdana:'Verdana,Geneva,sans-serif',inherit:'inherit',
} as Record<string,string>)[String(value||'inherit')]||'inherit'
const weight=(value:any)=>/^(300|400|500|600|700|800|900)$/.test(String(value||''))?String(value):'inherit'

export function pricingComparisonV1Css(ownerId:string,data:AnyMap,planCount:number){
  const style=mode(data.pricingComparisonStyleV1,['clean','bordered','striped'],'clean')
  const border=c(data.pricingComparisonBorderColorV1,'#e5e7eb')
  const pad=n(data.pricingComparisonCellPaddingDesktopV1,18,6,48)
  const mobilePad=n(data.pricingComparisonCellPaddingMobileV1,14,6,40)
  const radius=n(data.pricingComparisonRadiusV1,12,0,80)
  const minWidth=Math.max(680,220+Math.max(1,planCount)*190)
  const borderRules=style==='bordered'?`#${ownerId} .bhx-pricing-comparison-table-v1 th,#${ownerId} .bhx-pricing-comparison-table-v1 td{border:1px solid ${border};}`:`#${ownerId} .bhx-pricing-comparison-table-v1 tbody tr{border-top:1px solid ${border};}`
  const stripe=style==='striped'?`#${ownerId} .bhx-pricing-comparison-table-v1 tbody tr:nth-child(even){background:rgba(128,128,128,.055);}`:''
  return `#${ownerId} .bhx-pricing-comparison-v1{--bhx-comp-border:${border};--bhx-comp-header:${c(data.pricingComparisonHeaderBackgroundV1,'#f8fafc')};--bhx-comp-feature:${c(data.pricingComparisonFeatureBackgroundV1,'#ffffff')};--bhx-comp-highlight:${c(data.pricingComparisonHighlightColorV1,'#eef2ff')};--bhx-comp-toggle-bg:${c(data.pricingComparisonToggleBackgroundV1,'#f3f4f6')};--bhx-comp-toggle-text:${c(data.pricingComparisonToggleTextColorV1,'#6b7280')};--bhx-comp-toggle-active-bg:${c(data.pricingComparisonToggleActiveBackgroundV1,'#4f46e5')};--bhx-comp-toggle-active-text:${c(data.pricingComparisonToggleActiveTextColorV1,'#ffffff')};}
#${ownerId} .bhx-comp-header-v1{max-width:820px;margin:0 auto 30px;text-align:center;}
#${ownerId} .bhx-comp-header-v1 .eyebrow{display:block;margin-bottom:8px;font-size:.875rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
#${ownerId} .bhx-comp-header-v1 h2{margin:0 0 12px;}#${ownerId} .bhx-comp-header-v1 .lead{margin:0;}
#${ownerId} .bhx-comp-cycle-scroll-v1{max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain;padding:2px 2px 10px;margin:0 auto 20px;scrollbar-width:thin;}
#${ownerId} .bhx-comp-cycle-toggle-v1{position:relative;display:flex;width:max-content;gap:4px;padding:5px;border-radius:999px;background:var(--bhx-comp-toggle-bg);isolation:isolate;}
#${ownerId} .bhx-comp-cycle-toggle-v1 button{position:relative;z-index:1;border:0;background:transparent;color:var(--bhx-comp-toggle-text);border-radius:999px;padding:9px 15px;font:inherit;font-weight:650;white-space:nowrap;cursor:pointer;transition:color .2s ease;}
#${ownerId} .bhx-comp-cycle-toggle-v1 button[aria-selected=true]{color:var(--bhx-comp-toggle-active-text);}#${ownerId} .bhx-comp-cycle-toggle-v1 button:focus-visible{outline:2px solid var(--bhx-comp-toggle-active-bg);outline-offset:3px;}
#${ownerId} .bhx-comp-cycle-pill-v1{position:absolute;z-index:0;top:5px;bottom:5px;border-radius:999px;background:var(--bhx-comp-toggle-active-bg);transition:left .24s ease,width .24s ease,opacity .15s ease;pointer-events:none;}
#${ownerId} .bhx-comp-sr-only-v1{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;}
#${ownerId} .bhx-pricing-comparison-scroll-v1{max-width:100%;border-radius:${radius}px;overflow-x:${data.pricingComparisonMobileScrollV1===false?'hidden':'auto'};overscroll-behavior-inline:contain;box-shadow:0 10px 30px rgba(15,23,42,.055);scrollbar-width:thin;}
#${ownerId} .bhx-pricing-comparison-scroll-v1:focus-visible{outline:2px solid var(--bhx-comp-toggle-active-bg);outline-offset:4px;}
#${ownerId} .bhx-pricing-comparison-table-v1{width:100%;min-width:${data.pricingComparisonMobileScrollV1===false?'0':`${minWidth}px`};border-collapse:separate;border-spacing:0;background:transparent;table-layout:${data.pricingComparisonMobileScrollV1===false?'fixed':'auto'};}
#${ownerId} .bhx-pricing-comparison-table-v1 th,#${ownerId} .bhx-pricing-comparison-table-v1 td{box-sizing:border-box;padding:${pad}px;vertical-align:middle;text-align:center;overflow-wrap:anywhere;}
#${ownerId} .bhx-pricing-comparison-table-v1 thead th{background:var(--bhx-comp-header);}
#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-feature-head-v1,#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-feature-cell-v1{position:sticky;left:0;z-index:2;text-align:left;background:var(--bhx-comp-feature);min-width:210px;max-width:320px;font-family:${family(data.pricingComparisonFeatureFontFamilyV1)};font-weight:${weight(data.pricingComparisonFeatureFontWeightV1)};font-size:${n(data.pricingComparisonFeatureSizeDesktopV1,15,10,56)}px;}
#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-feature-head-v1{z-index:4;background:var(--bhx-comp-header);}
#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-plan-head-v1{min-width:180px;font-family:${family(data.pricingComparisonPlanFontFamilyV1)};font-weight:${weight(data.pricingComparisonPlanFontWeightV1)};font-size:${n(data.pricingComparisonPlanSizeDesktopV1,18,10,72)}px;}
#${ownerId} .bhx-pricing-comparison-table-v1 .is-highlighted{background:var(--bhx-comp-highlight);}
#${ownerId} .bhx-pricing-comparison-table-v1.has-sticky-head thead th,#${ownerId} .has-sticky-head .bhx-pricing-comparison-table-v1 thead th{position:sticky;top:0;z-index:3;}#${ownerId} .has-sticky-head .bhx-pricing-comparison-table-v1 .bhx-comp-feature-head-v1{z-index:5;}
#${ownerId} .bhx-comp-plan-name-v1{display:block;}#${ownerId} .bhx-comp-price-row-v1{display:flex;justify-content:center;align-items:baseline;gap:5px;margin-top:8px;}#${ownerId} .bhx-comp-price-v1{font-size:1.25em;}#${ownerId} .bhx-comp-period-v1{font-size:.72em;font-weight:500;opacity:.68;}
#${ownerId} .bhx-comp-button-v1{display:block;margin-top:12px;}#${ownerId} .bhx-comp-button-v1 .bhx-v1-button-pro{--bhx-btn-font:${n(data.pricingComparisonButtonSizeDesktopV1,15,10,48)}px;--bhx-btn-font-m:${n(data.pricingComparisonButtonSizeMobileV1,14,10,44)}px;font-family:${family(data.pricingComparisonButtonFontFamilyV1)};font-weight:${weight(data.pricingComparisonButtonFontWeightV1)};}
#${ownerId} .bhx-comp-feature-v1{display:block;}#${ownerId} .bhx-comp-description-v1{display:block;margin-top:4px;font-weight:400;opacity:.68;line-height:1.35;}#${ownerId} .bhx-comp-state-v1{display:inline-flex;align-items:center;justify-content:center;min-width:1.5em;font-size:1.15em;font-weight:800;}#${ownerId} .bhx-comp-state-v1.is-included{color:#15803d;}#${ownerId} .bhx-comp-state-v1.is-unavailable{opacity:.48;}
${borderRules}${stripe}
@media(max-width:767px){#${ownerId} .bhx-pricing-comparison-table-v1 th,#${ownerId} .bhx-pricing-comparison-table-v1 td{padding:${mobilePad}px;}#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-plan-head-v1{min-width:${data.pricingComparisonMobileScrollV1===false?'0':'150px'};font-size:${n(data.pricingComparisonPlanSizeMobileV1,16,10,56)}px;}#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-feature-head-v1,#${ownerId} .bhx-pricing-comparison-table-v1 .bhx-comp-feature-cell-v1{min-width:${data.pricingComparisonMobileScrollV1===false?'0':'175px'};font-size:${n(data.pricingComparisonFeatureSizeMobileV1,14,10,48)}px;}#${ownerId} .bhx-comp-header-v1{margin-bottom:24px;}}
@media(prefers-reduced-motion:reduce){#${ownerId} .bhx-comp-cycle-pill-v1,#${ownerId} .bhx-comp-cycle-toggle-v1 button{transition:none!important;scroll-behavior:auto!important;}}`
}
