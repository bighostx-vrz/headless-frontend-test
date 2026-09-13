import DynamicForm from './DynamicForm'
import {SectionHeaderV1} from './WebSectionStaticV1'
export default function FormsV1({data}:{data:any}){return <div className="bhx-forms-v1"><SectionHeaderV1 data={data}/>{data?.form?<DynamicForm form={data.form}/>:<p className="bhx-v1-empty">Select a form in this Web Section.</p>}</div>}
