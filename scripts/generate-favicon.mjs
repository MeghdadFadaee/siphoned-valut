import fs from 'node:fs/promises';
import sharp from 'sharp';
import {energyArt} from '../lib/energy-art.mjs';
const svg=energyArt;
const publicDir=new URL('../public/',import.meta.url);
await fs.writeFile(new URL('favicon.svg',publicDir),svg);
await fs.writeFile(new URL('siphoned-energy.svg',publicDir),svg);
await sharp(Buffer.from(svg)).resize(32,32).png().toFile(new URL('favicon-32.png',publicDir).pathname);
await sharp(Buffer.from(svg)).resize(180,180).png().toFile(new URL('apple-touch-icon.png',publicDir).pathname);
const sizes=[16,32,48];const pngs=await Promise.all(sizes.map(size=>sharp(Buffer.from(svg)).resize(size,size).png().toBuffer()));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
for(let i=0;i<sizes.length;i++){const pos=6+i*16;header[pos]=sizes[i];header[pos+1]=sizes[i];header.writeUInt16LE(1,pos+4);header.writeUInt16LE(32,pos+6);header.writeUInt32LE(pngs[i].length,pos+8);header.writeUInt32LE(offset,pos+12);offset+=pngs[i].length;}
await fs.writeFile(new URL('favicon.ico',publicDir),Buffer.concat([header,...pngs]));
console.log('Created SVG, 16/32/48 ICO, 32px PNG and 180px Apple icon.');
