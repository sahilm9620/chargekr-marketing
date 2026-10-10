const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const E=require('../engine.js');
// Exactly two introductory levels, followed by generated puzzles with no content cap.
assert.equal(E.levels.length,2);
function checkSolvable(state){
 assert.equal(E.trace(state).solved,false);assert.equal(new Set(state.route).size,state.route.length);
 assert(state.n<=5);assert.equal(state.start%state.n,0);assert.equal(state.end%state.n,state.n-1);
 for(const index of state.route)assert.equal(state.cells[index].blocked,false);
 assert.equal(new Set(state.relays).size,state.relays.length);
 let safety=0;
 while(E.hint(state)!==null){assert(safety++<state.cells.length*4);E.turn(state,E.hint(state));}
 const result=E.trace(state);assert.equal(result.solved,true);assert.deepEqual(result.visited,state.route);assert.equal(result.relays.length,state.relays.length);
 E.turn(state,state.start);assert.equal(E.trace(state).solved,false);
}
for(const level of [0,1,2,3,4,19,99,999,99999,999999]){
 for(const rand of [()=>0,()=>.4,()=>.999,Math.random]){
  checkSolvable(E.makeLevel(level,rand));
 }
}
let seed=231;const seeded=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const layouts=new Set(),boards=new Set();
for(let i=2;i<1002;i++){const s=E.makeLevel(i,seeded);layouts.add(s.n+':'+s.route.join(','));boards.add(s.n+':'+s.cells.map(c=>[c.base,c.turns,c.blocked,c.relay].join(',')).join(';'));checkSolvable(s);}
assert(layouts.size>900,'Endless mode must generate a wide variety of routes');assert.equal(boards.size,1000,'Sampled puzzles must not cycle through a fixed set');
assert.equal(E.rotate(3,4),3);assert.equal(E.rotate(10),5);
const blocked=E.makeLevel(0,()=>0);assert.equal(E.turn(blocked,6),false);
// Reaching OUT without required relays must not count as a solution.
const incomplete={n:2,start:0,end:1,relays:[2],route:[0,1],cells:[{base:10,turns:0},{base:10,turns:0},{base:3,turns:0},{base:3,turns:0}]};
assert.equal(E.trace(incomplete).reason,'missing-relay');
// Drive real UI handlers: two levels, automatic reveal, endless progression,
// reset the same route, cancel an animation by viewing the brand, resume, and replay.
const html=fs.readFileSync('index.html','utf8');
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size);
assert(html.includes('Follow <br>the signal<span>.</span>'));
assert(!html.includes('id="intro"'));
assert(html.includes('src="chargekr-logo.png"'));
assert(html.includes('PUNE HAS A SECRET MODE'));
function element(id){const classes=new Set();return{id,disabled:false,hidden:false,children:[],attributes:{},handlers:{},style:{setProperty(k,v){this[k]=v}},textContent:'',value:'',_html:'',get innerHTML(){return this._html},set innerHTML(v){this._html=v;this.children=[]},classList:{add(...args){args.forEach(a=>classes.add(a))},remove(...args){args.forEach(a=>classes.delete(a))},toggle(v,on){if(on===undefined)on=!classes.has(v);on?classes.add(v):classes.delete(v)},contains(v){return classes.has(v)}},addEventListener(e,f){this.handlers[e]=f},setAttribute(k,v){this.attributes[k]=v},appendChild(c){this.children.push(c)},focus(){},select(){}};}
const els=Object.fromEntries(ids.map(id=>[id,element(id)]));let timers=[],seq=0;const actualStates=[];
const instrumented={...E,makeLevel(level){const s=E.makeLevel(level,seeded);actualStates.push(s);return s;}};
const ctx={window:{SignalEngine:instrumented,matchMedia:()=>({matches:false}),scrollTo(){},isSecureContext:true},document:{getElementById:id=>{assert(els[id],id);return els[id]},createElement:()=>element('tile'),body:element('body')},setTimeout(fn){const id=++seq;timers.push({id,fn});return id},clearTimeout(id){const t=timers.find(t=>t.id===id);if(t)t.cancel=true},URL,location:{href:'https://example.github.io/pune-secret-mode/?old=1#reveal'},navigator:{}};
vm.runInNewContext(fs.readFileSync('app.js','utf8'),ctx);
function click(id){assert(!els[id].disabled,id+' is disabled');return els[id].handlers.click();}
function flush(){let limit=0;while(timers.length){assert(limit++<1000);const t=timers.shift();if(!t.cancel)t.fn();}}
assert.equal(els.game.hidden,false);assert.equal(els.reveal.hidden,true);assert.equal(els.grid.children.length,9);
assert.equal(els.about.hidden,true);click('about');click('continue');click('next');assert.equal(els.reveal.hidden,true);assert.equal(actualStates.length,1);
click('hint');assert(els.grid.children.some(b=>b.classList.contains('hinted')));
click('send');flush();assert.equal(els.completion.hidden,true);assert.equal(els.send.disabled,false);
click('reset');assert.equal(els.grid.children.length,9);
function solveCurrent(){
 const s=actualStates.at(-1);let safety=0;
 while(E.hint(s)!==null){assert(safety++<100);const index=E.hint(s);els.grid.children[index].handlers.click();}
 assert.equal(E.trace(s).solved,true);click('send');flush();
}
solveCurrent();assert.equal(els.reveal.hidden,true);assert.equal(els.completion.hidden,false);click('next');assert.equal(actualStates.at(-1).number,1);
solveCurrent();assert.equal(els.game.hidden,true);assert.equal(els.reveal.hidden,false);assert.equal(els['result-label'].textContent,'PUNE / SECRET MODE UNLOCKED');assert.equal(actualStates.length,2);
click('continue');assert.equal(actualStates.at(-1).number,2);assert.equal(els.reveal.hidden,true);assert.equal(els['endless-badge'].hidden,false);assert.equal(els['district-progress'].hidden,true);assert.equal(els.about.hidden,false);
for(let i=2;i<8;i++){assert.equal(actualStates.at(-1).number,i);solveCurrent();assert.equal(els.reveal.hidden,true);click('next');}
const retained=actualStates.at(-1),initial=retained.initialTurns.slice(),route=retained.route.slice();els.grid.children[retained.start].handlers.click();click('reset');assert.strictEqual(actualStates.at(-1),retained);assert.deepEqual(retained.cells.map(c=>c.turns),initial);assert.deepEqual(retained.route,route);
els.grid.children[retained.start].handlers.click();const turns=retained.cells.map(c=>c.turns);click('send');click('about');flush();assert.equal(els.reveal.hidden,false);assert.equal(els.game.hidden,true);click('continue');assert.strictEqual(actualStates.at(-1),retained);assert.deepEqual(retained.cells.map(c=>c.turns),turns);assert.equal(els.send.disabled,false);assert.equal(els.game.hidden,false);
solveCurrent();click('about');click('continue');assert.equal(actualStates.at(-1).number,9);
click('about');
Promise.resolve(click('share')).then(()=>{assert.equal(els['share-fallback'].hidden,false);assert.equal(els['share-url'].value,'https://example.github.io/pune-secret-mode/');click('replay');assert.equal(els.game.hidden,false);assert.equal(els.moves.textContent,'00');assert.equal(els.grid.children.length,9);assert.equal(els.about.hidden,true);click('about');assert.equal(els.reveal.hidden,true);console.log('PASS: 1,040 solvable puzzles including level 1,000,000; route variety; required relays; automatic reveal after exactly 2 levels; endless progression; logo; failure, hints, same-route reset, pause/resume, replay, spoiler-free sharing fallback.');});
