/* ===== APP ===== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const OM=Object.fromEntries(O.map(o=>[o.id,o])), FM=Object.fromEntries(F.map(x=>[x.id,x]));
let S={boxes:{},plan:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem('pf-tiburones-v1')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('pf-tiburones-v1',JSON.stringify(S))}catch(e){}};
const box=id=>S.boxes[id]||0;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ALLTAGS=['Sin aleta anal','Espinas dorsales','Aguas profundas','Bioluminiscentes','Aplanados','Filtradores','Barbillones','Hocico/cabeza rara','Cola larguísima'];
const NOANAL=['SQU','ECH','PRI','SQT'];
const tagsOf=x=>NOANAL.includes(x.o)?['Sin aleta anal',...x.t]:x.t;

/* --- cabecera: una celda por familia, más opaca cuanto mejor la sabes --- */
function paintHead(){
  $('#strip').innerHTML=F.map(x=>`<i class="oc" style="--h:${OM[x.o].h};opacity:${.2+.2*box(x.id)}"></i>`).join('');
  $('#pc').textContent=`${F.filter(x=>box(x.id)>=3).length} de 34 dominadas`;
}

/* --- familias --- */
const nm=e=>e[0]?`<b>${esc(e[0])}</b> <span class="la">${esc(e[1])}</span>`:`<span class="la">${esc(e[1])}</span>`;
const famBody=x=>`<div class="fb"><p class="mono">${OM[x.o].es} · ~${x.n} especies</p><ul>${x.r.map(r=>`<li>${esc(r)}</li>`).join('')}</ul><p class="hook">${esc(x.g)}</p><ul class="ej">${x.ej.map(e=>`<li>${nm(e)}</li>`).join('')}</ul></div>`;
const famRow=(x,showO)=>`<details class="oc" style="--h:${OM[x.o].h}"><summary><div class="sw">${sil(x.s,x.es)}</div><div><h3>${esc(x.es)}</h3><span class="la">${esc(x.la)}</span>${showO?`<div class="mono">${OM[x.o].es}</div>`:''}</div></summary>${famBody(x)}</details>`;

/* --- PLAN --- */
const PH=[
 {k:'p1',t:'Días 1–3',h:'Los 9 órdenes con tres preguntas',d:'10 minutos al día. Antes de nombrar nada, aprende a mirar: aleta anal, dorsales y párpado.',go:'clave',tasks:[
   ['a','Recorre la Clave 5 veces, cada una pensando en un tiburón que ya conozcas.'],
   ['b','Repite de memoria: ¿aleta anal? ¿cuántas dorsales y con espina? ¿membrana nictitante?'],
   ['c','Nombra los 9 órdenes asociándolos a su color en Explorar.']]},
 {k:'p2',t:'Semana 1',h:'Los dos órdenes famosos',d:'Lamniformes (7 familias) y Orectolobiformes (7). Son pocos y muy distintos entre sí.',go:'explorar',tasks:[
   ['a','Lamniformes: ver las 7 siluetas y decir el rasgo clave de cada una.'],
   ['b','Orectolobiformes: lo mismo con sus 7 familias.'],
   ['c','En Estudiar, dominar 10 de estas 14 familias.']]},
 {k:'p3',t:'Semana 2',h:'Los cinco órdenes pequeños',d:'Hexanchiformes, Echinorhiniformes, Pristiophoriformes, Squatiniformes y Heterodontiformes: 6 familias con un rasgo que no se confunde.',go:'explorar',tasks:[
   ['a','Ver las 6 familias y fijar su rasgo único (6–7 branquias, clavos, sierra, plano, anal + espinas).'],
   ['b','En Estudiar, dominar las 6.']]},
 {k:'p4',t:'Semana 3',h:'Squaliformes',d:'6 familias sin aleta anal. Se distinguen por espinas, forma del cuerpo y luces.',go:'explorar',tasks:[
   ['a','Ver las 6 familias y compararlas con el filtro "Espinas dorsales".'],
   ['b','En Estudiar, dominar las 6.']]},
 {k:'p5',t:'Semana 4',h:'Carcharhiniformes',d:'8 familias con membrana nictitante. Es el orden más grande: cerca de 290 especies.',go:'explorar',tasks:[
   ['a','Ver las 8 familias.'],
   ['b','En Estudiar, dominar las 8.'],
   ['c','Llegar a 34 familias dominadas.']]},
 {k:'p6',t:'Semanas 5–8',h:'Especies',d:'Con la familia fijada, cada especie cuelga de ella. Empieza por las cinco familias que suman casi dos tercios de las especies: Scyliorhinidae, Carcharhinidae, Etmopteridae, Triakidae y Squalidae.',tasks:[
   ['a','Aprender los ejemplos de esas 5 familias.'],
   ['b','Añadir 3 especies más por familia (de tu lista).'],
   ['c','Recorrer las demás familias de una en una.']]},
 {k:'p7',t:'Siempre',h:'Repaso espaciado',d:'Vuelve a Estudiar los días 1, 3, 7, 14 y 30 después de cada bloque. La app prioriza solas las familias que fallas.',go:'estudiar',tasks:[]}
];
function count(){const t=PH.reduce((a,p)=>a+p.tasks.length,0),d=Object.values(S.plan).filter(Boolean).length;const e=$('#pcount');if(e)e.textContent=`${d} de ${t} tareas`}
function vPlan(){
  $('#v-plan').innerHTML=`<h2>Plan de 8 semanas</h2><p class="lede">34 familias en 9 órdenes. Primero aprendes a mirar (aletas, boca, branquias), luego los nombres, y al final las especies, que cuelgan de su familia.</p>`+
  PH.map(p=>`<div class="card phase"><div class="mono">${p.t}</div><h3>${p.h}</h3><p>${esc(p.d)}</p>${p.tasks.map(t=>{const id=p.k+t[0];return `<label class="task"><input type="checkbox" data-t="${id}" ${S.plan[id]?'checked':''}><span>${esc(t[1])}</span></label>`}).join('')}${p.go?`<div class="row" style="margin-top:10px"><button class="btn" data-go="${p.go}">Ir a ${({clave:"Clave",explorar:"Explorar",estudiar:"Estudiar"})[p.go]}</button></div>`:''}</div>`).join('')+
  `<p class="mono" id="pcount"></p><div class="row" style="margin-top:6px"><button class="btn" data-reset="1">Borrar mi progreso</button></div>`;
  count();
}

/* --- CLAVE: [pregunta, si, no, etiqueta] --- */
const KEY={
 q1:['¿Tiene aleta anal? Es la aleta pequeña del vientre, justo antes de la cola.','q4','q2','Aleta anal'],
 q2:['¿El cuerpo es plano como una raya y la boca está en la punta del hocico?','SQT','q3','Cuerpo plano'],
 q3:['¿El hocico acaba en una sierra con dos barbillones?','PRI','q3b','Sierra'],
 q3b:['¿Las dorsales son pequeñas y muy retrasadas, y la piel lleva grandes dentículos como clavos?','ECH','SQU','Clavos'],
 q4:['¿Tiene una sola aleta dorsal (y 6 o 7 branquias)?','HEX','q5','Una dorsal'],
 q5:['¿Hay una espina delante de cada dorsal y una cresta sobre los ojos?','HET','q6','Espinas'],
 q6:['¿La boca está delante de los ojos y hay barbillones junto a las narinas?','ORE','q7','Barbillones'],
 q7:['¿Los ojos tienen membrana nictitante, un tercer párpado que sube desde abajo?','CAR','LAM','Membrana nictitante']
};
let kp=[];
function vClave(){
  let node='q1';const cr=[];
  kp.forEach(a=>{cr.push(`${KEY[node][3]}: ${a?'sí':'no'}`);node=a?KEY[node][1]:KEY[node][2]});
  let h=`<h2>Clave de órdenes</h2>`;
  if(!kp.length)h+=`<p class="lede">Responde sí o no mirando al tiburón. En cuatro preguntas como máximo llegas a su orden.</p>`;
  if(cr.length)h+=`<div class="crumbs">${cr.map(c=>`<span class="tag">${esc(c)}</span>`).join('')}</div>`;
  if(OM[node]){
    const o=OM[node],fs=F.filter(x=>x.o===node);
    h+=`<div class="card oc" style="--h:${o.h}"><div class="row"><span class="dot"></span><span class="mono">Orden</span></div><h3 style="font-size:28px;margin-top:6px">${o.es}</h3><p class="la">${o.com} · ~${o.ct} especies</p><p>${o.rule}</p><div class="minis">${fs.map(x=>`<figure>${sil(x.s,x.es)}<figcaption>${esc(x.es)}</figcaption></figure>`).join('')}</div><div class="row"><button class="btn pri" data-open="${node}">Ver familias</button><button class="btn" data-k="reset">Otra vez</button></div></div>`;
  }else{
    h+=`<div class="card"><p class="q">${KEY[node][0]}</p><div class="row"><button class="btn pri" data-k="1">Sí</button><button class="btn" data-k="0">No</button>${kp.length?'<button class="btn" data-k="back">Atrás</button>':''}</div></div>`;
  }
  $('#v-clave').innerHTML=h;
}

/* --- EXPLORAR --- */
let ftag='',openO=null;
function vExp(){
  let h=`<h2>Explorar</h2><p class="lede">Toca un orden para ver sus familias. En las siluetas, los triángulos dorados son espinas dorsales y los puntos dorados del vientre son luces (fotóforos).</p>`;
  h+=`<div class="row" role="group" aria-label="Filtrar por rasgo">${ALLTAGS.map(t=>`<button class="chip" aria-pressed="${ftag===t}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div><div style="height:12px"></div>`;
  if(ftag){
    const fs=F.filter(x=>tagsOf(x).includes(ftag));
    h+=`<p class="mono">${fs.length} familias con: ${esc(ftag)}</p>`+fs.map(x=>famRow(x,true)).join('');
  }else h+=O.map(o=>{const fs=F.filter(x=>x.o===o.id);return `<details class="oc" style="--h:${o.h}" data-o="${o.id}" ${openO===o.id?'open':''}><summary><span class="dot"></span><div><h3>${o.es}</h3><span class="la">${o.com}</span><div class="mono">~${o.ct} especies · ${fs.length} fam.</div></div></summary><div class="ob"><p>${o.rule}</p>${fs.map(x=>famRow(x)).join('')}</div></details>`}).join('');
  $('#v-explorar').innerHTML=h;
}

/* --- ESTUDIAR: repetición espaciada simple (cajas 0–4) --- */
let Q=null,last='',ses={a:0,n:0},armed=false;
function pickF(){
  const w=F.map(x=>x.id===last?0:5-box(x.id));let r=Math.random()*w.reduce((a,b)=>a+b,0);
  for(let i=0;i<F.length;i++){r-=w[i];if(r<=0)return F[i]}
  return F[0];
}
function newQ(){
  const x=pickF();last=x.id;
  const t=['sil','rasgo','orden'][Math.floor(Math.random()*3)];
  if(t==='orden'){
    const oth=shuffle(O.filter(o=>o.id!==x.o)).slice(0,3);
    Q={f:x,ans:x.o,vis:'',opts:shuffle([OM[x.o],...oth]).map(o=>({id:o.id,a:o.es,b:o.com})),
       p:`¿A qué orden pertenece <b>${esc(x.es)}</b> <i>${esc(x.la)}</i>?`};
  }else{
    const dis=(t==='sil'?[...shuffle(F.filter(y=>y.o===x.o&&y.id!==x.id)),...shuffle(F.filter(y=>y.o!==x.o))]:shuffle(F.filter(y=>y.id!==x.id))).slice(0,3);
    const uniq=x.r.filter(r=>!dis.some(d=>d.r.includes(r)));
    const rs=shuffle(uniq.length?uniq:x.r).slice(0,2);
    Q={f:x,ans:x.id,opts:shuffle([x,...dis]).map(y=>({id:y.id,a:y.es,b:y.la})),
       vis:t==='sil'?`<div class="neutral" style="max-width:300px;margin:0 auto 12px">${sil(x.s)}</div>`:'',
       p:t==='sil'?'¿De qué familia es esta silueta?':`¿Qué familia cumple esto?<ul>${rs.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`};
  }
  Q.done=false;
}
function vEst(){
  if(!Q)newQ();
  const x=Q.f;
  let h=`<h2>Estudiar</h2><p class="mono">${ses.a} de ${ses.n} acertadas en esta sesión</p><div class="card">${Q.vis}<p class="q">${Q.p}</p>`;
  h+=Q.opts.map(o=>{let c='opt';if(Q.done){if(o.id===Q.ans)c+=' ok';else if(o.id===Q.pick)c+=' bad'}return `<button class="${c}" data-a="${o.id}" ${Q.done?'disabled':''}>${esc(o.a)}<small>${esc(o.b)}</small></button>`}).join('');
  if(Q.done)h+=`<div class="oc" style="--h:${OM[x.o].h};margin-top:14px"><div style="max-width:300px;margin:0 auto">${sil(x.s,x.es)}</div><h3>${esc(x.es)} <span class="la" style="font-weight:400">${esc(x.la)}</span></h3><p class="mono">${OM[x.o].es} · dominio ${box(x.id)}/4</p><p class="hook">${esc(x.g)}</p><button class="btn pri" data-next="1">Siguiente</button></div>`;
  $('#v-estudiar').innerHTML=h+'</div>';
}
function answer(id){
  if(Q.done)return;
  Q.done=true;Q.pick=id;ses.n++;
  const ok=id===Q.ans;if(ok)ses.a++;
  S.boxes[Q.f.id]=ok?Math.min(4,box(Q.f.id)+1):0;save();paintHead();vEst();
  const b=$('[data-next]');if(b)b.scrollIntoView({block:'nearest'});
}

/* --- navegación --- */
const VIEWS={plan:vPlan,clave:vClave,explorar:vExp,estudiar:vEst};
let cur='';
function go(v){
  if(!VIEWS[v])v='plan';
  cur=v;
  for(const k in VIEWS)$('#v-'+k).hidden=k!==v;
  document.querySelectorAll('#tabs button').forEach(b=>{if(b.dataset.v===v)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  VIEWS[v]();window.scrollTo(0,0);
  if(location.hash!=='#'+v)location.hash=v;
}
addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(v!==cur)go(v)});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.v||d.go)go(d.v||d.go);
  else if(d.k!==undefined){if(d.k==='reset')kp=[];else if(d.k==='back')kp.pop();else kp.push(d.k==='1');vClave()}
  else if(d.open){openO=d.open;ftag='';go('explorar');const el=document.querySelector(`[data-o="${openO}"]`);if(el)el.scrollIntoView({block:'start'})}
  else if(d.tag!==undefined){ftag=ftag===d.tag?'':d.tag;vExp()}
  else if(d.a)answer(d.a);
  else if(d.next){newQ();vEst();window.scrollTo(0,0)}
  else if(d.reset){if(!armed){armed=true;b.textContent='¿Seguro? Pulsa otra vez'}else{S={boxes:{},plan:{}};save();armed=false;paintHead();vPlan()}}
});
document.addEventListener('change',e=>{const t=e.target.dataset&&e.target.dataset.t;if(t){S.plan[t]=e.target.checked;save();count()}});
paintHead();
go(location.hash.slice(1)||'plan');
