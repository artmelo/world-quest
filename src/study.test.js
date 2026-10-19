import test from 'node:test';
import assert from 'node:assert/strict';
import {countries} from './countries.js';
import {cleanProgress,recordAnswer,makeQuestion,kinds} from './study.js';
test('passport sanitizes stale and malformed browser data',()=>{
 assert.deepEqual(cleanProgress(null),{explored:[],practiced:[],favorites:[],missed:[]});
 const p=cleanProgress({explored:['jp','jp','invalid'],favorites:'bad',missed:[null,{countryId:'jp',kind:'flag'},{countryId:'jp',kind:'flag'},{countryId:'jp',kind:'bad'}]});
 assert.deepEqual(p.explored,['jp']);assert.equal(p.missed.length,1);assert.deepEqual(p.favorites,[]);
});
test('misses deduplicate and correct answers remove only that question',()=>{
 const p=cleanProgress(null),q={countryId:'jp',kind:'flag'},other={countryId:'jp',kind:'capital'};
 let next=recordAnswer(p,q,false);next=recordAnswer(next,q,false);next=recordAnswer(next,other,false);
 assert.equal(next.missed.length,2);assert.deepEqual(p.missed,[]);
 assert.deepEqual(recordAnswer(next,q,true).missed,[other]);
});
test('every country has valid, unique options and an available correct answer',()=>{
 for(const c of countries)for(const kind of kinds){
  const q=makeQuestion(c.id,kind),ids=q.options.map(o=>o.id);
  assert.equal(new Set(ids).size,ids.length);assert.equal(ids.length,kind==='continent'?7:4);
  assert.ok(q.accepted.some(id=>ids.includes(id)),c.name+' '+kind);
  if(kind==='capital')assert.equal(q.options.filter(o=>o.label===c.capital).length,1);
 }
});
test('cross-continent answers are accepted and invalid questions fail clearly',()=>{
 assert.deepEqual(makeQuestion('tr','continent').accepted,['Europe','Asia']);
 assert.throws(()=>makeQuestion('missing','flag'));assert.throws(()=>makeQuestion('jp','unknown'));
});
