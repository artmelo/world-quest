import React,{useEffect,useId,useRef,useState} from 'react';
import atlas from './data/map.json';
const worldPath=atlas.world.join('');
const WORLD=[-8,-55,976,610];
export default function WorldMap({countryId}){
 const map=useRef(null),locator=useRef(null),worldId=useId();
 const [replay,setReplay]=useState(0),[flying,setFlying]=useState(true);
 const target=atlas.targets[countryId];
 useEffect(()=>{
  let frame;
  const svg=map.current;
  if(!svg||!target)return;
  const draw=box=>{svg.setAttribute('viewBox',box.join(' '));locator.current?.setAttribute('r',String(box[2]/95));};
  const finish=()=>{draw(target.view);setFlying(false);};
  setFlying(true);draw(WORLD);
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches){finish();return;}
  const start=performance.now(),duration=2400;
  const tick=now=>{
   const t=Math.min(1,Math.max(0,(now-start-350)/duration));
   const eased=(1-Math.cos(Math.PI*t))/2;
   const width=WORLD[2]*Math.pow(target.view[2]/WORLD[2],eased),height=width/1.6;
   const from=[WORLD[0]+WORLD[2]/2,WORLD[1]+WORLD[3]/2],to=[target.view[0]+target.view[2]/2,target.view[1]+target.view[3]/2];
   const center=from.map((x,i)=>x+(to[i]-x)*eased);
   draw([center[0]-width/2,center[1]-height/2,width,height]);
   if(t<1)frame=requestAnimationFrame(tick);else finish();
  };
  const onMotion=()=>{if(motion.matches){cancelAnimationFrame(frame);finish();}};
  motion.addEventListener('change',onMotion);frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);motion.removeEventListener('change',onMotion);};
 },[countryId,replay,target]);
 if(!target)return <p role="alert">This map could not load. Start a new trip in Clue Explorer mode.</p>;
 return <div className="map-panel">
  <div className="map-status"><span role="status">{flying?'Flying to your mystery country…':'Which country did we land in?'}</span><button className="text" onClick={()=>setReplay(n=>n+1)}>Replay flight</button></div>
  <svg ref={map} viewBox={WORLD.join(' ')} className="world-map" role="img" aria-label="Unlabelled world border map. The mystery country’s border is highlighted in orange.">
   <defs><path id={worldId} d={worldPath}/></defs>
   {[-960,0,960].map(offset=><g key={offset} transform={`translate(${offset} 0)`}><use href={`#${worldId}`} className="map-borders"/><path d={target.path} className="map-target"/></g>)}
   {target.small&&<circle ref={locator} cx={target.point[0]} cy={target.point[1]} r={WORLD[2]/95} className="map-locator"/>}
  </svg>
  <p className="map-caption">{target.small?'The ring locates a tiny country. Its real border is inside.':'Follow the orange border. The flight focuses on the largest landmass.'}</p>
 </div>;
}
