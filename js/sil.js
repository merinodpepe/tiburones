/* ===== SILUETAS: se dibujan a partir de rasgos (forma, dorsales, anal, cola, extras) ===== */
let _sid=0;
function sil(p,lab){
  p=Object.assign({hb:12,sn:'point',tail:'epi',d:2,d1:18,d2:9,pec:15,anal:1,gills:5,sp:0,deco:'',x:'',xp:142,tk:1},p);
  const open=`<svg class="sil" viewBox="0 0 220 124" role="img" aria-label="${lab||'Silueta de tiburón'}">`;
  if(p.x==='flat'){
    return open+`<path d="M122,59L172,60L206,44L198,62L208,80L172,64L122,65Z" fill="var(--fin2)"/>
<ellipse cx="148" cy="62" rx="7" ry="2.6" fill="var(--fin2)"/><ellipse cx="168" cy="62" rx="6" ry="2.2" fill="var(--fin2)"/>
<path d="M96,56C108,36 128,40 126,56C128,64 118,66 108,64Z" fill="var(--fin2)"/>
<path d="M96,68C108,88 128,84 126,68C128,60 118,58 108,60Z" fill="var(--fin2)"/>
<path d="M22,62C34,56 54,54 66,38C80,20 98,30 98,48C112,54 122,59 124,62C122,65 112,70 98,76C98,94 80,104 66,86C54,70 34,68 22,62Z" fill="var(--oc)"/>
<circle cx="40" cy="57" r="2.2" fill="var(--eye)"/><circle cx="40" cy="67" r="2.2" fill="var(--eye)"/>
<path d="M24,62h8" stroke="var(--eye)" stroke-width="1.2"/></svg>`;
  }
  const id='c'+(++_sid), yc=62, hb=p.hb, hl=hb*.85, hp=3, xp=p.xp, k=p.tk;
  const n=(p.x==='saw'||p.x==='beak')?44:p.x==='hammer'?28:14, L=xp-n;
  const sf={point:.2,round:.11,blunt:.05}[p.sn], kf={point:.3,round:.7,blunt:.9}[p.sn], pk=n+L*.4;
  const body=`M${n},${yc}C${n+L*sf},${yc-hb*kf} ${n+L*.22},${yc-hb} ${pk},${yc-hb}C${pk+L*.25},${yc-hb} ${xp-L*.2},${yc-hp*1.3} ${xp},${yc-hp}L${xp},${yc+hp}C${xp-L*.2},${yc+hp*1.3} ${pk+L*.25},${yc+hl} ${pk},${yc+hl}C${n+L*.22},${yc+hl} ${n+L*sf},${yc+hl*kf} ${n},${yc}Z`;
  const X=v=>xp+v*k;
  const T={
    epi:`M${xp-2},${yc-hp}C${X(12)},${yc-hp-4} ${X(28)},${yc-22} ${X(44)},${yc-34}C${X(40)},${yc-22} ${X(36)},${yc-12} ${X(30)},${yc-4}C${X(38)},${yc+4} ${X(36)},${yc+14} ${X(30)},${yc+20}C${X(20)},${yc+14} ${X(10)},${yc+6} ${xp-2},${yc+hp}Z`,
    lunate:`M${xp-2},${yc-hp}C${xp+10},${yc-hp-4} ${xp+26},${yc-24} ${xp+42},${yc-36}C${xp+34},${yc-18} ${xp+28},${yc-6} ${xp+28},${yc}C${xp+28},${yc+6} ${xp+34},${yc+18} ${xp+42},${yc+36}C${xp+26},${yc+24} ${xp+10},${yc+hp+4} ${xp-2},${yc+hp}Z`,
    long:`M${xp-2},${yc-hp}C${xp+14},${yc-hp-6} ${xp+36},${yc-30} ${xp+62},${yc-56}C${xp+50},${yc-30} ${xp+40},${yc-12} ${xp+26},${yc-4}C${xp+34},${yc+2} ${xp+32},${yc+10} ${xp+26},${yc+14}C${xp+16},${yc+10} ${xp+8},${yc+5} ${xp-2},${yc+hp}Z`,
    paddle:`M${xp-2},${yc-hp}C${xp+14},${yc-hp-6} ${xp+36},${yc-10} ${xp+52},${yc-2}C${xp+36},${yc+6} ${xp+14},${yc+hp+4} ${xp-2},${yc+hp}Z`
  }[p.tail];
  const dor=(x,s,y)=>`<path d="M${x},${y+5}C${x+3},${y-s*.5} ${x+9},${y-s} ${x+13},${y-s}C${x+14},${y-s*.4} ${x+19},${y} ${x+24},${y+5}Z" fill="var(--fin2)"/>`+
    (p.sp?`<path d="M${x+2},${y-s*.3}L${x+8},${y-s-5}L${x+9},${y-s*.4}Z" fill="var(--gild)"/>`:'');
  let o=open+`<clipPath id="${id}"><path d="${body}"/></clipPath><path d="${T}" fill="var(--fin2)"/><path d="${body}" fill="var(--oc)"/>`;
  o+= p.d===1 ? dor(xp-L*.32-12,p.d1,yc-hb*.62) : dor(n+L*.46,p.d1,yc-hb+1)+dor(xp-L*.26-12,p.d2,yc-hb*.55);
  if(p.anal){const x=xp-L*.2-6,y=yc+hl*.5; o+=`<path d="M${x},${y}C${x+3},${y+7} ${x+7},${y+10} ${x+11},${y+10}C${x+12},${y+5} ${x+15},${y+2} ${x+18},${y-1}Z" fill="var(--fin2)"/>`;}
  {const x=xp-L*.34-6,y=yc+hl*.55; o+=`<path d="M${x},${y}C${x+4},${y+9} ${x+8},${y+11} ${x+15},${y+11}C${x+12},${y+5} ${x+14},${y+2} ${x+16},${y-2}Z" fill="var(--fin2)"/>`;}
  {const x=n+L*.33,y=yc+hl*.3,s=p.pec; o+=`<path d="M${x},${y}C${x+8},${y+s*.5} ${x+20},${y+s} ${x+34},${y+s+3}C${x+28},${y+s*.4} ${x+22},${y+4} ${x+14},${y-5}Z" fill="var(--fin2)"/>`;}
  let g='';
  const sp=[[.2,-.25],[.32,.15],[.44,-.3],[.56,.2],[.66,-.15],[.78,.1],[.38,0],[.5,0],[.7,.25]];
  if(p.deco==='spots') g=sp.map(a=>`<circle cx="${n+L*a[0]}" cy="${yc+hb*a[1]}" r="2.2" fill="var(--eye)" opacity=".45"/>`).join('');
  if(p.deco==='grid') for(let i=0;i<8;i++)for(let j=0;j<4;j++) g+=`<circle cx="${n+L*(.18+i*.08)}" cy="${yc+hb*(-.6+j*.4)}" r="1.5" fill="var(--eye)" opacity=".6"/>`;
  if(p.deco==='bands') for(let i=0;i<6;i++) g+=`<rect x="${n+L*(.2+i*.1)}" y="${yc-hb-2}" width="5" height="${hb*2+4}" fill="var(--fin2)" opacity=".5"/>`;
  if(p.deco==='saddle') for(let i=0;i<4;i++) g+=`<ellipse cx="${n+L*(.3+i*.15)}" cy="${yc-hb*.75}" rx="9" ry="4.5" fill="var(--fin2)" opacity=".85"/>`;
  if(p.deco==='photo') for(let i=0;i<10;i++) g+=`<circle cx="${n+L*(.15+i*.075)}" cy="${yc+hl*.68}" r="1.5" fill="var(--gild)"/>`;
  if(g) o+=`<g clip-path="url(#${id})">${g}</g>`;
  const st=`stroke="var(--fin2)" stroke-width="1.6" fill="none" stroke-linecap="round"`;
  if(p.x==='saw'){
    o+=`<path d="M${n+1},${yc-5}L6,${yc-1.5}L6,${yc+1.5}L${n+1},${yc+5}Z" fill="var(--oc)"/>`;
    for(let i=0;i<6;i++) o+=`<path d="M${11+i*5},${yc+1.5}l2.5,6l2.5,-6z" fill="var(--oc)"/>`;
    o+=`<path d="M${n-16},${yc+3}l-1,9M${n-11},${yc+3}l-1,9" ${st}/>`;
  }
  if(p.x==='beak') o+=`<path d="M${n+1},${yc-4}C${n-14},${yc-3} ${n-26},${yc-1} 8,${yc+3}C${n-26},${yc+4} ${n-14},${yc+5} ${n+1},${yc+6}Z" fill="var(--oc)"/>`;
  if(p.x==='barb') o+=`<path d="M${n+3},${yc+hb*.25}q-1,7 -5,9M${n+7},${yc+hb*.3}q0,7 -4,10" ${st}/>`;
  if(p.x==='fringe') for(let i=0;i<6;i++) o+=`<path d="M${n+L*.03+i*5},${yc+hb*.5}l2.5,8l2.5,-8z" fill="var(--fin2)"/>`;
  if(p.x==='keel') o+=`<path d="M${xp-18},${yc}H${xp+3}" stroke="var(--eye)" stroke-width="1.5" opacity=".7"/>`;
  if(p.x==='hammer'){
    o+=`<rect x="${n-12}" y="${yc-18}" width="16" height="36" rx="8" fill="var(--oc)" transform="rotate(-12 ${n-4} ${yc})"/><circle cx="${n-6}" cy="${yc-12}" r="2.2" fill="var(--eye)"/>`;
  } else {
    o+=`<circle cx="${n+L*.12}" cy="${yc-hb*.2}" r="2.4" fill="var(--eye)"/>`+
       `<path d="M${n+L*.07},${yc+hb*.2}q${L*.07},${hb*.2} ${L*.15},${hb*.12}" stroke="var(--eye)" stroke-width="1.2" fill="none"/>`;
  }
  for(let i=0;i<p.gills;i++) o+=`<path d="M${n+L*.27+i*3.6},${yc-hb*.55}q-1.5,${hb*.35} 0,${hb*.7}" stroke="var(--eye)" stroke-width="1" fill="none" opacity=".65"/>`;
  return o+'</svg>';
}
