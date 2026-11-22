import React,{useState} from 'react';
import './flag-deck.css';
const cards=[['Seychelles','🇸🇨','seychelles'],['Namibia','🇳🇦','namibia'],['Canada','🇨🇦','canada'],['Greece','🇬🇷','greece'],['Samoa','🇼🇸','samoa']];
export default function FlagDeck(){
 const [paused,setPaused]=useState(false);
 return <div className={'welcome-deck'+(paused?' is-paused':'')}>
  <div id="world-quest-flag-deck" role="img" aria-label="Seychelles, Namibia, Canada, Greece and Samoa flag cards shuffling from left to right.">
   <div className="deck-stage" aria-hidden="true">{cards.map(([name,flag,color],i)=><div key={name} className={'flag-card '+color} style={{'--delay':`${(i-4)*2.4}s`}}><span className="flag">{flag}</span><span className="country">{name}</span></div>)}</div>
  </div>
  <button type="button" className="deck-motion" aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?'Resume animation':'Pause animation'}</button>
 </div>;
}
