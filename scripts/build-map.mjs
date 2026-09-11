// Offline build step. Natural Earth data comes from world-atlas (public domain).
import fs from 'node:fs';
import {feature} from 'topojson-client';
import {presimplify,simplify} from 'topojson-simplify';
import {geoEquirectangular,geoPath,geoArea,geoCentroid} from 'd3-geo';
import {countries} from '../src/countries.js';
const original=JSON.parse(fs.readFileSync(new URL('../node_modules/world-atlas/countries-10m.json',import.meta.url)));
const reduced=simplify(presimplify(original),0.008);
const detailed=feature(original,original.objects.countries).features;
const simplified=feature(reduced,reduced.objects.countries).features;
const projection=geoEquirectangular().scale(960/(2*Math.PI)).translate([480,250]);
const path=geoPath(projection).digits(3);
const polygons=f=>(f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]).map(coordinates=>({type:'Polygon',coordinates}));
const targets={};
for(const c of countries){
 const index=detailed.findIndex(f=>c.id==='xk'?f.properties.name==='Kosovo':f.id===c.numeric);
 if(index<0)throw Error(`Missing borders: ${c.name}`);
 const raw=detailed[index],largest=polygons(raw).sort((a,b)=>geoArea(b)-geoArea(a))[0];
 const bounds=path.bounds(largest),dx=bounds[1][0]-bounds[0][0],dy=bounds[1][1]-bounds[0][1];
 const small=Math.max(dx,dy)<3;
 const shape=small?raw:simplified[index];
 const point=projection(geoCentroid(largest));
 const cx=(bounds[0][0]+bounds[1][0])/2;
 const width=Math.min(960,Math.max(18,dx*1.9,dy*1.9*1.6)),height=width/1.6;
 const view=[cx-width/2,(bounds[0][1]+bounds[1][1])/2-height/2,width,height].map(x=>+x.toFixed(4));
 targets[c.id]={path:path(shape),point:point.map(x=>+x.toFixed(4)),view,small};
 if(!targets[c.id].path||!point.every(Number.isFinite))throw Error(`Invalid map: ${c.name}`);
}
const result={world:simplified.map(f=>path(f)).filter(Boolean),targets};
fs.writeFileSync(new URL('../src/data/map.json',import.meta.url),JSON.stringify(result));
console.log(`Prepared ${Object.keys(targets).length} map targets; ${(JSON.stringify(result).length/1024).toFixed(0)} KB.`);
