import {countries} from './countries.js';
export const continents=['Africa','Antarctica','Asia','Europe','North America','South America','Oceania'];
// Accept either continent for countries commonly taught as spanning two.
const sharedContinents={ru:['Europe','Asia'],tr:['Europe','Asia'],kz:['Europe','Asia'],az:['Europe','Asia'],ge:['Europe','Asia'],eg:['Africa','Asia'],id:['Asia','Oceania']};
export function countryContinents(country){return sharedContinents[country.id]||[country.region];}
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// Give every question in a turn a different correct-answer slot.
function questionOptions(country,count){
 const choices=[country,...shuffle(countries.filter(x=>x.id!==country.id&&x.capital!==country.capital)).slice(0,count-1)];
 const slots=shuffle(Array.from({length:count},(_,i)=>i)).slice(0,3);
 const orders=slots.map(slot=>{
  const options=shuffle(choices.filter(x=>x.id!==country.id));
  options.splice(slot,0,country);
  return options;
 });
 return {country,options:orders[0],capitalOptions:orders[1],flagOptions:orders[2]};
}
function showQuestion(s,stage){
 const q=s.deck[s.turn];
 const options=stage==='capital'?q.capitalOptions:q.flagOptions;
 return {...s,stage,feedback:null,deck:s.deck.map((entry,i)=>i===s.turn?{...entry,options}:entry)};
}
export function newGame(names,rounds=6,difficulty='classic'){
 if(!Array.isArray(names)||names.length<2||names.length>8)throw new Error('Choose 2–8 players.');
 if(![2,4,6].includes(rounds))throw new Error('Choose 2, 4 or 6 rounds.');
 if(!['classic','map','early'].includes(difficulty))throw new Error('Unknown difficulty.');
 const count=difficulty==='map'?8:4;
 return {names:names.map((n,i)=>n.trim()||`Explorer ${i+1}`),rounds,difficulty,deck:shuffle(countries).slice(0,rounds*names.length).map(c=>difficulty==='early'?{country:c,options:shuffle(continents).map(name=>({id:name,name}))}:questionOptions(c,count)),turn:0,scores:names.map(()=>0),stage:'handoff',pot:0,feedback:null};
}
export function answerStatus(s,id){
 if(!s.feedback)return '';
 if(s.difficulty==='early'?countryContinents(s.deck[s.turn].country).includes(id):id===s.deck[s.turn].country.id)return 'correct';
 return id===s.feedback.selectedId?'incorrect':'';
}
export function transition(s,a){
 const q=s.deck[s.turn],c=q?.country;
 if(a.type==='ready'&&s.stage==='handoff')return {...s,stage:s.difficulty==='early'?'continent':'country'};
 if(a.type==='answer'&&s.stage==='continent'&&!s.feedback&&q.options.some(o=>o.id===a.id)){
  const accepted=countryContinents(c),correct=accepted.includes(a.id);
  return {...s,pot:correct?100:0,feedback:{correct,selectedId:a.id,answer:accepted.join(' & ')}};
 }
 if(a.type==='continue'&&s.feedback&&s.stage==='continent')return {...s,stage:'recap',feedback:null};
 if(a.type==='answer'&&['country','capital','flag'].includes(s.stage)&&!s.feedback&&q.options.some(o=>o.id===a.id)){
  const correct=a.id===c.id;
  const pot=s.stage==='flag'?(correct?s.pot+100:0):s.pot+(correct?(s.stage==='country'?100:50):0);
  return {...s,pot,feedback:{correct,selectedId:a.id,answer:s.stage==='capital'?c.capital:c.name}};
 }
 if(a.type==='continue'&&s.feedback&&s.stage==='country')return showQuestion(s,'capital');
 if(a.type==='continue'&&s.feedback)return {...s,stage:s.stage==='country'?'capital':s.stage==='capital'?'decision':'recap',feedback:null};
 if(a.type==='bank'&&s.stage==='decision')return {...s,stage:'recap'};
 if(a.type==='risk'&&s.stage==='decision')return showQuestion(s,'flag');
 if(a.type==='finish'&&s.stage==='recap'){
  const scores=[...s.scores];scores[s.turn%s.names.length]+=s.pot;const turn=s.turn+1;
  return {...s,scores,turn,pot:0,stage:turn===s.deck.length?'results':'handoff'};
 }
 return s;
}

export function winners(s){const best=Math.max(...s.scores);return s.names.map((name,index)=>({name,index,score:s.scores[index]})).filter(p=>p.score===best);}
