import fs from 'node:fs/promises';
import opentype from '@shuding/opentype.js';
import sharp from 'sharp';
const fontBytes=await fs.readFile(new URL('../lib/fonts/Vazirmatn-Bold.ttf',import.meta.url));
const font=opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset,fontBytes.byteOffset+fontBytes.byteLength));
const glyph=font.getPath('س',0,0,64);
const xs=glyph.commands.flatMap(c=>[c.x,c.x1,c.x2].filter(Number.isFinite));const ys=glyph.commands.flatMap(c=>[c.y,c.y1,c.y2].filter(Number.isFinite));
const box={x1:Math.min(...xs),x2:Math.max(...xs),y1:Math.min(...ys),y2:Math.max(...ys)};const scale=Math.min(34/(box.x2-box.x1),27/(box.y2-box.y1));
const dx=32-(box.x1+box.x2)/2*scale,dy=34-(box.y1+box.y2)/2*scale;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>نشان خزانه سایفوند انرژی</title><rect width="64" height="64" rx="14" fill="#141618"/><path d="M14 13h36v24c0 10-8 16-18 21-10-5-18-11-18-21V13Z" fill="#30291d" stroke="#d1ab6c" stroke-width="3" stroke-linejoin="round"/><g transform="translate(${dx.toFixed(3)} ${dy.toFixed(3)}) scale(${scale.toFixed(5)})"><path d="${glyph.toPathData(3)}" fill="#f1cd8d"/></g></svg>`;
const publicDir=new URL('../public/',import.meta.url);
await fs.writeFile(new URL('favicon.svg',publicDir),svg);
await sharp(Buffer.from(svg)).resize(32,32).png().toFile(new URL('favicon-32.png',publicDir).pathname);
await sharp(Buffer.from(svg)).resize(180,180).png().toFile(new URL('apple-touch-icon.png',publicDir).pathname);
const sizes=[16,32,48];const pngs=await Promise.all(sizes.map(size=>sharp(Buffer.from(svg)).resize(size,size).png().toBuffer()));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
for(let i=0;i<sizes.length;i++){const pos=6+i*16;header[pos]=sizes[i];header[pos+1]=sizes[i];header.writeUInt16LE(1,pos+4);header.writeUInt16LE(32,pos+6);header.writeUInt32LE(pngs[i].length,pos+8);header.writeUInt32LE(offset,pos+12);offset+=pngs[i].length;}
await fs.writeFile(new URL('favicon.ico',publicDir),Buffer.concat([header,...pngs]));
console.log('Created SVG, 16/32/48 ICO, 32px PNG and 180px Apple icon.');
