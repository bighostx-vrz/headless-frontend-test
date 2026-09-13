import {expandedWebSection} from '@/sanity/lib/queries'

export const connectedSectionByIdQuery=`*[_type=="bhxConnectedSection"&&_id==$id][0]{${expandedWebSection}}`
export const connectedSectionsQuery=`*[_type=="bhxConnectedSection"]|order(_updatedAt desc){${expandedWebSection}}`
