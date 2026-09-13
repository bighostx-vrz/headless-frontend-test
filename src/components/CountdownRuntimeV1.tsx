'use client'
import {useEffect,useMemo,useState} from 'react'

type Unit=[string,number,boolean]
export default function CountdownRuntimeV1({target,data}:{target:string;data:any}){
 const end=useMemo(()=>Date.parse(target),[target]), [now,setNow]=useState(()=>Date.now())
 useEffect(()=>{if(!Number.isFinite(end))return;const tick=()=>setNow(Date.now());tick();const wait=1000-(Date.now()%1000);let interval:number|undefined;const timeout=window.setTimeout(()=>{tick();interval=window.setInterval(tick,1000)},wait);return()=>{window.clearTimeout(timeout);if(interval)window.clearInterval(interval)}},[end])
 if(!target||!Number.isFinite(end))return <p className="bhx-countdown-expired">Countdown target not configured.</p>
 const diff=Math.max(0,end-now);if(diff<=0)return <p className="bhx-countdown-expired">{data?.countdownExpiredTextV1||'Time is up.'}</p>
 const sec=Math.floor(diff/1000), units:Unit[]=[['Days',Math.floor(sec/86400),data?.countdownShowDaysV1!==false],['Hours',Math.floor((sec%86400)/3600),data?.countdownShowHoursV1!==false],['Minutes',Math.floor((sec%3600)/60),data?.countdownShowMinutesV1!==false],['Seconds',sec%60,data?.countdownShowSecondsV1!==false]]
 return <div className="bhx-countdown" role="timer" aria-live="off" aria-label="Countdown timer">{units.filter(x=>x[2]).map(([label,value])=><div key={label}><strong>{String(value).padStart(2,'0')}</strong><span>{label}</span></div>)}</div>
}
