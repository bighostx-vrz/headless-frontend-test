import WebSectionRenderer from './WebSectionRenderer'
export default function WebPageSections({sections}:{sections:any[]|undefined}){if(!sections?.length)return null;return <>{sections.map((row,index)=><WebSectionRenderer key={row?._key||row?.section?._id||index} row={row}/>)}</>}
