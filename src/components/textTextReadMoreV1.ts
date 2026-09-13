export type TextTextReadMoreSegment={kind:'text'|'break';text?:string;bold?:boolean}

/**
 * Convert the verified legacy WordPress Text + Text Read More HTML subset into
 * inert render segments. Only <b>/<strong>/<br> are interpreted. Script/style
 * blocks and every other tag are discarded before React renders text nodes.
 */
export function textTextReadMoreSegments(value:string):TextTextReadMoreSegment[]{
  const sanitized=String(value||'')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'')
    .replace(/<br\s*\/?>/gi,'\uE000')
    .replace(/<(?:b|strong)\s*>/gi,'\uE001')
    .replace(/<\/(?:b|strong)\s*>/gi,'\uE002')
    .replace(/<[^>]*>/g,'')
  const chunks=sanitized.split(/([\uE000-\uE002])/).filter(Boolean)
  const out:TextTextReadMoreSegment[]=[]
  let bold=false
  for(const chunk of chunks){
    if(chunk==='\uE000'){out.push({kind:'break'});continue}
    if(chunk==='\uE001'){bold=true;continue}
    if(chunk==='\uE002'){bold=false;continue}
    out.push({kind:'text',text:chunk,bold})
  }
  return out
}
