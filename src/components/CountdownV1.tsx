import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'
import CountdownRuntimeV1 from './CountdownRuntimeV1'
export default function CountdownV1({data}:{data:any}){return <><SectionHeaderV1 data={data}/><CountdownRuntimeV1 target={String(data?.countdownTarget||'')} data={data}/><SectionActions data={data}/></>}
