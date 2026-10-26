import {summarize} from '../../lib/ledger.mjs';
const number=(n:number)=>n.toLocaleString('fa-IR');
export async function updatePreview(rows:any[],revision:number){
 await document.fonts.load('400 24px Vazirmatn');await document.fonts.load('700 32px Vazirmatn');
 const c=document.createElement('canvas');c.width=1600;c.height=1200;const ctx=c.getContext('2d')!;
 const players=summarize(rows),low=players.filter(p=>p.balance<10).sort((a,b)=>a.balance-b.balance),balance=players.reduce((s,p)=>s+p.balance,0);
 const rect=(x:number,y:number,w:number,h:number,color:string,stroke?:string)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,14);ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}};
 const text=(s:string,x:number,y:number,size=22,color='#e8f2fa',bold=false,rtl=true)=>{ctx.font=`${bold?700:400} ${size}px Vazirmatn`;ctx.fillStyle=color;ctx.textAlign=rtl?'right':'left';ctx.direction=rtl?'rtl':'ltr';ctx.fillText(s,x,y);};
 rect(0,0,1600,1200,'#080f18');text('خزانه سایفوند انرژی',1540,91,34,'#e8f2fa',true);text('آخرین وضعیت خزانه',278,88,22,'#91bba8');text('سهم هر عضو، قدرت تمام گیلد',1540,164,45,'#e8f2fa',true);text(`${number(players.length)} عضو · ${number(rows.length)} تراکنش · ${number(players.length-low.length)} عضو آماده نبرد`,1540,200,22,'#94999f');
 const stats=[['نیازمند اقدام',low.length,'#e19b58',`${number(players.filter(p=>p.balance<0).length)} حساب بدهکار`],['کل برداشت',rows.reduce((s,r)=>s+Math.max(0,-r.amount),0),'#da9494','سایفوند انرژی مصرف شده'],['کل واریز',rows.reduce((s,r)=>s+Math.max(0,r.amount),0),'#91bba8','مجموع سهم اعضای گیلد'],['بالانس خزانه',balance,balance<0?'#e47878':'#56d3ff','سایفوند انرژی · خالص واریز و برداشت']];
 stats.forEach((s,i)=>{const x=48+i*381;rect(x,224,363,155,'#101c29','#253a4d');text(String(s[0]),x+339,258,21,'#94999f');text(number(Number(s[1])),x+339,315,48,String(s[2]),true);text(String(s[3]),x+339,355,16,'#94999f');});
 rect(48,402,740,435,'#28221c','#5a4431');rect(812,402,740,435,'#102b3e','#275772');text('حساب‌های نیازمند اقدام',761,451,27,'#e19b58',true);text('حداقل مطلوب: ۱۰',210,445,18,'#94999f');text('لیدربورد · بالاترین بالانس‌ها',1525,451,27,'#56d3ff',true);
 text('واریز لازم',165,488,17,'#ad9580');text('بالانس',300,488,17,'#ad9580');text('بازیکن',761,488,17,'#ad9580');text('بالانس',953,488,17,'#94bcd4');text('بازیکن',1460,488,17,'#94bcd4');text('رتبه',1525,488,17,'#94bcd4');
 low.slice(0,8).forEach((p,i)=>{const y=526+i*35;text(number(10-p.balance),76,y,22,'#e0bb85',false,false);text(number(p.balance),207,y,22,p.balance<0?'#e47878':'#e19b58',false,false);text(p.name.slice(0,21),761,y,22);});
 players.slice(0,8).forEach((p,i)=>{const y=526+i*35;text(number(p.balance),840,y,22,p.balance<0?'#e47878':'#56d3ff',true,false);text(p.name.slice(0,21),1460,y,22);text(number(i+1),1525,y,22,'#56d3ff');});
 text(low.length>8?`${number(low.length-8)} حساب دیگر · برای جزئیات وارد سایت شو`:'برای رسیدن به حداقل، مبلغ واریز لازم را جبران کن',761,811,16,'#ad9580');text('رتبه‌بندی بر اساس خالص واریز و برداشت است',1525,811,16,'#94bcd4');
 rect(48,861,1504,232,'#101c29','#294358');text('آخرین تراکنش‌ها',1525,905,25,'#e8f2fa',true);rows.slice(0,4).forEach((r,i)=>{const y=949+i*35;text((r.amount>0?'+':'')+number(r.amount),76,y,21,r.amount>0?'#91bba8':'#e47878',false,false);text(r.amount>0?'واریز':'برداشت',530,y,21,r.amount>0?'#91bba8':'#e47878');text(r.player.slice(0,27),895,y,21);text(r.date.replace(/[0-9]/g,(d:string)=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]),1525,y,18,'#94999f');});
 text('بالانس بر اساس لاگ‌های واردشده است · آلبیون آنلاین',48,1140,17,'#94999f',false,false);text('آخرین تراکنش: '+rows[0]?.date,1540,1140,17,'#94999f');
 const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('تولید تصویر ممکن نشد.')),'image/png'));
 const response=await fetch('/api/preview',{method:'POST',headers:{'Content-Type':'image/png','X-Ledger-Revision':String(revision)},body:blob});if(!response.ok)throw Error('تصویر ذخیره نشد. برای تازه‌سازی آن دوباره ثبت کن.');
}
