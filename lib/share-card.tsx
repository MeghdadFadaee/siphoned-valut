import { ledgerSnapshot } from './share';
type Snapshot = Awaited<ReturnType<typeof ledgerSnapshot>>;
const gold='#d1ab6c',muted='#94999f',border='#353332';
const n=(v:number)=>v.toLocaleString('en-US');
export function ShareCard({data}:{data:Snapshot}) {
 const top=data.players.slice(0,3);
 const low=[...data.low].sort((a,b)=>a.balance-b.balance);
 return <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',backgroundColor:'#101214',padding:40,fontFamily:'sans-serif',color:'#e9e8e5'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',height:46}}>
   <div style={{display:'flex',alignItems:'center',gap:16}}><div style={{display:'flex',width:40,height:44,border:'2px solid #d1ab6c',borderRadius:10,alignItems:'center',justifyContent:'center',color:gold,fontSize:27,fontWeight:700}}>S</div><div style={{display:'flex',fontSize:25,fontWeight:700,letterSpacing:4}}>SIPHONED</div></div>
   <div style={{display:'flex',alignItems:'center',gap:10,color:'#91bba8',fontSize:14,padding:'8px 14px',border:'1px solid #344b3c',borderRadius:20,backgroundColor:'#1c2521'}}><div style={{display:'flex',width:7,height:7,borderRadius:10,backgroundColor:'#91bba8'}}/>GUILD VAULT / LIVE STATUS</div>
  </div>
  <div style={{display:'flex',marginTop:26,fontSize:41,fontWeight:700}}>The guild’s strength. At a glance.</div>
  <div style={{display:'flex',gap:16,marginTop:24}}>
   {[{label:'VAULT BALANCE',value:data.balance,color:gold,sub:'Siphoned energy'},{label:'TOTAL DEPOSITS',value:data.deposits,color:'#91bba8',sub:`${n(data.withdrawals)} withdrawn`},{label:'NEED A REFILL',value:data.low.length,color:'#e19b58',sub:`of ${data.players.length} members · target 10`}].map(stat=><div key={stat.label} style={{display:'flex',flexDirection:'column',flex:1,padding:'18px 24px',height:151,backgroundColor:'#191b1e',border:`1px solid ${border}`,borderRadius:12}}><div style={{display:'flex',fontSize:12,letterSpacing:2,color:muted}}>{stat.label}</div><div style={{display:'flex',fontSize:48,fontWeight:700,color:stat.color,marginTop:6}}>{n(stat.value)}</div><div style={{display:'flex',fontSize:14,color:muted,marginTop:1}}>{stat.sub}</div></div>)}
  </div>
  <div style={{display:'flex',gap:22,marginTop:22,height:164}}>
   <div style={{display:'flex',flex:1.2,flexDirection:'column',border:'1px solid #4a3e2c',borderRadius:12,backgroundColor:'#211e19',padding:'15px 22px'}}>
    <div style={{display:'flex',fontSize:12,letterSpacing:2,color:gold,marginBottom:9}}>TOP BALANCES</div>
    {top.map((p,i)=><div key={p.name} style={{display:'flex',alignItems:'center',height:34,justifyContent:'space-between',fontSize:19}}><div style={{display:'flex',gap:15,alignItems:'center'}}><div style={{display:'flex',fontSize:14,color:gold,width:17}}>{i+1}.</div><div style={{display:'flex'}}>{p.name.length>22?p.name.slice(0,21)+'…':p.name}</div></div><div style={{display:'flex',color:gold,fontWeight:700}}>{n(p.balance)}</div></div>)}
   </div>
   <div style={{display:'flex',flex:1,flexDirection:'column',border:'1px solid #5a4431',borderRadius:12,backgroundColor:'#28221c',padding:'15px 22px'}}>
    <div style={{display:'flex',fontSize:12,letterSpacing:2,color:'#e19b58',marginBottom:10}}>TIME TO CONTRIBUTE</div>
    <div style={{display:'flex',fontSize:19,lineHeight:1.4,color:'#dcc9b4'}}>{low.length?low.slice(0,3).map(p=>p.name.length>18?p.name.slice(0,17)+'…':p.name).join(' · '):'Every member is battle-ready.'}</div>
    <div style={{display:'flex',marginTop:12,fontSize:13,color:'#a88e73'}}>{low.length?`${low.length>3?`+ ${low.length-3} more members. `:''}Keep at least 10 Siphoned in the vault.`:'Full vault. Strong guild.'}</div>
   </div>
  </div>
  <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #2b2d30',marginTop:22,paddingTop:15,color:muted,fontSize:12}}><div style={{display:'flex'}}>LATEST TRANSACTION: {data.latest}</div><div style={{display:'flex'}}>{n(data.count)} TRANSACTIONS · ALBION ONLINE</div></div>
 </div>;
}
