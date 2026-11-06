/* ===== APP ===== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const OM=Object.fromEntries(O.map(o=>[o.id,o])), FM=Object.fromEntries(F.map(x=>[x.id,x]));
let S={boxes:{},plan:{},sp:{},spb:{},set:{lvl:'easy',scope:'auto',unl:4}};
try{Object.assign(S,JSON.parse(localStorage.getItem('pf-tiburones-v1')||'{}'))}catch(e){}
S.set=Object.assign({lvl:'easy',scope:'auto',unl:4,npd:10,names:'es'},S.set||{});S.srs=S.srs||{};S.hist=S.hist||{};S.day=S.day||{d:0,n:0};
const save=()=>{try{localStorage.setItem('pf-tiburones-v1',JSON.stringify(S))}catch(e){}};
const box=id=>S.boxes[id]||0;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ALLTAGS=['Sin aleta anal','Espinas dorsales','Aguas profundas','Bioluminiscentes','Aplanados','Filtradores','Barbillones','Hocico/cabeza rara','Cola larguísima'];
const NOANAL=['SQU','ECH','PRI','SQT'];
const tagsOf=x=>NOANAL.includes(x.o)?['Sin aleta anal',...x.t]:x.t;

/* --- cabecera: una celda por familia, más opaca cuanto mejor la sabes --- */
function paintHead(){
  $('#strip').style.gridTemplateColumns=`repeat(${F.length},1fr)`;
  $('#strip').innerHTML=F.map(x=>`<i class="oc" style="--h:${OM[x.o].h};opacity:${.2+.2*famLevel(x.id)}"></i>`).join('');
  $('#pc').textContent=`${knownCount('f')} de ${F.length} familias · ${knownCount('s')} de ${SP.length} especies`;
  $('#pt').textContent=`${O.length} órdenes`;
}

/* --- especies --- */
let SP=[],SPF={},SPM={},PARTS=[];
const PM=()=>Object.fromEntries(PARTS.map(p=>[p.id,p]));
const partFig=p=>p?`<figure class="part"><img src="${esc(p.file)}" alt="${esc(p.t)}" loading="lazy"><figcaption><b>${esc(p.t)}</b><br>${esc(p.d)}<br><a class="cr" href="${esc(p.url)}" target="_blank" rel="noopener">foto: ${esc((p.author||'').slice(0,40))} · ${esc(p.license)}</a></figcaption></figure>`:'';
const IUCN={'critically endangered':'CR','endangered':'EN','vulnerable':'VU','near threatened':'NT','least concern':'LC','data deficient':'DD'};
const iu=x=>IUCN[(x.iucn||'').toLowerCase()]||'';
const nameEs=()=>(S.set.names||'es')==='es';
const cname=x=>nameEs()&&x.es?x.es:x.n;
const nmS=x=>nameEs()&&x.es?`<b>${esc(x.es)}</b> <span class="la">${esc(x.n)}</span>`:`<b><i>${esc(x.n)}</i></b>`;
function initSp(){
  SPF={};SPM={};
  SP.forEach(x=>{(SPF[x.f]=SPF[x.f]||[]).push(x);SPM[x.id]=x});
  F.forEach(x=>{if(SPF[x.id])x.n=SPF[x.id].length});
  O.forEach(o=>{const c=F.filter(x=>x.o===o.id).reduce((a,x)=>a+x.n,0);if(c)o.ct=c});
}
const photo=(x,cls='')=>x.img?`<img class="ph ${cls}" loading="lazy" src="${esc(x.img.file)}" alt="${esc(cname(x)||x.n)}" width="96" height="64">`:'';
const credit=x=>x.img?`<a class="cr" href="${esc(x.img.url)}" target="_blank" rel="noopener">foto: ${esc((x.img.author||'').slice(0,40))} · ${esc(x.img.license)}</a>`:'';
function spList(fid){
  const L=SPF[fid]||[];const by={};L.forEach(x=>(by[x.g]=by[x.g]||[]).push(x));
  return Object.keys(by).sort().map(g=>`<div class="gen"><div class="mono"><i>${esc(g)}</i> · ${by[g].length}</div>${by[g].map(spRow).join('')}</div>`).join('');
}
const spRow=x=>`<div class="sp"><label class="spk"><input type="checkbox" data-sp="${x.id}" ${S.sp[x.id]?'checked':''} aria-label="La sé: ${esc(x.n)}"></label>${photo(x).replace('<img ','<img data-sheet="'+x.id+'" ')}<div class="spt" data-sheet="${x.id}">${nmS(x)}<div class="row" style="gap:6px;margin-top:2px">${iu(x)?`<span class="tag iu iu-${iu(x)}">${iu(x)}</span>`:''}${credit(x)}</div></div></div>`;

/* --- familias --- */
const nm=e=>e[0]?`<b>${esc(e[0])}</b> <span class="la">${esc(e[1])}</span>`:`<span class="la">${esc(e[1])}</span>`;
const famBody=x=>`<div class="fb"><p class="mono">${OM[x.o].es} · ~${x.n} especies</p><ul>${x.r.map(r=>`<li>${esc(r)}</li>`).join('')}</ul><p class="hook">${esc(x.g)}</p>${SPF[x.id]?spList(x.id):`<ul class="ej">${x.ej.map(e=>`<li>${nm(e)}</li>`).join('')}</ul>`}</div>`;
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
   ['c','Llegar a todas las familias dominadas.']]},
 {k:'p6',t:'Semanas 5–8',h:'Especies',d:'Con la familia fijada, cada especie cuelga de ella. Empieza por las cinco familias que suman casi dos tercios de las especies: Scyliorhinidae, Carcharhinidae, Etmopteridae, Triakidae y Squalidae.',tasks:[
   ['a','Aprender los ejemplos de esas 5 familias.'],
   ['b','Añadir 3 especies más por familia (de tu lista).'],
   ['c','Recorrer las demás familias de una en una.']]},
 {k:'p7',t:'Siempre',h:'Repaso espaciado',d:'Vuelve a Estudiar los días 1, 3, 7, 14 y 30 después de cada bloque. La app prioriza solas las familias que fallas.',go:'estudiar',tasks:[]}
];
function count(){const t=PH.reduce((a,p)=>a+p.tasks.length,0),d=Object.values(S.plan).filter(Boolean).length;const e=$('#pcount');if(e)e.textContent=`${d} de ${t} tareas`}
function planHtml(){
  return `<h2>Plan de 8 semanas</h2><p class="lede">36 familias en 9 órdenes y 571 especies. Primero aprendes a mirar (aletas, boca, branquias), luego los nombres, y al final las especies, que cuelgan de su familia.</p>`+
  PH.map(p=>`<div class="card phase"><div class="mono">${p.t}</div><h3>${p.h}</h3><p>${esc(p.d)}</p>${p.tasks.map(t=>{const id=p.k+t[0];return `<label class="task"><input type="checkbox" data-t="${id}" ${S.plan[id]?'checked':''}><span>${esc(t[1])}</span></label>`}).join('')}${p.go?`<div class="row" style="margin-top:10px"><button class="btn" data-go="${p.go}">Ir a ${({clave:"Clave",explorar:"Explorar",estudiar:"Estudiar"})[p.go]}</button></div>`:''}</div>`).join('')+
  `<p class="mono" id="pcount"></p><div class="row" style="margin-top:6px"><button class="btn" data-reset="1">Borrar mi progreso</button></div>`;
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
const KEYPART={q1:'anal',q2:'plano',q3:'sierra',q3b:'dent',q4:'bran',q5:'espina',q6:'barb',q7:'nict'};
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
    h+=`<div class="card">${partFig(PM()[KEYPART[node]])}<p class="q">${KEY[node][0]}</p><div class="row"><button class="btn pri" data-k="1">Sí</button><button class="btn" data-k="0">No</button>${kp.length?'<button class="btn" data-k="back">Atrás</button>':''}</div></div>`;
  }
  $('#v-clave').innerHTML=h;
}

/* --- EXPLORAR --- */
let ftag='',openO=null,qtext='';
function vExp(){
  let h=`<h2>Explorar</h2><p class="lede">Toca un orden para ver sus familias. En las siluetas, los triángulos dorados son espinas dorsales y los puntos dorados del vientre son luces (fotóforos).</p>`;
  h+=`<input id="q" class="search" type="search" placeholder="Buscar especie (científico, español o inglés)" value="${esc(qtext)}" autocomplete="off"><div id="qres"></div>`;
  h+=`<div class="row" role="group" aria-label="Filtrar por rasgo">${ALLTAGS.map(t=>`<button class="chip" aria-pressed="${ftag===t}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div><div style="height:12px"></div>`;
  if(ftag){
    const fs=F.filter(x=>tagsOf(x).includes(ftag));
    h+=`<p class="mono">${fs.length} familias con: ${esc(ftag)}</p>`+fs.map(x=>famRow(x,true)).join('');
  }else h+=O.map(o=>{const fs=F.filter(x=>x.o===o.id);return `<details class="oc" style="--h:${o.h}" data-o="${o.id}" ${openO===o.id?'open':''}><summary><span class="dot"></span><div><h3>${o.es}</h3><span class="la">${o.com}</span><div class="mono">~${o.ct} especies · ${fs.length} fam.</div></div></summary><div class="ob"><p>${o.rule}</p>${fs.map(x=>famRow(x)).join('')}</div></details>`}).join('');
  $('#v-explorar').innerHTML=h;searchRes();
}
function searchRes(){
  const t=qtext.trim().toLowerCase(),el=$('#qres');if(!el)return;
  if(t.length<2){el.innerHTML='';return}
  const r=SP.filter(x=>(x.n+' '+x.es+' '+x.en).toLowerCase().includes(t));
  el.innerHTML=`<div class="card"><p class="mono">${r.length} especies${r.length>40?' (primeras 40)':''}</p>${r.slice(0,40).map(x=>`<div class="mono" style="margin-top:8px">${esc(FM[x.f].es)}</div>${spRow(x)}`).join('')}</div>`;
}

/* --- ESTUDIAR: repetición espaciada simple (cajas 0–4) --- */
let Q=null,last='',ses={a:0,n:0},armed=false,mode='ver';
function pickF(){
  const w=F.map(x=>x.id===last?0:5-box(x.id));let r=Math.random()*w.reduce((a,b)=>a+b,0);
  for(let i=0;i<F.length;i++){r-=w[i];if(r<=0)return F[i]}
  return F[0];
}
function newSpQ(){
  const pool=SP.filter(x=>x.id!==last&&(x.img||cname(x)));
  const w=pool.map(x=>6-(S.spb[x.id]||0));let r=Math.random()*w.reduce((a,b)=>a+b,0),x=pool[0];
  for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0){x=pool[i];break}}
  last=x.id;const f=FM[x.f];
  const dis=[...shuffle(SP.filter(y=>y.g===x.g&&y.id!==x.id)),...shuffle(SP.filter(y=>y.f===x.f&&y.g!==x.g)),...shuffle(SP.filter(y=>y.f!==x.f))].slice(0,3);
  Q={sp:x,f,ans:x.id,opts:shuffle([x,...dis]).map(y=>({id:y.id,a:cname(y)||y.n,b:''})),
     vis:x.img?`<img class="big" src="${esc(x.img.file)}" alt="Foto de tiburón a identificar">`:`<div style="max-width:300px;margin:0 auto 12px" class="neutral">${sil(f.s)}</div>`,
     p:x.img?'¿Qué especie es?':`¿Qué especie de <b>${esc(f.es)}</b> es?`,done:false};
  if(!x.img)Q.p=`¿Cómo se llama <i>${esc(x.n)}</i>? <span class="la">(${esc(f.es)})</span>`;
}
const wpick=(pool)=>{const w=pool.map(x=>6-(S.spb[x.id]||0));let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0)return pool[i]}return pool[0]};
const FAMORD=['lam','car','sph','ore','ste','rhi','alo','odo','cet','mit','meg','pse','gin','hem','par','bra','tri','sci','pen','het','sqt','pri','hex','chl','hmg','gal','lep','psu','pro','sqd','ctr','etm','som','oxy','dal','ech'];
const LVL={easy:3,mid:6,hard:0};
function vpool(){const all=SP.filter(x=>x.img);if(S.set.scope==='all')return all;const fs=new Set(FAMORD.slice(0,S.set.unl));return all.filter(x=>fs.has(x.f))}
function maybeUnlock(){
  if(S.set.scope!=='auto'||S.set.unl>=FAMORD.length)return '';
  const p=vpool(),m=p.filter(x=>(S.spb[x.id]||0)>=3).length;
  if(p.length&&m/p.length>=.7){S.set.unl=Math.min(FAMORD.length,S.set.unl+4);return `Nuevo bloque desbloqueado: ahora ${vpool().length} especies.`}
  return '';
}
function newVerQ(x0){
  const pool=x0?SP.filter(y=>y.img):vpool();const x=x0||wpick(pool.filter(y=>y.id!==last));last=x.id;
  const same=g=>pool.filter(y=>y.id!==x.id&&g(y));
  const n=LVL[S.set.lvl];
  const dis=n?[...shuffle(same(y=>y.g===x.g)),...shuffle(same(y=>y.f===x.f&&y.g!==x.g)),...shuffle(same(y=>FM[y.f].o===FM[x.f].o&&y.f!==x.f)),...shuffle(same(y=>FM[y.f].o!==FM[x.f].o))].slice(0,n-1):[];
  Q={sp:x,f:FM[x.f],ans:x.id,photo:true,hard:!n,done:false,key:'s:'+x.id,
     vis:`<img class="big" src="${esc(x.img.file)}" alt="Tiburón a identificar">`,
     opts:shuffle([x,...dis]).map(y=>({id:y.id,a:cname(y)||y.n,b:''})),
     p:'¿Qué tiburón es?'};
}
const lvlBar=()=>{const p=vpool(),m=p.filter(x=>(S.spb[x.id]||0)>=3).length;return `<div class="row" style="margin-bottom:6px">${[['easy','Fácil · 3'],['mid','Medio · 6'],['hard','Difícil · buscar']].map(([k,l])=>`<button class="chip" aria-pressed="${S.set.lvl===k}" data-lvl="${k}">${l}</button>`).join('')}</div><div class="row" style="margin-bottom:12px"><button class="chip" aria-pressed="${S.set.scope==='auto'}" data-scope="auto">Por bloques</button><button class="chip" aria-pressed="${S.set.scope==='all'}" data-scope="all">Todas (${SP.filter(x=>x.img).length})</button><span class="mono">${p.length} especies · ${m} dominadas</span></div>`};
function hardSearch(){
  const t=($('#ans')||{value:''}).value.trim().toLowerCase(),el=$('#ares');if(!el||Q.done)return;
  if(t.length<2){el.innerHTML='';return}
  el.innerHTML=SP.filter(x=>(x.n+' '+x.es+' '+x.en).toLowerCase().includes(t)).slice(0,8).map(x=>`<button class="opt" data-a="${x.id}">${esc(cname(x))}</button>`).join('')||'<p class="mono">Sin resultados</p>';
}
function newQ(x0){
  if(mode==='hoy'&&!x0)return newHoyQ();
  if(mode==='gen'&&SP.length&&!x0)return newGenQ();
  if(mode==='ver'&&SP.length)return newVerQ();
  if(mode==='sp'&&SP.length)return newSpQ();
  const x=x0||pickF();last=x.id;
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
const chips=()=>`<div class="row" style="margin-bottom:12px">${[['ver','Ver'],['gen','Géneros'],['card','Cartas'],['fam','Familias'],['sp','Nombres'],['parts','Partes']].map(([m,l])=>`<button class="chip" aria-pressed="${mode===m}" data-mode="${m}">${l}</button>`).join('')}</div>`;
const famPhotos=fid=>{const L=(SPF[fid]||[]).filter(x=>x.img);const pick=[];const gs=new Set();for(const x of L){if(!gs.has(x.g)){gs.add(x.g);pick.push(x)}if(pick.length>=3)break}return pick.length?`<div class="shots">${pick.map(x=>`<figure><img loading="lazy" src="${esc(x.img.file)}" alt="${esc(cname(x)||x.n)}"><figcaption>${nmS(x)}</figcaption></figure>`).join('')}</div>`:''};
const ORDPART={HEX:['bran'],SQU:['espina'],ECH:['dent'],PRI:['sierra'],SQT:['plano'],HET:['espina'],ORE:['barb'],LAM:['nict','dientes'],CAR:['nict']};
const partsFor=x=>{const m=PM(),L=(ORDPART[x.o]||[]).map(i=>m[i]).filter(Boolean);return L.length?`<p class="mono" style="margin-top:12px">Así se ve la clave de este grupo</p>${L.map(partFig).join('')}`:''};
function vParts(){
  $('#v-estudiar').innerHTML=`<h2>Estudiar</h2>${chips()}<p class="lede">Así se ven de verdad las partes que usa la Clave. Fotos reales de Wikimedia Commons.</p>${PARTS.map(partFig).join('')}`;
}
let CD=null,cshown=false;
function nextCard(){const ph=SP.filter(x=>x.img);CD=wpick(ph.filter(y=>y.id!==(CD&&CD.id)));cshown=false}
function vCard(){
  if(!CD)nextCard();const x=CD,f=FM[x.f];
  $('#v-estudiar').innerHTML=`<h2>Estudiar</h2>${chips()}<p class="mono">Mira la foto, piensa quién es y toca para comprobar</p><div class="card oc" style="--h:${OM[f.o].h}"><img class="big" src="${esc(x.img.file)}" alt="Tiburón a reconocer" style="max-height:340px">`+
  (cshown?`<h3 style="font-size:24px">${nmS(x)}</h3><p class="mono">${esc(f.es)} · <i>${esc(x.g)}</i> · dominio ${S.spb[x.id]||0}/5</p><p class="hook">${esc(f.g)}</p>${credit(x)}<div class="row" style="margin-top:12px"><button class="btn pri" data-card="1">La reconocía</button><button class="btn" data-card="0">No</button></div>`
   :`<div class="row"><button class="btn pri" data-card="show">Mostrar quién es</button></div>`)+`</div>`;
}
function vEst(){
  if(mode==='parts')return vParts();
  if(mode==='card')return vCard();
  if(!Q)newQ();
  if(Q.empty)return vHoyDone();
  const x=Q.f;
  let h=mode==='hoy'?hoyHead()+`<div class="card">${Q.vis}<p class="q">${Q.p}</p>`:`<h2>Estudiar</h2>${chips()}${(mode==='ver'||mode==='gen')?lvlBar():''}<p class="mono">${ses.a} de ${ses.n} acertadas en esta sesión</p><div class="card">${Q.vis}<p class="q">${Q.p}</p>`;
  if(Q.hard&&!Q.done)h+=`<input id="ans" class="search" type="search" placeholder="Escribe el nombre y elígelo" autocomplete="off"><div id="ares"></div>`;
  else if(Q.grid)h+=`<div class="pgrid">${Q.opts.map(o=>{let c='popt';if(Q.done){if(o.id===Q.ans)c+=' ok';else if(o.id===Q.pick)c+=' bad'}return `<button class="${c}" data-a="${o.id}" ${Q.done?'disabled':''} aria-label="Foto ${esc(o.a)}"><img src="${esc(o.img.file)}" alt="${Q.done?esc(o.a):'Foto de tiburón'}">${Q.done?`<span>${esc(o.a)}<small>${esc(o.b)}</small></span>`:''}</button>`}).join('')}</div>`;
  else h+=Q.opts.map(o=>{let c='opt';if(Q.done){if(o.id===Q.ans)c+=' ok';else if(o.id===Q.pick)c+=' bad'}return `<button class="${c}" data-a="${o.id}" ${Q.done?'disabled':''}>${esc(o.a)}<small>${esc(o.b)}</small></button>`}).join('');
  if(Q.done&&Q.gen)h+=genFeedback(x);
  else if(Q.done&&Q.sp)h+=`<div class="oc" style="--h:${OM[x.o].h};margin-top:14px">${partsFor(x)}<h3>${Q.pick===Q.ans?'<span style="color:var(--ok)">✓</span>':'<span style="color:var(--bad)">✗ Era</span>'} ${nmS(Q.sp)}</h3>${Q.msg?`<p class="hook">${esc(Q.msg)}</p>`:''}<p class="mono">${esc(x.es)} · género <i>${esc(Q.sp.g)}</i> · dominio ${S.spb[Q.sp.id]||0}/5</p>${credit(Q.sp)}<div class="row" style="margin-top:10px"><button class="btn pri" data-next="1">Siguiente</button><button class="btn" data-sheet="${Q.sp.id}">Ficha</button>${Q.pick!==Q.ans&&SPM[Q.pick]?`<button class="btn" data-cmp="${Q.sp.id},${Q.pick}">Comparar</button>`:''}</div></div>`;
  else if(Q.done)h+=`<div class="oc" style="--h:${OM[x.o].h};margin-top:14px">${famPhotos(x.id)}${partsFor(x)}<div style="max-width:300px;margin:0 auto">${sil(x.s,x.es)}</div><h3>${esc(x.es)} <span class="la" style="font-weight:400">${esc(x.la)}</span></h3><p class="mono">${OM[x.o].es} · dominio ${box(x.id)}/4</p><p class="hook">${esc(x.g)}</p><button class="btn pri" data-next="1">Siguiente</button></div>`;
  $(mode==='hoy'?'#v-hoy':'#v-estudiar').innerHTML=h+'</div>';
}
function answer(id){
  if(Q.done)return;
  Q.done=true;Q.pick=id;ses.n++;
  const ok=id===Q.ans;if(ok)ses.a++;
  if(Q.sp){S.spb[Q.sp.id]=ok?Math.min(5,(S.spb[Q.sp.id]||0)+1):0;if(S.spb[Q.sp.id]>=3)S.sp[Q.sp.id]=true}
  else if(!Q.gen)S.boxes[Q.f.id]=ok?Math.min(4,box(Q.f.id)+1):0;
  if(Q.photo&&Q.sp)Q.msg=maybeUnlock();
  srsGrade(Q.key||(Q.gen?'g:'+Q.gen:Q.sp?'s:'+Q.sp.id:'f:'+Q.f.id),ok);
  save();paintHead();vEst();
  const b=$('[data-next]');if(b)b.scrollIntoView({block:'nearest'});
}

/* --- navegación --- */
/* --- PENDIENTE: huecos del dataset + copia de seguridad --- */
const gl=(t,l)=>`<details style="border-left-width:1px"><summary style="min-height:48px"><div><b>${t}</b> <span class="mono">${l.length}</span></div></summary><div class="fb">${l.slice(0,60).map(x=>`<div style="padding:4px 0">${nmS(x)} ${links(x)}</div>`).join('')}${l.length>60?`<p class="mono">… y ${l.length-60} más</p>`:''}</div></details>`;
const links=x=>`<span class="mono"><a href="https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(x.n)}&ns6=1" target="_blank" rel="noopener">Commons</a> · <a href="https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(x.n)}" target="_blank" rel="noopener">iNat</a> · <a href="https://www.fishbase.se/summary/${encodeURIComponent(x.n.replace(' ','-'))}.html" target="_blank" rel="noopener">FishBase</a> · <a href="https://www.iucnredlist.org/search?query=${encodeURIComponent(x.n)}" target="_blank" rel="noopener">IUCN</a></span>`;
function pendHtml(){
  const nf=SP.filter(x=>!x.img),ne=SP.filter(x=>!x.es),ni=SP.filter(x=>!iu(x)),nn=SP.filter(x=>!x.es&&!x.en);
  return `<h2>Pendiente</h2><p class="lede">Huecos del catálogo para investigar. Cada especie enlaza a Commons, iNaturalist, FishBase e IUCN. Solo se usan fotos con licencia libre (CC0, CC-BY, CC-BY-SA, dominio público).</p>`+
   gl('Sin foto libre',nf)+gl('Sin nombre común en español',ne)+gl('Sin nombre común en ningún idioma',nn)+gl('Sin estado IUCN',ni)+
   `<h2>Copia de seguridad</h2><p class="lede">Tu progreso vive solo en este navegador. Exporta un archivo para no perderlo o pasarlo a otro dispositivo.</p><div class="row"><button class="btn pri" data-export="1">Exportar progreso</button><label class="btn" style="display:inline-flex;align-items:center">Importar<input type="file" accept="application/json" id="imp" hidden></label></div><p class="mono" style="margin-top:14px">Datos: Wikidata (CC0). Fotos: Wikimedia Commons, autor y licencia en cada foto.</p>`;
}
const VIEWS={hoy:()=>{if(mode!=='hoy'){mode='hoy';Q=null}vEst()},clave:vClave,explorar:vExp,estudiar:()=>{if(mode==='hoy'){mode='ver';Q=null}vEst()},plan:()=>vProg()};
let cur='';
function go(v){
  if(v==='pendiente')v='plan';
  if(!VIEWS[v])v='hoy';
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
  else if(d.card!==undefined){if(d.card==='show'){cshown=true}else{const k=CD.id,ok=d.card==='1';S.spb[k]=ok?Math.min(5,(S.spb[k]||0)+1):0;if(S.spb[k]>=3)S.sp[k]=true;save();paintHead();nextCard()}vCard();if(d.card!=='show')window.scrollTo(0,0)}
  else if(d.lvl){S.set.lvl=d.lvl;save();Q=null;vEst()}
  else if(d.scope){S.set.scope=d.scope;save();Q=null;vEst()}
  else if(d.mode){mode=d.mode;Q=null;CD=null;vEst();window.scrollTo(0,0)}
  else if(d.export){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='tiburones-progreso.json';a.click()}
  else if(d.a)answer(d.a);
  else if(d.next){newQ();vEst();window.scrollTo(0,0)}
  else if(d.reset){if(!armed){armed=true;b.textContent='¿Seguro? Pulsa otra vez'}else{S={boxes:{},plan:{},sp:{},spb:{},srs:{},hist:{},day:{d:0,n:0},set:{lvl:'easy',scope:'auto',unl:4,npd:10,names:'es'}};save();armed=false;paintHead();vProg()}}
});
document.addEventListener('input',e=>{if(e.target.id==='ans'){hardSearch();return}
  if(e.target.id==='q'){qtext=e.target.value;searchRes()}});
document.addEventListener('change',e=>{
  if(e.target.id==='imp'){const f=e.target.files[0];if(f)f.text().then(t=>{try{const j=JSON.parse(t);if(!j||typeof j!=='object'||!j.boxes)throw 0;S=Object.assign({boxes:{},plan:{},sp:{},spb:{},srs:{},hist:{},day:{d:0,n:0},set:{}},j);S.set=Object.assign({lvl:'easy',scope:'auto',unl:4,npd:10,names:'es'},S.set||{});save();paintHead();vProg();alert('Progreso importado')}catch(_){alert('Archivo no válido')}});return}
  if(e.target.dataset&&e.target.dataset.sp){S.sp[e.target.dataset.sp]=e.target.checked;save();paintHead();return}const t=e.target.dataset&&e.target.dataset.t;if(t){S.plan[t]=e.target.checked;save();count()}});
Promise.all([fetch('data/species.json').then(r=>r.json()).catch(()=>[]),fetch('data/parts.json').then(r=>r.json()).catch(()=>[])]).then(([d,pp])=>{SP=d;PARTS=pp;initSp();initLearn();paintHead();go(location.hash.slice(1)||'hoy')});
