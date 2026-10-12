/* Pure route-puzzle logic. An imagined Pune network, not a live charger map. */
(function(root,factory){const engine=factory();if(typeof module==='object'&&module.exports)module.exports=engine;else root.SignalEngine=engine;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const N=1,E=2,S=4,W=8,opposite={1:4,2:8,4:1,8:2},delta={1:[-1,0],2:[0,1],4:[1,0],8:[0,-1]};
const levels=[
{name:'Shaniwar Wada',district:'01',n:3,path:[[1,0],[1,1],[0,1],[0,2],[1,2]],relays:[[0,1]],blocked:[[2,0],[2,2]],message:'A new connection is waiting. ChargeKr helps people share power when they need it.'}
];
const places=['Koregaon Park','Shivajinagar','Viman Nagar','Baner','Kothrud','Hinjawadi','Deccan Gymkhana','Aundh','Kalyani Nagar','Hadapsar'];
function shuffle(values,random){for(let i=values.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[values[i],values[j]]=[values[j],values[i]];}return values;}
function generateLevel(number,random){
 const n=number%3===2?4:5,minLength=n+4,start=[Math.floor(random()*n),0],end=[Math.floor(random()*n),n-1];
 const path=[start],seen=new Set([start[0]*n]),budget={left:3500};
 function walk(row,col){
  if(row===end[0]&&col===end[1])return path.length>=minLength;
  if(--budget.left<=0)return false;
  const options=shuffle([[row-1,col],[row+1,col],[row,col-1],[row,col+1]].filter(([r,c])=>r>=0&&r<n&&c>=0&&c<n&&!seen.has(r*n+c)),random);
  for(const cell of options){if(budget.left<=0)break;const key=cell[0]*n+cell[1];seen.add(key);path.push(cell);if(walk(...cell))return true;path.pop();seen.delete(key);}
  return false;
 }
 if(!walk(...start)){
  // Bounded construction always has a solvable fallback, including constant RNGs.
  path.length=0;let row=start[0];path.push([row,0]);
  for(let col=0;col<n;col++){const target=col===n-1?end[0]:(col%2===0?n-1:0);while(row!==target){row+=Math.sign(target-row);path.push([row,col]);}if(col<n-1)path.push([row,col+1]);}
 }
 const route=new Set(path.map(([r,c])=>r*n+c)),blocked=[];
 for(let i=0;i<n*n;i++)if(!route.has(i)&&random()<.45)blocked.push([Math.floor(i/n),i%n]);
 const count=n===4?2:3,relays=Array.from({length:count},(_,i)=>path[Math.floor((i+1)*(path.length-1)/(count+1))]);
 return{name:places[(number-2)%places.length],district:String(number+1).padStart(2,'0'),n,path,relays,blocked,message:'Another corner of Pune, connected. Your next signal is waiting.'};
}
function rotate(mask,turns=1){for(let i=0;i<((turns%4)+4)%4;i++)mask=((mask<<1)&15)|(mask>>3);return mask;}
function direction(a,b){const dr=b[0]-a[0],dc=b[1]-a[1];if(dr===-1&&dc===0)return N;if(dr===1&&dc===0)return S;if(dc===-1&&dr===0)return W;if(dc===1&&dr===0)return E;throw new Error('Non-adjacent route cells');}
function makeLevel(number,random=Math.random){
if(!Number.isSafeInteger(number)||number<0)throw new Error('Invalid level');
const level=levels[number]||generateLevel(number,random);const{n,path}=level;
const cells=Array.from({length:n*n},(_,index)=>({base:index%3===0?N|S:N|E,turns:Math.floor(random()*4),blocked:false,relay:false,solution:null}));
for(const[r,c]of level.blocked)cells[r*n+c].blocked=true;
for(let i=0;i<path.length;i++){const incoming=i===0?W:direction(path[i],path[i-1]),outgoing=i===path.length-1?E:direction(path[i],path[i+1]);const cell=cells[path[i][0]*n+path[i][1]];cell.base=incoming|outgoing;cell.solution=cell.base;cell.turns=1+Math.floor(random()*3);}
for(const[r,c]of level.relays)cells[r*n+c].relay=true;
const state={number,name:level.name,district:level.district,message:level.message,n,cells,start:path[0][0]*n+path[0][1],end:path[path.length-1][0]*n+path[path.length-1][1],relays:level.relays.map(([r,c])=>r*n+c),route:path.map(([r,c])=>r*n+c)};
if(trace(state).solved)cells[state.start].turns=(cells[state.start].turns+1)%4;
state.initialTurns=cells.map(cell=>cell.turns);return state;
}
function maskAt(state,index){return rotate(state.cells[index].base,state.cells[index].turns);}
function trace(state){
const visited=[],seen=new Set();let index=state.start,incoming=W;
const finish=(solved,reason,failIndex=index)=>({solved,reason,visited,failIndex,relays:state.relays.filter(i=>seen.has(i))});
for(let count=0;count<=state.n*state.n;count++){
if(seen.has(index))return finish(false,'loop');const cell=state.cells[index];if(!cell||cell.blocked)return finish(false,'blocked');
const mask=maskAt(state,index);if(!(mask&incoming))return finish(false,'disconnected');visited.push(index);seen.add(index);const outgoing=mask^incoming;if(!delta[outgoing])return finish(false,'invalid');
if(index===state.end&&outgoing===E){const complete=state.relays.every(i=>seen.has(i));return finish(complete,complete?'connected':'missing-relay',null);}
const[dr,dc]=delta[outgoing],row=Math.floor(index/state.n)+dr,col=index%state.n+dc;if(row<0||col<0||row>=state.n||col>=state.n)return finish(false,'open-end');index=row*state.n+col;incoming=opposite[outgoing];
}return finish(false,'loop');
}
function turn(state,index){if(!state.cells[index]||state.cells[index].blocked)return false;state.cells[index].turns=(state.cells[index].turns+1)%4;return true;}
function hint(state){return state.route.find(i=>maskAt(state,i)!==state.cells[i].solution)??null;}
return{N,E,S,W,levels,rotate,makeLevel,maskAt,trace,turn,hint};
});
