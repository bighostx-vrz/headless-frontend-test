import Hero from './Hero'
import SectionBlock from './SectionBlock'
import CtaBlock from './CtaBlock'
import DynamicForm from './DynamicForm'
import LegacyInlineForm from './LegacyInlineForm'
import HtmlBlock from './HtmlBlock'
import ReusableSection from './ReusableSection'
import {frontendModules} from '@/modules/generated'
export default function PageBuilder({blocks}:{blocks:any[]|undefined}){if(!blocks?.length)return null;return blocks.map((block,index)=>{if(block.enabled===false)return null;const key=block._key||`${block._type}-${index}`;if(block._type==='sectionReference')return <ReusableSection key={key} data={block.sectionDoc}/>;if(block._type==='formBlock')return <DynamicForm key={key} form={block.formDoc}/>;if(block._type==='heroSection')return <Hero key={key} data={block}/>;if(block._type==='sectionBlock')return <SectionBlock key={key} data={block}/>;if(block._type==='ctaBlock')return <CtaBlock key={key} data={block}/>;if(block._type==='formComponent')return <LegacyInlineForm key={key} formData={block}/>;if(block._type==='htmlBlock')return <HtmlBlock key={key} data={block}/>;for(const module of frontendModules){if(module.blockTypes?.includes(block._type)&&module.renderBlock)return <span key={key}>{module.renderBlock(block)}</span>}return null})}
