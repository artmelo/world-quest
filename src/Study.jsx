import React,{useState,useEffect,useRef,lazy,Suspense} from 'react';
import {countries} from './countries.js';
import {countryContinents,shuffle} from './game.js';
import {flagUrl} from './flags.js';
import {STORAGE_KEY,cleanProgress,recordAnswer,makeQuestion} from './study.js';
import './study.css';
const WorldMap=lazy(()=>import('./WorldMap.jsx'));
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function Study(){
 const [progress,setProgress]=useState(()=>{try{return cleanProgress(JSON.parse(localStorage.getItem(STORAGE_KEY)));}catch{return cleanProgress(null);}});
 const [saveError,setSaveError]=useState(false);
 const [search,setSearch]=useState(''),[region,setRegion]=useState('all'),[filter,setFilter]=useState('all'),[selected,setSelected]=useState(null),[level,setLevel]=useState('full'),[quiz,setQuiz]=useState(null);
 const detail=useRef(null),prompt=useRef(null);
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));setSaveError(false);}catch{setSaveError(true);}},[progress]);
 useEffect(()=>{if(selected)detail.current?.focus();},[selected]);
 useEffect(()=>{if(quiz)prompt.current?.focus();},[quiz?.index,quiz?.done,!!quiz]);
 const country=countries.find(c=>c.id===selected);
 const visible=countries.filter(c=>(region==='all'||countryContinents(c).includes(region))&&normalize(c.name).includes(normalize(search))&&(filter==='all'||progress[filter].includes(c.id)));
 function explore(id){setSelected(id);setQuiz(null);setProgress(p=>({...p,explored:[...new Set([...p.explored,id])]}));}
 function startQuiz(review=false){
  const questions=review?shuffle(progress.missed).slice(0,6).map(q=>makeQuestion(q.countryId,q.kind)):(level==='early'?['continent','flag']:['continent','capital','flag']).map(kind=>makeQuestion(selected,kind));
  if(questions.length)setQuiz({questions,index:0,feedback:null,done:false,review});
 }
 function answer(id){
  if(!quiz||quiz.done||quiz.feedback)return;
  const q=quiz.questions[quiz.index],correct=q.accepted.includes(id);
  setProgress(p=>recordAnswer(p,q,correct));
  setQuiz({...quiz,feedback:{id,correct}});
 }
 function next(){
  if(quiz.index+1===quiz.questions.length){
   if(!quiz.review)setProgress(p=>({...p,practiced:[...new Set([...p.practiced,selected])]}));
   setQuiz({...quiz,done:true});
  }else setQuiz({...quiz,index:quiz.index+1,feedback:null});
 }
 const q=quiz&&!quiz.done?quiz.questions[quiz.index]:null;
 const qc=q?countries.find(c=>c.id===q.countryId):null;
 return <section className="study" aria-label="Explore and Learn">
  <div className="study-intro"><span className="eyebrow">YOUR OWN LITTLE WORLD ATLAS</span><h1>Explore &amp; Learn</h1><p>Follow your curiosity. Meet a country, discover its stories, and practice at your own pace.</p></div>
  <div className="study-passport" aria-label="My passport"><div><strong>My passport</strong><p>{progress.explored.length} explored · {progress.practiced.length} practiced · {progress.favorites.length} favorites</p></div><button className="secondary" disabled={!progress.missed.length} onClick={()=>startQuiz(true)}>Review missed questions ({progress.missed.length})</button></div>
  <p className="small" role="status">{saveError?'Progress is available for this visit, but this browser could not save it.':'Your passport is saved in this browser on this device. No account needed; clearing browser data removes it.'}</p>
  {quiz?<section className="study-practice" aria-label="Study practice">
   <button className="text" onClick={()=>setQuiz(null)}>← Back to exploring</button>
   {quiz.done?<><h2 ref={prompt} tabIndex={-1}>Practice complete!</h2><p>Every question is a chance to learn. Missed questions stay in your review list until you answer them correctly.</p><button className="primary" onClick={()=>setQuiz(null)}>Keep exploring →</button></>:<>
    <span className="eyebrow">QUESTION {quiz.index+1} OF {quiz.questions.length} · NO TIMER</span>
    <h2 ref={prompt} tabIndex={-1}>{q.kind==='continent'?'Which continent is '+qc.name+' in?':q.kind==='capital'?(qc.capitalPrompt||'What is the capital of '+qc.name+'?'):'Which flag belongs to '+qc.name+'?'}</h2>
    {q.kind==='continent'&&<p className="small">Oceania includes Australia and the Pacific islands. For a country spanning continents, either is accepted.</p>}
    <div className="answers">{q.options.map((o,i)=><button className={'answer '+(quiz.feedback?(q.accepted.includes(o.id)?'correct':quiz.feedback.id===o.id?'incorrect':''):'')} key={o.id} disabled={!!quiz.feedback} onClick={()=>answer(o.id)}>{q.kind==='flag'?<img className="flag" src={flagUrl(o.id)} alt={'Flag option '+String.fromCharCode(65+i)}/>:o.label}</button>)}</div>
    {quiz.feedback&&<div className="feedback" role="status"><strong>{quiz.feedback.correct?'That’s right!':'Let’s learn this one.'}</strong><p>{q.kind==='continent'?qc.name+' is in '+countryContinents(qc).join(' and ')+'.':q.kind==='capital'?(qc.capitalNote||qc.name+' · Capital: '+qc.capital):'This is the flag of '+qc.name+'.'}</p>{q.kind==='flag'&&<img className="flag" src={flagUrl(qc.id)} alt={'Flag of '+qc.name}/>}<div className="study-actions">{!quiz.feedback.correct&&<button className="secondary" onClick={()=>setQuiz({...quiz,feedback:null})}>Try again</button>}<button className="primary" onClick={next}>{quiz.index+1===quiz.questions.length?'Finish practice':'Next question'} →</button></div></div>}
   </>}
  </section>:<div className="study-layout">
   <aside className="study-browser" aria-label="Country explorer">
    <label>Find a country<input type="search" value={search} placeholder="Search countries…" onChange={e=>setSearch(e.target.value)}/></label>
    <label>Continent<select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">All continents</option>{['Africa','Asia','Europe','North America','South America','Oceania'].map(r=><option key={r}>{r}</option>)}</select></label>
    <label>My collection<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All countries</option><option value="favorites">Favorites</option><option value="explored">Explored</option><option value="practiced">Practiced</option></select></label>
    <button className="secondary" disabled={!visible.length} onClick={()=>explore(shuffle(visible.filter(c=>visible.length===1||c.id!==selected))[0].id)}>Surprise me ✨</button>
    <p className="small" aria-live="polite">{visible.length} countries</p>
    <div className="country-list">{visible.map(c=><button key={c.id} aria-pressed={selected===c.id} onClick={()=>explore(c.id)}><img src={flagUrl(c.id)} alt=""/><span>{c.name}<small>{progress.practiced.includes(c.id)?'Practiced':progress.explored.includes(c.id)?'Explored':'Ready to discover'}</small></span>{progress.favorites.includes(c.id)&&<span aria-label="Favorite">★</span>}</button>)}</div>
    {!visible.length&&<p>No countries match. Try another search or collection.</p>}
   </aside>
   <article className="study-card">
    {!country?<div className="study-empty"><span aria-hidden="true">🌍</span><h2>Where will curiosity take you?</h2><p>Choose a country or try “Surprise me.” Read, explore the map, and collect a new passport stamp.</p></div>:<>
     <div className="study-country-heading"><img src={flagUrl(country.id)} alt={'Flag of '+country.name}/><div><span className="eyebrow">{countryContinents(country).join(' & ')}</span><h2 ref={detail} tabIndex={-1}>{country.name}</h2></div><button className="text" aria-pressed={progress.favorites.includes(selected)} onClick={()=>setProgress(p=>({...p,favorites:p.favorites.includes(selected)?p.favorites.filter(id=>id!==selected):[...p.favorites,selected]}))}>{progress.favorites.includes(selected)?'★ Saved':'☆ Save favorite'}</button></div>
     <p><strong>{country.id==='nr'||country.id==='ps'?'Government centre':'Capital'}:</strong> {country.capital}</p>{country.capitalNote&&<p className="small">{country.capitalNote}</p>}
     <Suspense fallback={<p role="status">Preparing your flight…</p>}><WorldMap key={country.id} countryId={country.id} countryName={country.name} study/></Suspense>
     <h3>Five things to discover</h3><div className="study-features">{country.clues.map(([icon,label])=><div key={label}><span aria-hidden="true">{icon}</span><p>{label}</p></div>)}</div>
     <details><summary>Tell me more</summary><p>{country.fact}</p></details>
     <div className="study-practice-invite"><h3>Try what you learned</h3><p>Optional practice, with hints and as many retries as you like.</p><label>Learning level<select value={level} onChange={e=>setLevel(e.target.value)}><option value="early">Early learner · Continents &amp; flags</option><option value="full">Explorer · Continents, capitals &amp; flags</option></select></label><div className="study-actions"><button className="primary" onClick={()=>startQuiz()}>Start practice →</button><button className="secondary" onClick={()=>explore(shuffle(countries.filter(c=>c.id!==selected))[0].id)}>Explore another country</button></div></div>
    </>}
   </article>
  </div>}
 </section>;
}
