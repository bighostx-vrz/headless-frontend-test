import QRCode from 'qrcode'
import {NextRequest} from 'next/server'
export async function GET(request:NextRequest){const raw=request.nextUrl.searchParams.get('url')||'/';const base=new URL(request.url).origin;const target=new URL(raw,base).toString();const svg=await QRCode.toString(target,{type:'svg',margin:2,width:360});return new Response(svg,{headers:{'content-type':'image/svg+xml','cache-control':'public, max-age=3600'}})}
