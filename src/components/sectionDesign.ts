import type {CSSProperties} from 'react'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'

export function designClass(design: any = {}) {
  const d = mergeDesign(design)
  return [
    `theme-${stegaClean(d.theme || 'global')}`, `width-${stegaClean(d.width || 'contained')}`,
    `gap-${stegaClean(d.gap || 'medium')}`, `spacing-${stegaClean(d.spacing || 'global')}`,
    `align-${stegaClean(d.textAlign || 'left')}`, d.hideDesktop ? 'hide-desktop' : '', d.hideTablet ? 'hide-tablet' : '', d.hideMobile ? 'hide-mobile' : '',
  ].filter(Boolean).join(' ')
}

export function mergeDesign(design: any = {}) {
  return {...(design.stylePreset?.design || {}), ...design, stylePreset: undefined}
}

export function designStyle(design: any = {}): CSSProperties {
  const d = mergeDesign(design)
  const style: Record<string, string | number | undefined> = {
    '--section-cols': d.desktopColumns || 3, '--section-cols-tablet': d.tabletColumns || 2, '--section-cols-mobile': d.mobileColumns || 1,
    '--section-radius': stegaClean(d.radius || '8px'), '--section-min-height': stegaClean(d.minHeight || 'auto'),
    '--section-heading-color': d.headingColor?.hex, '--section-text-color': d.textColor?.hex, '--section-accent': d.accentColor?.hex,
    '--section-heading-font-size': ({small:'1.8rem',medium:'2.4rem',large:'3.2rem',display:'4.6rem'} as any)[stegaClean(d.headingSize || 'global')] || undefined, '--section-body-font-size': ({small:'.95rem',medium:'1.05rem',large:'1.22rem'} as any)[stegaClean(d.bodySize || 'global')] || undefined,
    '--section-border-color': d.borderColor?.hex,
  }
  if (d.backgroundType === 'gradient' && d.gradientFrom?.hex && d.gradientTo?.hex) style.background = `linear-gradient(${Number(d.gradientAngle || 135)}deg, ${d.gradientFrom.hex}, ${d.gradientTo.hex})`
  else if (d.backgroundType === 'image' && d.backgroundImage?.asset) {
    const image = urlFor(d.backgroundImage).width(2200).url()
    style.backgroundImage = `linear-gradient(rgba(0,0,0,${Number(d.overlayOpacity || 0)}),rgba(0,0,0,${Number(d.overlayOpacity || 0)})),url("${image}")`
    style.backgroundSize = 'cover'; style.backgroundPosition = 'center'
  } else if (d.backgroundColor?.hex) style.background = d.backgroundColor.hex
  if (d.borderStyle && d.borderStyle !== 'none') style.border = `${d.borderStyle === 'thin' ? '1px' : '2px'} solid ${d.borderColor?.hex || 'var(--section-accent,var(--accent-color))'}`
  if (d.shadow === 'soft') style.boxShadow = '0 16px 50px rgba(0,0,0,.08)'
  if (d.shadow === 'strong') style.boxShadow = '0 24px 70px rgba(0,0,0,.18)'
  return style as CSSProperties
}
