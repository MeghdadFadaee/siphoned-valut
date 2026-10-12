// Apply the same Unix timestamp to both the shared page and its preview image.
export function shareTimestamp(value) {
 if(typeof value!=='string'||!/^\d{1,12}$/.test(value))return null;
 const number=Number(value);
 return Number.isSafeInteger(number)&&number>=0?String(number):null;
}
export function withShareTimestamp(url,seconds) {
 const timestamp=shareTimestamp(String(seconds));
 if(timestamp===null)throw new Error('زمان اشتراک معتبر نیست.');
 const result=new URL(url);
 result.searchParams.set('t',timestamp);
 return result.href;
}
