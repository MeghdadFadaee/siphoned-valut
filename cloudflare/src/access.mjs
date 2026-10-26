let cache;
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')),c=>c.charCodeAt(0));
export async function administrator(request,env){
 if(!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD)return false;
 const team=env.ACCESS_TEAM_DOMAIN.replace(/^https:\/\//,'').replace(/\/$/,'');
 if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team))return false;
 const token=request.headers.get('Cf-Access-Jwt-Assertion')||request.headers.get('cookie')?.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
 if(!token)return false;
 try{const [h,p,s,...extra]=token.split('.');if(extra.length||!s)return false;const head=JSON.parse(new TextDecoder().decode(decode(h)));const claims=JSON.parse(new TextDecoder().decode(decode(p)));const now=Math.floor(Date.now()/1000);
 if(head.alg!=='RS256'||typeof head.kid!=='string'||claims.iss!==`https://${team}`||!Array.isArray(claims.aud)||!claims.aud.includes(env.ACCESS_AUD)||!Number.isFinite(claims.exp)||claims.exp<=now||claims.nbf>now||String(claims.email).toLowerCase()!=='meghdad.social@gmail.com')return false;
 if(!cache||cache.team!==team||cache.expires<Date.now()){const response=await fetch(`https://${team}/cdn-cgi/access/certs`);if(!response.ok)return false;cache={team,expires:Date.now()+300000,keys:(await response.json()).keys};}
 const jwk=cache.keys.find(k=>k.kid===head.kid);if(!jwk)return false;const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(s),new TextEncoder().encode(h+'.'+p));
 }catch{return false;}
}
