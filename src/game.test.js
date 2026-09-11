import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newGame,transition,answerStatus} from './game.js';
import {countries} from './countries.js';
const answer=(s,correct=true)=>transition(s,{type:'answer',id:correct?s.deck[s.turn].country.id:s.deck[s.turn].options.find(o=>o.id!==s.deck[s.turn].country.id).id});
const next=s=>transition(s,{type:'continue'});
function reachDecision(difficulty='classic'){let s=transition(newGame(['A','B'],2,difficulty),{type:'ready'});s=next(answer(s));return next(answer(s));}
test('Grand Adventure is the default and both difficulties have unique valid choices',()=>{
 assert.equal(newGame(['A','B']).rounds,6);
 for(const difficulty of ['classic','map'])for(const rounds of [2,4,6]){
  const s=newGame([' A ',''],rounds,difficulty),count=difficulty==='map'?8:4;
  assert.equal(s.deck.length,rounds*2);assert.equal(new Set(s.deck.map(x=>x.country.id)).size,rounds*2);assert.deepEqual(s.names,['A','Explorer 2']);assert.equal(s.difficulty,difficulty);
  for(const q of s.deck){assert.equal(q.options.length,count);assert.equal(new Set(q.options.map(x=>x.id)).size,count);assert.equal(new Set(q.options.map(x=>x.capital)).size,count);assert(q.options.some(x=>x.id===q.country.id));}
 }
});
test('wrong selection is red, correct answer is green, others are neutral in all question stages',()=>{
 for(const stage of ['country','capital','flag'])for(const correct of [true,false]){
  let s={...newGame(['A','B'],2,'map'),stage,pot:150};
  s=answer(s,correct);const id=s.deck[0].country.id;
  assert.equal(answerStatus(s,id),'correct');
  assert.equal(answerStatus(s,s.feedback.selectedId),correct?'correct':'incorrect');
  for(const o of s.deck[0].options.filter(o=>o.id!==id&&o.id!==s.feedback.selectedId))assert.equal(answerStatus(s,o.id),'');
  const continued=next(s);assert.equal(continued.feedback,null);assert.equal(answerStatus(continued,id),'');
 }
});
test('banking happens once and alternates players',()=>{
 let s=reachDecision();assert.equal(s.pot,150);s=transition(s,{type:'bank'});s=transition(s,{type:'finish'});assert.deepEqual(s.scores,[150,0]);assert.equal(s.turn,1);assert.equal(s.stage,'handoff');assert.deepEqual(transition(s,{type:'finish'}),s);
});
test('flag success awards 250; failure preserves previous banked points',()=>{
 for(const correct of [true,false]){let s=reachDecision('map');s.scores=[75,0];s=transition(s,{type:'risk'});s=next(answer(s,correct));s=transition(s,{type:'finish'});assert.equal(s.scores[0],correct?325:75);}
});
test('invalid and repeated answers cannot score',()=>{
 let s=transition(newGame(['A','B'],2),{type:'ready'});assert.deepEqual(transition(s,{type:'answer',id:'not-a-choice'}),s);s=answer(s,false);assert.equal(s.pot,0);assert.equal(s.feedback.answer,s.deck[0].country.name);assert.deepEqual(answer(s,true),s);
});
test('all trip lengths and difficulties finish with equal turns and replay resets',()=>{
 for(const difficulty of ['classic','map'])for(const rounds of [2,4,6]){
  let s=newGame(['A','B'],rounds,difficulty);
  for(let i=0;i<rounds*2;i++){s=transition(s,{type:'ready'});s=next(answer(s));s=next(answer(s));s=transition(s,{type:'bank'});s=transition(s,{type:'finish'});}
  assert.equal(s.stage,'results');assert.deepEqual(s.scores,[rounds*150,rounds*150]);
  const replay=newGame(s.names,s.rounds,s.difficulty);assert.equal(replay.difficulty,difficulty);assert.equal(replay.turn,0);assert.deepEqual(replay.scores,[0,0]);
 }
});
test('all 197 countries have three usable clues, capitals, and bundled flags',()=>{
 assert.equal(countries.length,197);assert.equal(new Set(countries.map(c=>c.id)).size,197);assert.equal(new Set(countries.map(c=>c.name)).size,197);
 for(const c of countries){assert.equal(c.clues.length,3,c.name);assert.equal(new Set(c.clues.map(x=>x[1])).size,3,c.name);for(const clue of c.clues)assert(clue[0]&&clue[1].length>2,c.name);assert(c.capital&&c.region&&c.fact,c.name);assert(fs.existsSync(`node_modules/flag-icons/flags/4x3/${c.id}.svg`),c.name);}
});
test('every country has a finite map viewport and real border geometry, including microstates',()=>{
 const atlas=JSON.parse(fs.readFileSync('src/data/map.json'));
 assert.equal(Object.keys(atlas.targets).length,197);assert(atlas.world.length>190);
 for(const c of countries){const m=atlas.targets[c.id];assert(m.path.startsWith('M'),c.name);assert(!/NaN|Infinity/.test(m.path),c.name);assert(m.view.every(Number.isFinite),c.name);assert(m.point.every(Number.isFinite),c.name);assert(m.view[2]>0&&m.view[3]>0,c.name);const [x,y,w,h]=m.view;assert(m.point[0]>=x&&m.point[0]<=x+w&&m.point[1]>=y&&m.point[1]<=y+h,`Locator outside viewport: ${c.name}`);}
 for(const id of ['va','mc','nr','tv'])assert(atlas.targets[id].small,id);
});
test('capital exceptions avoid ambiguous questions',()=>{
 for(const id of ['ps','il','za','lk','nr','sz','bo','ch']){const c=countries.find(c=>c.id===id);assert(c.capitalPrompt&&c.capitalNote,id);}
 assert.equal(countries.find(c=>c.id==='gq').capital,'Ciudad de la Paz');
});

test('2–8 players receive equal turns, individual scores and full-roster replay',()=>{
 for(let count=2;count<=8;count++)for(const difficulty of ['classic','map'])for(const rounds of [2,4,6]){
  const names=Array.from({length:count},(_,i)=>`Player ${i+1}`);let s=newGame(names,rounds,difficulty);
  assert.equal(s.deck.length,count*rounds);assert.equal(new Set(s.deck.map(q=>q.country.id)).size,count*rounds);assert.deepEqual(s.scores,Array(count).fill(0));
  for(let turn=0;turn<count*rounds;turn++){
   const player=turn%count;assert.equal(s.turn%s.names.length,player);s=transition(s,{type:'ready'});
   s=next(answer(s,player%2===0));s=next(answer(s));s=transition(s,{type:'bank'});s=transition(s,{type:'finish'});
  }
  assert.equal(s.stage,'results');assert.deepEqual(s.scores,names.map((_,i)=>rounds*(i%2===0?150:50)));
  const replay=newGame(s.names,s.rounds,s.difficulty);assert.deepEqual(replay.names,names);assert.deepEqual(replay.scores,Array(count).fill(0));
 }
});
test('player bounds and empty-name fallbacks are enforced',()=>{
 for(const count of [0,1,9])assert.throws(()=>newGame(Array(count).fill('A')),/2–8/);
 assert.deepEqual(newGame(['A','',' C ']).names,['A','Explorer 2','C']);
});
test('winner calculation includes a late-roster winner and partial ties',async()=>{
 const {winners}=await import('./game.js');const names=['A','B','C','D','E','F','G','H'];
 assert.deepEqual(winners({names,scores:[0,0,0,0,0,0,0,100]}).map(p=>p.name),['H']);
 assert.deepEqual(winners({names,scores:[50,0,0,50,0,0,0,50]}).map(p=>p.name),['A','D','H']);
 assert.equal(winners({names,scores:Array(8).fill(0)}).length,8);
});
