import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import fs from 'node:fs/promises';
const result=await build({entryPoints:[new URL('./worker.mjs',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'browser'});
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const metadata=JSON.parse(await fs.readFile(new URL('./metadata.json',import.meta.url),'utf8'));
const env={ASSETS:{fetch:async r=>new Response(new URL(r.url).pathname==='/shell.html'?'<head>__SOCIAL_META__</head>':'asset')}};
test('player metadata has canonical URL, player image, status and matching share timestamp',async()=>{
 const p=metadata.profiles[0];
 const response=await worker.fetch(new Request('https://test.local/@'+p.name.toUpperCase()+'?t=12345'),env);
 assert.equal(response.status,200);const html=await response.text();
 assert.ok(html.includes(p.status));assert.ok(html.includes(p.imagePath));
 assert.ok(html.includes(`rel="canonical" href="https://siphoned.oneup.megh.dad${p.path}"`));
 assert.ok(html.includes(`${p.path}?t=12345`));assert.ok(html.includes('&amp;t=12345'));
 assert.ok(html.includes('content="900"'));assert.ok(html.includes('summary_large_image'));
 assert.equal(response.headers.get('Cache-Control'),'no-store');
});
test('unknown and malformed profiles return real 404, never the guild preview',async()=>{
 for(const path of ['/@unknown-player','/@%ZZ','/@','/@a/b']){
  const r=await worker.fetch(new Request('https://test.local'+path),env);assert.equal(r.status,404);assert.ok(!(await r.text()).includes('og:image'));
 }
});
test('root preview and static assets still work, invalid timestamps are discarded',async()=>{
 const r=await worker.fetch(new Request('https://test.local/?t=%22%3E%3Cscript%3E'),env);const html=await r.text();
 assert.equal(r.status,200);assert.ok(html.includes('/share-image.png'));assert.ok(html.includes('content="1200"'));assert.ok(!html.includes('<script>'));
 assert.equal(await (await worker.fetch(new Request('https://test.local/app.js'),env)).text(),'asset');
});
