import metadata from './metadata.json';
import {playerFromPath, playerPath} from '../../lib/player.mjs';
const origin='https://siphoned.oneup.megh.dad';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const worker={async fetch(request,env){
 const url=new URL(request.url),name=playerFromPath(url.pathname);
 if(url.pathname!=='/'&&!name&&!url.pathname.startsWith('/@'))return env.ASSETS.fetch(request);
 const n=v=>Number(v).toLocaleString('fa-IR'),m=metadata;
 const profile=name?m.profiles.find(p=>p.name.toLowerCase()===name.toLowerCase()):null;
 if(url.pathname!=='/'&&!profile)return new Response('<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><meta name="robots" content="noindex"><title>بازیکن پیدا نشد</title><h1>بازیکن پیدا نشد</h1><p>هنوز تراکنشی برای این نام ثبت نشده است.</p><a href="/">بازگشت به خزانه</a></html>',{status:404,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
 const title=profile?`${profile.name} | ${profile.status} · خزانه سایفوند انرژی`:`سایفوند انرژی | ${n(m.balance)} در خزانه`;
 const description=profile?`بالانس ${n(profile.balance)} سایفوند انرژی · رتبه ${n(profile.rank)} از ${n(profile.members)} · ${n(profile.count)} تراکنش · واریز لازم تا آمادگی: ${n(profile.topUp)}`:`${n(m.members)} عضو، ${n(m.count)} تراکنش، ${n(m.low)} حساب نیازمند شارژ. آخرین تراکنش: ${m.latest.replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)])}`;
 const stamp=/^\d{1,12}$/.test(url.searchParams.get('t')||'')?url.searchParams.get('t'):null;
 const canonical=origin+(profile?playerPath(profile.name):'/');
 const page=canonical+(stamp?'?t='+stamp:'');
 const image=origin+(profile?profile.imagePath:'/share-image.png')+'?v=player-v1-'+m.revision+(stamp?'&t='+stamp:'');
 const alt=profile?`وضعیت و آخرین تراکنش‌های ${profile.name}`:'وضعیت خزانه و اعضای گیلد';
 const template=await env.ASSETS.fetch(new Request(new URL('/shell.html',request.url)));
 const html=(await template.text()).replace('__SOCIAL_META__',`<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="website"><meta property="og:locale" content="fa_IR"><meta property="og:site_name" content="خزانه سایفوند انرژی"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(page)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:alt" content="${esc(alt)}"><meta property="og:image:width" content="1600"><meta property="og:image:height" content="${profile?900:1200}"><meta property="og:image:type" content="image/png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image)}"><meta name="twitter:image:alt" content="${esc(alt)}">`);
 return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
}};

export default worker;
