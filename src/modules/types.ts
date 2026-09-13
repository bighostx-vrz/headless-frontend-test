import type {ReactNode} from 'react'
export type BhxFrontendModule={
  id:string; title:string; version:string;
  webSectionTypes?:string[];
  renderWebSection?:(section:any,context?:{instanceKey?:string})=>ReactNode;
  // v6.0 compatibility for older add-ons. New modules should use webSectionTypes/renderWebSection.
  blockTypes?:string[];
  renderBlock?:(block:any)=>ReactNode;
  resolveInternalLink?:(doc:any)=>string|undefined;
  getSitemapEntries?:()=>Promise<Array<{loc:string;lastmod?:string}>>;
  search?:(query:string)=>Promise<any[]>;
}
