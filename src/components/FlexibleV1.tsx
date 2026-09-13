import RowsColumns from './RowsColumns'
import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'

export default function FlexibleV1({data,ownerId}:{data:any;ownerId:string}){
  const rows=Array.isArray(data?.rows)?data.rows.filter(Boolean).slice(0,40):[]
  return <div className="bhx-flexible-section-v1" data-bhx-flexible-v1="true">
    <SectionHeaderV1 data={data}/>
    {rows.length?<RowsColumns rows={rows} ownerId={ownerId}/>:null}
    <SectionActions data={data}/>
  </div>
}
