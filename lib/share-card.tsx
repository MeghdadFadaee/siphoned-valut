import { ledgerSnapshot } from './share';
import { fa, persianNumber as n, persianDigits } from './persian-text';
type Snapshot = Awaited<ReturnType<typeof ledgerSnapshot>>;
export const cardWidth=1600,cardHeight=1200,cardEdition='fa-v3';
const gold='#d1ab6c',muted='#94999f';
const panel={display:'flex',flexDirection:'column' as const,flex:1,padding:'22px 26px',borderRadius:14};
const short=(value:string,max=21)=>value.length>max?value.slice(0,max-1)+'…':value;
export function ShareCard({data}:{data:Snapshot}) {
 const top=data.players.slice(0,8), low=[...data.low].sort((a,b)=>a.balance-b.balance).slice(0,8);
 const ready=data.players.length-data.low.length;
 return <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',backgroundColor:'#101214',padding:48,fontFamily:'Vazirmatn',color:'#e9e8e5'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',height:56}}>
   <div style={{display:'flex',alignItems:'center',gap:11,color:'#91bba8',fontSize:22,padding:'8px 18px',border:'1px solid #344b3c',borderRadius:25,backgroundColor:'#1c2521'}}>{fa('آخرین وضعیت خزانه')}<div style={{display:'flex',width:9,height:9,borderRadius:10,backgroundColor:'#91bba8'}}/></div>
   <div style={{display:'flex',alignItems:'center',gap:18,fontSize:33,fontWeight:700}}>{fa('خزانه سایفوند انرژی')}<div style={{display:'flex',width:52,height:54,border:'2px solid #d1ab6c',borderRadius:12,alignItems:'center',justifyContent:'center',color:gold,fontSize:31}}>{fa('س')}</div></div>
  </div>
  <div style={{display:'flex',justifyContent:'flex-end',marginTop:18,fontSize:45,fontWeight:700}}>{fa('سهم هر عضو، قدرت تمام گیلد')}</div>
  <div style={{display:'flex',justifyContent:'flex-end',marginTop:3,fontSize:22,color:muted}}>{fa(`${n(data.players.length)} عضو · ${n(data.count)} تراکنش · ${n(ready)} عضو آماده نبرد`)}</div>
  <div style={{display:'flex',gap:18,marginTop:23,height:155}}>
   {[{label:'نیازمند اقدام',value:data.low.length,color:'#e19b58',sub:`${n(data.players.filter(p=>p.balance<0).length)} حساب بدهکار`},{label:'کل برداشت',value:data.withdrawals,color:'#da9494',sub:'سایفوند انرژی مصرف شده'},{label:'کل واریز',value:data.deposits,color:'#91bba8',sub:'مجموع سهم اعضای گیلد'},{label:'بالانس خزانه',value:data.balance,color:data.balance<0?'#e47878':gold,sub:'سایفوند انرژی · خالص واریز و برداشت'}].map(stat=><div key={stat.label} style={{display:'flex',flexDirection:'column',alignItems:'flex-end',flex:1,padding:'13px 23px',backgroundColor:'#191b1e',border:'1px solid #353332',borderRadius:13}}><div style={{display:'flex',fontSize:21,color:muted}}>{fa(stat.label)}</div><div style={{display:'flex',fontSize:48,fontWeight:700,color:stat.color,height:67,alignItems:'center'}}>{n(stat.value)}</div><div style={{display:'flex',fontSize:16,color:muted}}>{fa(stat.sub)}</div></div>)}
  </div>
  <div style={{display:'flex',gap:24,marginTop:24,height:435}}>
   <div style={{...panel,border:'1px solid #5a4431',backgroundColor:'#28221c'}}>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:27,fontWeight:700,color:'#e19b58',marginBottom:5}}><div style={{display:'flex',fontSize:18,fontWeight:400,color:muted}}>{fa('حداقل مطلوب: ۱۰')}</div>{fa('حساب‌های نیازمند اقدام')}</div>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:17,color:'#ad9580',borderBottom:'1px solid #504031',paddingBottom:8}}><div style={{display:'flex',width:130}}>{fa('واریز لازم')}</div><div style={{display:'flex',width:110}}>{fa('بالانس')}</div><div style={{display:'flex',flex:1,justifyContent:'flex-end'}}>{fa('بازیکن')}</div></div>
    {low.map(p=><div key={p.name} style={{display:'flex',alignItems:'center',height:35,justifyContent:'space-between',fontSize:22}}><div style={{display:'flex',width:130,color:'#e0bb85'}}>{n(10-p.balance)}</div><div style={{display:'flex',width:110,color:p.balance<0?'#e47878':'#e19b58'}}>{n(p.balance)}</div><div style={{display:'flex',flex:1,justifyContent:'flex-end'}}>{short(p.name)}</div></div>)}
    {!low.length&&<div style={{display:'flex',justifyContent:'flex-end',marginTop:20,color:'#91bba8',fontSize:23}}>{fa('همه اعضا برای نبرد آماده‌اند')}</div>}
    <div style={{display:'flex',justifyContent:'flex-end',marginTop:'auto',paddingTop:8,fontSize:16,color:'#ad9580'}}>{fa(data.low.length>8?`${n(data.low.length-8)} حساب دیگر · برای جزئیات وارد سایت شو`:'برای رسیدن به حداقل، مبلغ واریز لازم را جبران کن')}</div>
   </div>
   <div style={{...panel,border:'1px solid #4a3e2c',backgroundColor:'#211e19'}}>
    <div style={{display:'flex',justifyContent:'flex-end',fontSize:27,fontWeight:700,color:gold,marginBottom:5}}>{fa('لیدربورد · بالاترین بالانس‌ها')}</div>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:17,color:'#a6977c',borderBottom:'1px solid #443b2c',paddingBottom:8}}><div style={{display:'flex',width:160}}>{fa('بالانس')}</div><div style={{display:'flex',flex:1,justifyContent:'flex-end'}}>{fa('بازیکن')}</div><div style={{display:'flex',width:60,justifyContent:'flex-end'}}>{fa('رتبه')}</div></div>
    {top.map((p,i)=><div key={p.name} style={{display:'flex',alignItems:'center',height:35,fontSize:22}}><div style={{display:'flex',width:160,color:p.balance<0?'#e47878':gold,fontWeight:700}}>{n(p.balance)}</div><div style={{display:'flex',flex:1,justifyContent:'flex-end'}}>{short(p.name)}</div><div style={{display:'flex',width:60,justifyContent:'flex-end',color:i<3?gold:muted}}>{n(i+1)}</div></div>)}
    <div style={{display:'flex',justifyContent:'flex-end',marginTop:'auto',paddingTop:8,fontSize:16,color:'#a6977c'}}>{fa('رتبه‌بندی بر اساس خالص واریز و برداشت است')}</div>
   </div>
  </div>
  <div style={{display:'flex',flexDirection:'column',marginTop:24,border:'1px solid #30343b',borderRadius:14,padding:'17px 26px',backgroundColor:'#191b1e',height:232}}>
   <div style={{display:'flex',justifyContent:'flex-end',fontSize:25,fontWeight:700,marginBottom:8}}>{fa('آخرین تراکنش‌ها')}</div>
   {data.recent.map((r,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',height:35,fontSize:21}}><div style={{display:'flex',width:150,color:r.amount>0?'#91bba8':'#e47878'}}>{r.amount>0?'+':''}{n(r.amount)}</div><div style={{display:'flex',width:110,color:r.amount>0?'#91bba8':'#e47878'}}>{fa(r.reason==='Deposit'?'واریز':'برداشت')}</div><div style={{display:'flex',width:330}}>{short(r.player,27)}</div><div style={{display:'flex',color:muted,fontSize:18}}>{persianDigits(r.date.replace(/-/g,'/'))}</div></div>)}
  </div>
  <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #2b2d30',marginTop:20,paddingTop:12,color:muted,fontSize:17}}><div style={{display:'flex'}}>{fa('بالانس بر اساس لاگ‌های واردشده است · آلبیون آنلاین')}</div><div style={{display:'flex',gap:10}}>{persianDigits(data.latest.replace(/-/g,'/'))}<span>{fa('آخرین تراکنش:')}</span></div></div>
 </div>;
}
