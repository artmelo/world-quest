import {countries} from './countries.js';
import {shuffle,continents,countryContinents} from './game.js';
export const STORAGE_KEY='world-quest-study-v1';
const ids=new Set(countries.map(c=>c.id));
export const kinds=['continent','capital','flag'];
export function cleanProgress(value){
 const list=v=>Array.isArray(v)?[...new Set(v.filter(id=>ids.has(id)))]:[];
 const missed=Array.isArray(value?.missed)?value.missed.filter(q=>ids.has(q?.countryId)&&kinds.includes(q?.kind)):[];
 return {explored:list(value?.explored),practiced:list(value?.practiced),favorites:list(value?.favorites),missed:[...new Map(missed.map(q=>[q.countryId+':'+q.kind,{countryId:q.countryId,kind:q.kind}])).values()]};
}
export function recordAnswer(progress,question,correct){
 const key=q=>q.countryId+':'+q.kind;
 const missed=progress.missed.filter(q=>key(q)!==key(question));
 if(!correct)missed.push({countryId:question.countryId,kind:question.kind});
 return {...progress,missed};
}
export function makeQuestion(countryId,kind){
 const country=countries.find(c=>c.id===countryId);
 if(!country||!kinds.includes(kind))throw new Error('Unknown study question.');
 const accepted=kind==='continent'?countryContinents(country):[countryId];
 const options=kind==='continent'?shuffle(continents).map(name=>({id:name,label:name})):shuffle([country,...shuffle(countries.filter(c=>c.id!==countryId&&c.capital!==country.capital)).slice(0,3)]).map(c=>({id:c.id,label:kind==='capital'?c.capital:c.name}));
 return {countryId,kind,accepted,options};
}
