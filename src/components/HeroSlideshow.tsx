'use client'
import Image from 'next/image'
import {useEffect,useState} from 'react'
export default function HeroSlideshow({images,alt}:{images:string[];alt:string}){const[index,setIndex]=useState(0);useEffect(()=>{if(images.length<2)return;const id=setInterval(()=>setIndex(v=>(v+1)%images.length),5000);return()=>clearInterval(id)},[images.length]);return <div className="hero-slideshow">{images.map((src,i)=><Image key={src} className={`hero-media hero-slide ${i===index?'active':''}`} src={src} alt={alt} width={1400} height={900} priority={i===0}/>) }<div className="slide-dots">{images.map((_,i)=><button aria-label={`Show slide ${i+1}`} key={i} className={i===index?'active':''} onClick={()=>setIndex(i)}/>)}</div></div>}
