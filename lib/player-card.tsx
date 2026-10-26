/* Satori renders plain image elements in social cards. */
/* eslint-disable @next/next/no-img-element */
import {playerSnapshot} from './player.mjs';
import {fa, persianNumber as n, persianDigits} from './persian-text';
import {energyArtDataUri} from './energy-art.mjs';
export const playerCardWidth=1600, playerCardHeight=900;
type Profile=NonNullable<ReturnType<typeof playerSnapshot>>;
export function PlayerCard({data:p}:{data:Profile}) {
 const color=p.balance<0?'#e47878':p.topUp>0?'#e19b58':'#80b6a0';
 const short=(s:string,max=34)=>s.length>max?s.slice(0,max-1)+'…':s;
 return <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'42px 56px',backgroundColor:'#080f18',color:'#e8f2fa',fontFamily:'Vazirmatn'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',fontSize:23,color:'#90a3b5'}}>{fa(`رتبهٔ ${n(p.rank)} از ${n(p.members)} عضو`)}</div><div style={{display:'flex',alignItems:'center',gap:14,fontSize:27}}>{fa('کارنامهٔ بازیکن · خزانهٔ گیلد')}<img src={energyArtDataUri} width={54} height={54} alt=""/></div></div>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:14}}><div style={{display:'flex',border:'1px solid '+color,borderRadius:12,padding:'8px 20px',fontSize:24,color}}>{fa(p.status)}</div><div style={{display:'flex',fontSize:p.name.length>28?38:58,fontWeight:700}}>@{short(p.name)}</div></div>
  <div style={{display:'flex',gap:20,marginTop:25,height:183}}>
   <div style={{display:'flex',flexDirection:'column',flex:1,border:'1px solid #253a4d',backgroundColor:'#101c29',borderRadius:16,padding:'20px 28px',alignItems:'flex-end'}}><div style={{display:'flex',fontSize:23,color:'#90a3b5'}}>{fa('واریز لازم تا آمادگی')}</div><div style={{display:'flex',fontSize:60,fontWeight:700,color}}>{n(p.topUp)}</div><div style={{display:'flex',fontSize:20,color:'#90a3b5'}}>{fa(p.topUp>0?`برای رسیدن به حداقل ${n(10)} سایفوند انرژی`:'حساب برای نبرد بعدی آماده است')}</div></div>
   <div style={{display:'flex',flexDirection:'column',flex:1,border:'1px solid #275772',backgroundColor:'#102b3e',borderRadius:16,padding:'20px 28px',alignItems:'flex-end'}}><div style={{display:'flex',fontSize:23,color:'#90a3b5'}}>{fa('بالانس فعلی · سایفوند انرژی')}</div><div style={{display:'flex',fontSize:68,fontWeight:700,color:p.balance<0?'#e47878':'#56d3ff'}}>{n(p.balance)}</div><div style={{display:'flex',fontSize:20,color:'#90a3b5'}}>{fa('خالص واریز و برداشت در لاگ‌های ثبت‌شده')}</div></div>
  </div>
  <div style={{display:'flex',justifyContent:'space-between',margin:'18px 0',fontSize:23,color:'#90a3b5'}}><span>{fa(`${n(p.count)} تراکنش ثبت‌شده`)}</span><span>{fa(`کل برداشت: ${n(p.withdrawals)}`)}</span><span>{fa(`کل واریز: ${n(p.deposits)}`)}</span></div>
  <div style={{display:'flex',flexDirection:'column',padding:'18px 26px',border:'1px solid #294358',borderRadius:16,backgroundColor:'#101c29',flex:1}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><div style={{display:'flex',fontSize:18,color:'#90a3b5'}}>{fa('بالانس پس از تراکنش')}</div><div style={{display:'flex',fontSize:26,fontWeight:700}}>{fa('آخرین تراکنش‌های بازیکن')}</div></div>
   {p.history.slice(0,5).map((r,i)=><div key={i} style={{display:'flex',alignItems:'center',height:48,borderTop:'1px solid #253a4d',fontSize:23}}><div style={{display:'flex',width:200,color:r.balance<0?'#e47878':'#90a3b5'}}>{n(r.balance)}</div><div style={{display:'flex',width:220,color:r.amount>0?'#80b6a0':'#e47878'}}>{r.amount>0?'+':''}{n(r.amount)}</div><div style={{display:'flex',flex:1,color:r.amount>0?'#80b6a0':'#e47878'}}>{fa(r.amount>0?'واریز':'برداشت')}</div><div style={{display:'flex',fontSize:21,color:'#90a3b5'}}>{persianDigits(r.date)}</div></div>)}
  </div>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:18,fontSize:18,color:'#90a3b5'}}><span>{fa('بالانس بر اساس لاگ‌ها · تاریخچهٔ کامل در صفحهٔ بازیکن')}</span><span>{fa('آخرین تراکنش: ')} {persianDigits(p.last)}</span></div>
 </div>;
}
