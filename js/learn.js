/* ===== APRENDIZAJE: repaso espaciado, Hoy, géneros, ficha, comparador y progreso ===== */
const DAYMS=864e5;
const todayN=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/DAYMS);
const dstr=n=>new Date(n*DAYMS).toISOString().slice(0,10);
const INTV=[1,3,7,14,30,60];            // días hasta el siguiente repaso tras cada acierto seguido
const KNOWN=2;                           // "dominado": ha superado el repaso de 3 días
let GEN={},GENL=[];                      // géneros: {nombre:{f,sp:[]}}
const NPD=()=>S.set.npd||10;

/* --- SRS: cada elemento (f:familia, g:género, s:especie) = {i,due,lap,rep} --- */
function srsGrade(k,ok){
  const t=todayN();
  if(S.day.d!==t)S.day={d:t,n:0};
  let c=S.srs[k];
  if(!c){c=S.srs[k]={i:-1,due:t,lap:0,rep:0};S.day.n++}
  if(ok){c.i=Math.min(INTV.length-1,c.i+1);c.due=t+INTV[c.i];c.rep++}
  else{c.i=-1;c.due=t;c.lap++}
  const h=S.hist[dstr(t)]||(S.hist[dstr(t)]={a:0,n:0});h.n++;if(ok)h.a++;
}
const isKnown=k=>S.srs[k]&&S.srs[k].i>=KNOWN;
function knownCount(type){
  if(type==='f')return F.filter(x=>isKnown('f:'+x.id)||box(x.id)>=3).length;
  if(type==='g')return GENL.filter(g=>isKnown('g:'+g)).length;
  return SP.filter(x=>isKnown('s:'+x.id)||S.sp[x.id]).length;
}
const famLevel=id=>{const c=S.srs['f:'+id];return Math.max(box(id),c?Math.max(0,Math.min(4,c.i+1)):0)};
function streak(){
  let t=todayN(),n=0;if(!(S.hist[dstr(t)]&&S.hist[dstr(t)].n))t--;
  while(S.hist[dstr(t)]&&S.hist[dstr(t)].n){n++;t--}
  return n;
}
function initLearn(){
  GEN={};SP.forEach(x=>{(GEN[x.g]=GEN[x.g]||{f:x.f,sp:[]}).sp.push(x)});
  GENL=Object.keys(GEN);
}
function validKey(k){
  const [t,id]=[k[0],k.slice(2)];
  if(t==='f')return !!FM[id];
  if(t==='g')return !!(GEN[id]&&GEN[id].sp.some(s=>s.img));
  return !!(SPM[id]&&SPM[id].img);
}
const dueKeys=()=>{const t=todayN();return Object.entries(S.srs).filter(([k,c])=>c.due<=t&&validKey(k)).sort((a,b)=>a[1].due-b[1].due||a[1].i-b[1].i).map(e=>e[0])};
/* nuevas, de arriba abajo: familia → sus géneros → sus especies (solo si el nivel superior ya se ha acertado) */
function newCands(){
  const out=[];
  for(const fid of FAMORD){
    const fk='f:'+fid,fc=S.srs[fk];
    if(!fc){out.push(fk);continue}
    if(fc.i<0)continue;
    const gs=[...new Set((SPF[fid]||[]).map(x=>x.g))].sort();
    for(const g of gs){
      const gk='g:'+g,gc=S.srs[gk];
      if(!gc){if(validKey(gk))out.push(gk);continue}
      if(gc.i<0)continue;
      GEN[g].sp.filter(x=>x.img&&!S.srs['s:'+x.id]).forEach(x=>out.push('s:'+x.id));
    }
  }
  return out;
}
const HOY={recent:[]};
const allowance=()=>{const t=todayN();if(S.day.d!==t)S.day={d:t,n:0};return Math.max(0,NPD()-S.day.n)};
function pickHoy(){
  const rec=HOY.recent,due=dueKeys();
  let k=due.find(x=>!rec.includes(x));
  if(!k&&allowance()>0)k=newCands().find(x=>!rec.includes(x));
  if(!k)k=due[0];
  if(!k)return null;
  rec.push(k);if(rec.length>3)rec.shift();
  return k;
}
function newHoyQ(){
  const k=pickHoy();
  if(!k){Q={empty:true,done:false};return}
  const id=k.slice(2);
  if(k[0]==='f'){newQ(FM[id])}
  else if(k[0]==='g'){genQ(id)}
  else newVerQ(SPM[id]);
  Q.key=k;Q.done=false;
}
function hoyHead(){
  const due=dueKeys().length,nw=Math.min(allowance(),newCands().length);
  return `<h2>Hoy</h2><div class="stats3"><div><b>${due}</b><span>para repasar</span></div><div><b>${nw}</b><span>nuevas</span></div><div><b>${streak()}</b><span>días de racha</span></div></div>
  <div class="row" style="margin-bottom:12px">${[['easy','Fácil · 3'],['mid','Medio · 6'],['hard','Difícil · buscar']].map(([k,l])=>`<button class="chip" aria-pressed="${S.set.lvl===k}" data-lvl="${k}">${l}</button>`).join('')}</div>`;
}
function vHoyDone(){
  const t=todayN(),tom=Object.values(S.srs).filter(c=>c.due===t+1).length,h=S.hist[dstr(t)]||{a:0,n:0};
  $('#v-hoy').innerHTML=hoyHead()+`<div class="card"><h3 style="font-size:24px">Hecho por hoy ✓</h3><p>${h.n?`Hoy has respondido ${h.n} (${h.a} bien).`:'No hay nada pendiente.'} Mañana tendrás ${tom} para repasar.</p><p class="mono">Los fallos vuelven a salir al día siguiente y los aciertos se espacian: 1, 3, 7, 14, 30 días.</p><div class="row"><button class="btn pri" data-hoymore="1">+5 nuevas</button><button class="btn" data-mode="ver" data-gostudy="1">Practicar libre</button></div></div>`;
}

/* --- géneros: foto -> género --- */
function genQ(g){
  const G=GEN[g],x=shuffle(G.sp.filter(s=>s.img))[0];last=x.id;
  const n=LVL[S.set.lvl]||6,fam=FM[G.f];
  const same=Object.keys(GEN).filter(h=>h!==g&&GEN[h].sp.some(s=>s.img));
  const dis=n?[...shuffle(same.filter(h=>GEN[h].f===G.f)),...shuffle(same.filter(h=>GEN[h].f!==G.f&&FM[GEN[h].f].o===fam.o)),...shuffle(same.filter(h=>FM[GEN[h].f].o!==fam.o))].slice(0,n-1):[];
  Q={gen:g,sp:undefined,f:fam,ans:g,photo:true,hard:false,done:false,key:'g:'+g,
     vis:`<img class="big" src="${esc(x.img.file)}" alt="Tiburón de un género por identificar">`,
     opts:shuffle([g,...dis]).map(h=>({id:h,a:h,b:`${GEN[h].sp.length} ${GEN[h].sp.length===1?'especie':'especies'}`})),
     p:'¿De qué <b>género</b> es?'};
}
function newGenQ(){
  const gs=GENL.filter(g=>GEN[g].sp.some(s=>s.img)&&g!==(Q&&Q.gen));
  const w=gs.map(g=>{const c=S.srs['g:'+g];return c?Math.max(1,6-c.i):8});
  let r=Math.random()*w.reduce((a,b)=>a+b,0),g=gs[0];
  for(let i=0;i<gs.length;i++){r-=w[i];if(r<=0){g=gs[i];break}}
  genQ(g);
}
function genFeedback(x){
  const ok=Q.pick===Q.ans,G=GEN[Q.gen],L=G.sp.filter(s=>s.img).slice(0,6);
  return `<div class="oc" style="--h:${OM[x.o].h};margin-top:14px"><h3>${ok?'<span style="color:var(--ok)">✓</span>':'<span style="color:var(--bad)">✗ Era</span>'} <i>${esc(Q.gen)}</i></h3><p class="mono">${esc(x.es)} · ${G.sp.length} especies</p><div class="shots">${L.map(s=>`<figure data-sheet="${s.id}"><img loading="lazy" src="${esc(s.img.file)}" alt="${esc(cname(s)||s.n)}"><figcaption>${nmS(s)}</figcaption></figure>`).join('')}</div><button class="btn pri" data-next="1">Siguiente</button></div>`;
}

/* --- ficha de especie y comparador --- */
const SPINES=['sqd','ctr','etm','oxy','het'];
function traitsOf(x){
  const f=FM[x.f],o=f.o,anal=['HEX','HET','ORE','LAM','CAR'].includes(o);
  const dors=(o==='HEX'?'1':'2')+((o==='HET'||SPINES.includes(x.f))?' · con espina':' · sin espina');
  return [['Aleta anal',anal?'sí':'no'],['Dorsales',dors],['Membrana nictitante',o==='CAR'?'sí':'no'],['Hendiduras branquiales',x.f==='chl'?'6':o==='HEX'?'6–7':'5']];
}
const fmtLen=cm=>!cm?'sin dato':cm>=100?(cm/100).toFixed(1).replace('.0','')+' m':Math.round(cm)+' cm';
const fmtKg=kg=>!kg?'sin dato':kg>=1000?(kg/1000).toFixed(1)+' t':kg>=10?Math.round(kg)+' kg':kg.toFixed(1).replace('.0','')+' kg';
const lookalikes=x=>{const same=SP.filter(y=>y.id!==x.id&&y.img);return [...same.filter(y=>y.g===x.g),...same.filter(y=>y.f===x.f&&y.g!==x.g),...same.filter(y=>FM[y.f].o===FM[x.f].o&&y.f!==x.f)].slice(0,4)};
const kvRow=(k,v)=>`<div class="kv"><span>${k}</span><b>${esc(v)}</b></div>`;
function sheetEl(){let e=$('#sheet');if(!e){e=document.createElement('div');e.id='sheet';e.className='sheet';e.hidden=true;document.body.appendChild(e)}return e}
function closeSheet(){sheetEl().hidden=true;document.body.style.overflow=''}
function showSheet(html){const e=sheetEl();e.innerHTML=`<div class="sheet-in">${html}</div>`;e.hidden=false;e.scrollTop=0;document.body.style.overflow='hidden'}
function openSheet(id){
  const x=SPM[id];if(!x)return;const f=FM[x.f],o=OM[f.o],like=lookalikes(x);
  showSheet(`<div class="oc" style="--h:${o.h}"><button class="btn sheet-x" data-close="1">Cerrar</button>
   ${x.img?`<img class="big" src="${esc(x.img.file)}" alt="${esc(cname(x)||x.n)}" style="max-height:340px">`:`<div class="neutral" style="max-width:300px;margin:0 auto 12px">${sil(f.s)}</div>`}
   <h2 style="margin-top:0"><i>${esc(x.n)}</i></h2>
   <div class="row" style="margin-bottom:10px">${iu(x)?`<span class="tag iu iu-${iu(x)}">IUCN ${iu(x)}</span>`:''}<span class="tag">${esc(f.es)}</span><span class="tag">${esc(o.es)}</span></div>
   <div class="card"><p class="mono">Clasificación</p>${kvRow('Filo','Chordata')}${kvRow('Clase','Chondrichthyes')}${kvRow('Orden',o.es)}${kvRow('Familia',f.la)}${kvRow('Género',x.g)}${kvRow('Especie',x.n.split(' ').slice(1).join(' '))}</div>
   <div class="card"><p class="mono">Hábitat y tamaño</p>${kvRow('Medio',x.hab||'sin dato')}${kvRow('Profundidad',x.dep||'sin dato')}${kvRow('Zona',x.zona||'sin dato')}${kvRow('Tamaño máx.',fmtLen(x.len))}${kvRow('Peso máx.',fmtKg(x.kg))}</div>
   <div class="card"><p class="mono">Rasgos determinantes</p>${traitsOf(x).map(t=>kvRow(t[0],t[1])).join('')}<ul style="margin:8px 0 0;padding-left:20px">${f.r.slice(0,3).map(r=>`<li>${esc(r)}</li>`).join('')}</ul><p class="hook">${esc(f.g)}</p></div>
   <label class="task"><input type="checkbox" data-sp="${x.id}" ${S.sp[x.id]?'checked':''}><span>Ya la reconozco</span></label>
   ${like.length?`<p class="mono" style="margin-top:14px">Se parece a</p><div class="shots">${like.map(y=>`<figure data-sheet="${y.id}"><img loading="lazy" src="${esc(y.img.file)}" alt="${esc(cname(y)||y.n)}"><figcaption>${nmS(y)}</figcaption></figure>`).join('')}</div><button class="btn pri" data-cmp="${[x.id,...like.slice(0,2).map(y=>y.id)].join(',')}">Comparar con las parecidas</button>`:''}
   <p style="margin-top:14px">${credit(x)}</p><p class="mono">${links(x)}</p></div>`);
}
function openCmp(ids){
  const L=ids.map(i=>SPM[i]).filter(Boolean);if(L.length<2)return;
  const rows=[['Familia',x=>FM[x.f].la],['Género',x=>x.g],['Tamaño máx.',x=>fmtLen(x.len)],['Peso máx.',x=>fmtKg(x.kg)],['Profundidad',x=>x.dep||'sin dato'],['Zona',x=>x.zona||'sin dato'],['Medio',x=>x.hab||'sin dato'],['IUCN',x=>iu(x)||'—'],['Aleta anal',x=>traitsOf(x)[0][1]],['Dorsales',x=>traitsOf(x)[1][1]],['Membrana nictitante',x=>traitsOf(x)[2][1]],['Branquias',x=>traitsOf(x)[3][1]]];
  const diff=r=>new Set(L.map(r[1])).size>1;
  const fams=[...new Set(L.map(x=>x.f))];
  showSheet(`<div><button class="btn sheet-x" data-close="1">Cerrar</button><h2 style="margin-top:0">Comparar</h2><p class="lede">En negrita y color, lo que las distingue.</p>
   <div class="cmp" style="--n:${L.length}">
    ${L.map(x=>`<div class="cmp-h oc" style="--h:${OM[FM[x.f].o].h}" data-sheet="${x.id}">${x.img?`<img src="${esc(x.img.file)}" alt="${esc(cname(x)||x.n)}">`:`<div class="neutral">${sil(FM[x.f].s)}</div>`}<b><i>${esc(x.n)}</i></b></div>`).join('')}
    ${rows.map(r=>{const d=diff(r);return L.map(x=>`<div class="cmp-c${d?' diff':''}"><span>${r[0]}</span>${esc(r[1](x))}</div>`).join('')}).join('')}
   </div>
   <div class="card" style="margin-top:14px"><p class="mono">${fams.length>1?'Rasgo clave de cada familia':'Misma familia'}</p>${fams.map(f=>`<p><b>${esc(FM[f].es)}</b>: ${esc(FM[f].g)}</p>`).join('')}</div></div>`);
}

/* --- progreso --- */
function vProg(){
  const t=todayN(),sp=SP.filter(x=>x.img),spK=sp.filter(x=>isKnown('s:'+x.id)).length;
  const days=[...Array(7)].map((_,i)=>{const d=t-6+i,h=S.hist[dstr(d)]||{a:0,n:0};return {d,h}}),mx=Math.max(1,...days.map(x=>x.h.n));
  const wk=['D','L','M','X','J','V','S'];
  const byO=O.map(o=>{const L=sp.filter(x=>FM[x.f].o===o.id);return {o,n:L.length,k:L.filter(x=>isKnown('s:'+x.id)).length}}).filter(r=>r.n);
  const weak=Object.entries(S.srs).filter(([k,c])=>k[0]==='s'&&c.lap>0&&SPM[k.slice(2)]).sort((a,b)=>(b[1].lap-a[1].lap)||(a[1].i-b[1].i)).slice(0,8).map(e=>SPM[e[0].slice(2)]);
  const weakG=Object.entries(S.srs).filter(([k,c])=>k[0]==='g'&&c.lap>0&&GEN[k.slice(2)]).sort((a,b)=>b[1].lap-a[1].lap).slice(0,5).map(e=>e[0].slice(2));
  const acc=(()=>{let a=0,n=0;days.forEach(x=>{a+=x.h.a;n+=x.h.n});return n?Math.round(100*a/n):null})();
  $('#v-plan').innerHTML=`<h2>Progreso</h2>
   <div class="stats3"><div><b>${knownCount('f')}/${F.length}</b><span>familias</span></div><div><b>${knownCount('g')}/${GENL.length}</b><span>géneros</span></div><div><b>${spK}/${sp.length}</b><span>especies con foto</span></div></div>
   <div class="card"><p class="mono">Últimos 7 días${acc!==null?` · ${acc}% de aciertos`:''} · racha ${streak()}</p><div class="bars7">${days.map(x=>`<div><i style="height:${Math.round(100*x.h.n/mx)}%"></i><span>${x.h.n||''}</span><em>${wk[new Date(x.d*DAYMS).getUTCDay()]}</em></div>`).join('')}</div>
    <p class="mono" style="margin-top:10px">Nuevas por día</p><div class="row">${[5,10,20].map(n=>`<button class="chip" aria-pressed="${NPD()===n}" data-npd="${n}">${n}</button>`).join('')}</div></div>
   <div class="card"><p class="mono">Por orden (especies dominadas)</p>${byO.map(r=>`<div class="obar oc" style="--h:${r.o.h}"><span>${r.o.es}</span><div><i style="width:${Math.round(100*r.k/r.n)}%"></i></div><b>${r.k}/${r.n}</b></div>`).join('')}</div>
   <div class="card"><p class="mono">Tus puntos débiles</p>${weak.length||weakG.length?`${weak.map(x=>`<div class="sp" data-sheet="${x.id}">${photo(x)}<div class="spt">${nmS(x)}<div class="mono">${S.srs['s:'+x.id].lap} fallos</div></div></div>`).join('')}${weakG.map(g=>`<div class="sp"><div class="spt"><b><i>${esc(g)}</i></b><div class="mono">género · ${S.srs['g:'+g].lap} fallos</div></div></div>`).join('')}`:'<p class="la">Aún no has fallado nada. Responde en Hoy y aquí saldrán las que más cuestan.</p>'}</div>
   <details><summary><div><h3>Plan de semanas</h3></div></summary><div class="fb">${planHtml()}</div></details>
   <details><summary><div><h3>Pendiente de investigar</h3></div></summary><div class="fb">${pendHtml()}</div></details>`;
  count();
}

/* --- eventos propios --- */
document.addEventListener('click',e=>{
  if(e.target.closest('a'))return;
  const s=e.target.closest('[data-sheet]');
  if(s&&!e.target.closest('[data-close]')){openSheet(s.dataset.sheet);return}
  const c=e.target.closest('[data-cmp]');if(c){openCmp(c.dataset.cmp.split(','));return}
  if(e.target.closest('[data-close]')){closeSheet();return}
  const n=e.target.closest('[data-npd]');if(n){S.set.npd=+n.dataset.npd;save();vProg();return}
  const m=e.target.closest('[data-hoymore]');if(m){S.day.n=Math.max(0,S.day.n-5);save();Q=null;vEst();return}
  const g=e.target.closest('[data-gostudy]');if(g){setTimeout(()=>go('estudiar'),0)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
