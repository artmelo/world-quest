import {countries} from './countries.js';
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function newGame(names,rounds=4){return {names:names.map((n,i)=>n.trim()||`Explorer ${i+1}`),rounds,deck:shuffle(countries).slice(0,rounds*2).map(c=>({country:c,options:shuffle([c,...shuffle(countries.filter(x=>x.id!==c.id)).slice(0,3)])})),turn:0,scores:[0,0],stage:'handoff',pot:0,feedback:null};}
export function transition(s,a){
 const c=s.deck[s.turn]?.country;
 if(a.type==='ready'&&s.stage==='handoff')return {...s,stage:'country'};
 if(a.type==='answer'&&['country','capital','flag'].includes(s.stage)&&!s.feedback){const correct=a.id===c.id;const pot=s.stage==='flag'?(correct?s.pot+100:0):s.pot+(correct?(s.stage==='country'?100:50):0);return {...s,pot,feedback:{correct,answer:s.stage==='country'?c.name:s.stage==='capital'?c.capital:c.name}};}
 if(a.type==='continue'&&s.feedback){return {...s,stage:s.stage==='country'?'capital':s.stage==='capital'?'decision':'recap',feedback:null};}
 if(a.type==='bank'&&s.stage==='decision')return {...s,stage:'recap'};
 if(a.type==='risk'&&s.stage==='decision')return {...s,stage:'flag'};
 if(a.type==='finish'&&s.stage==='recap'){const scores=[...s.scores];scores[s.turn%2]+=s.pot;const turn=s.turn+1;return {...s,scores,turn,pot:0,stage:turn===s.deck.length?'results':'handoff'};}
 return s;
}
