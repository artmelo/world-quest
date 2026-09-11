import {countries} from './countries.js';
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function newGame(names,rounds=6,difficulty='classic'){
 if(!Array.isArray(names)||names.length<2||names.length>8)throw new Error('Choose 2–8 players.');
 if(![2,4,6].includes(rounds))throw new Error('Choose 2, 4 or 6 rounds.');
 if(!['classic','map'].includes(difficulty))throw new Error('Unknown difficulty.');
 const count=difficulty==='map'?8:4;
 return {names:names.map((n,i)=>n.trim()||`Explorer ${i+1}`),rounds,difficulty,deck:shuffle(countries).slice(0,rounds*names.length).map(c=>({country:c,options:shuffle([c,...shuffle(countries.filter(x=>x.id!==c.id&&x.capital!==c.capital)).slice(0,count-1)])})),turn:0,scores:names.map(()=>0),stage:'handoff',pot:0,feedback:null};
}
export function answerStatus(s,id){
 if(!s.feedback)return '';
 if(id===s.deck[s.turn].country.id)return 'correct';
 return id===s.feedback.selectedId?'incorrect':'';
}
export function transition(s,a){
 const q=s.deck[s.turn],c=q?.country;
 if(a.type==='ready'&&s.stage==='handoff')return {...s,stage:'country'};
 if(a.type==='answer'&&['country','capital','flag'].includes(s.stage)&&!s.feedback&&q.options.some(o=>o.id===a.id)){
  const correct=a.id===c.id;
  const pot=s.stage==='flag'?(correct?s.pot+100:0):s.pot+(correct?(s.stage==='country'?100:50):0);
  return {...s,pot,feedback:{correct,selectedId:a.id,answer:s.stage==='capital'?c.capital:c.name}};
 }
 if(a.type==='continue'&&s.feedback)return {...s,stage:s.stage==='country'?'capital':s.stage==='capital'?'decision':'recap',feedback:null};
 if(a.type==='bank'&&s.stage==='decision')return {...s,stage:'recap'};
 if(a.type==='risk'&&s.stage==='decision')return {...s,stage:'flag'};
 if(a.type==='finish'&&s.stage==='recap'){
  const scores=[...s.scores];scores[s.turn%s.names.length]+=s.pot;const turn=s.turn+1;
  return {...s,scores,turn,pot:0,stage:turn===s.deck.length?'results':'handoff'};
 }
 return s;
}

export function winners(s){const best=Math.max(...s.scores);return s.names.map((name,index)=>({name,index,score:s.scores[index]})).filter(p=>p.score===best);}
