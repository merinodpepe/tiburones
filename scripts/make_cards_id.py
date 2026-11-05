"""Fichas tipo carné (horizontal, 85.6x54 mm, 10 por A4, doble cara) -> ../cartas_carne/*.pdf
Anverso: foto + taxonomía. Reverso: hábitat, tamaño/peso y rasgos determinantes. Agujero de anilla en una esquina.
Reverso con columnas espejadas: imprimir a doble cara, giro por el lado largo."""
import json,os,io,re,colorsys,sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
D='/usr/share/fonts/truetype/dejavu/'
for n,f in (('S','DejaVuSans'),('SB','DejaVuSans-Bold'),('SI','DejaVuSans-Oblique'),('SC','DejaVuSansCondensed'),('SCB','DejaVuSansCondensed-Bold')):pdfmetrics.registerFont(TTFont(n,D+f+'.ttf'))
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T=json.load(open('taxo_dump.json'));O={o['id']:o for o in T['O']};F={f['id']:f for f in T['F']}
OORD=[o['id'] for o in T['O']];FORD={f['id']:i for i,f in enumerate(T['F'])}
import glob
FB={}
for _f in ['fishbase_all.json']:
    try:FB.update(json.load(open(_f)))
    except Exception:pass
sp=[s for s in json.load(open(root+'/data/species.json')) if s['img'] and os.path.exists(os.path.join(root,s['img']['file']))]
sp.sort(key=lambda s:(OORD.index(F[s['f']]['o']),FORD[s['f']],s['g'],s['n']))
CW,CH=85.6*mm,54*mm;COLS,ROWS=2,5;MX=(A4[0]-COLS*CW)/2;MY=(A4[1]-ROWS*CH)/2
R=3.2*mm;BAND=11*mm;HR=3*mm;HC=6*mm
def col(o,l=.40,s=.5):return colorsys.hls_to_rgb(O[o]['h']/360,l,s)
IU={'CR':(.78,.12,.12),'EN':(.88,.42,.1),'VU':(.85,.68,.05),'NT':(.55,.7,.2),'LC':(.2,.6,.38),'DD':(.5,.5,.55)}
IUN={'critically endangered':'CR','endangered':'EN','vulnerable':'VU','near threatened':'NT','least concern':'LC','data deficient':'DD'}
LOGO=ImageReader(root+'/img/icon-192.png')
def cover(path,w,h):
    im=Image.open(path).convert('RGB');ar=w/h;iw,ih=im.size
    if iw/ih>ar:nw=int(ih*ar);im=im.crop(((iw-nw)//2,0,(iw-nw)//2+nw,ih))
    else:nh=int(iw/ar);im=im.crop((0,(ih-nh)//3,iw,(ih-nh)//3+nh))
    im=im.resize((min(im.size[0],800),int(min(im.size[0],800)/ar)));b=io.BytesIO();im.save(b,'JPEG',quality=85);b.seek(0);return ImageReader(b)
def wrap(c,t,font,size,w):
    words=t.split();lines=[];cur=''
    for x in words:
        if c.stringWidth((cur+' '+x).strip(),font,size)<=w:cur=(cur+' '+x).strip()
        else:lines.append(cur);cur=x
    if cur:lines.append(cur)
    return lines
def fit(c,t,font,size,w,minsize,maxlines):
    while True:
        L=wrap(c,t,font,size,w)
        if len(L)<=maxlines or size<=minsize:return L,size
        size-=.4
ISSUES=[]
def sfit(c,t,font,size,w,minsize=5):
    while c.stringWidth(t,font,size)>w and size>minsize:size-=.2
    return size
def name(s):return s['es'] or s['en'] or s['n']
# --- traducciones FishBase ---
TR={'marine':'marino','brackish':'salobre','freshwater':'agua dulce','demersal':'demersal','pelagic':'pelágico','pelagic-oceanic':'pelágico oceánico','pelagic-neritic':'pelágico nerítico','benthopelagic':'bentopelágico','bathydemersal':'batidemersal','bathypelagic':'batipelágico','reef-associated':'de arrecife','oceanodromous':'oceanódromo','non-migratory':'no migratorio','potamodromous':'potamódromo','amphidromous':'anfídromo','anadromous':'anádromo','catadromous':'catádromo'}
CL={'subtropical':'Subtropical','tropical':'Tropical','temperate':'Templado','deep-water':'Aguas profundas','boreal':'Boreal','polar':'Polar'}
def habitat(d):
    env=d.get('env','');parts=[p.strip() for p in env.split(';')];tt=[];depth=''
    for p in parts:
        m=re.match(r'depth range (\d+) - (\d+) m',p)
        if m:depth=f'{m.group(1)}–{m.group(2)} m';continue
        k=p.lower().rstrip('.').strip()
        if k.startswith('depth range') or k.startswith('usually') or re.search(r'\d|\?',k) or not k:continue
        tt.append(TR.get(k,k))
    mm_=re.search(r'depth range (\d+) - (\d+) m',env)
    if mm_:depth=f'{mm_.group(1)}–{mm_.group(2)} m'
    if len(tt)>1:tt=[t for t in tt if t!='marino']
    return ', '.join(tt),depth
def clima(d):
    c=d.get('clima','');k=c.split(';')[0].strip().lower();rng=c.split(';')[1].strip().replace(' - ','–') if ';' in c else ''
    return CL.get(k,c[:20]),rng
def size_w(d):
    L=d.get('len_cm');w=d.get('w_kg')
    ls=f"{L/100:.1f} m".replace('.0 m',' m') if L and L>=100 else (f"{L:.0f} cm" if L else 'sin dato')
    if not w:ws='sin dato'
    elif w>=1000:ws=f'{w/1000:.1f} t'
    elif w>=10:ws=f'{w:.0f} kg'
    else:ws=f'{w:.1f} kg'.replace('.0 kg',' kg')
    return ls,ws
SPINE={'sqd','ctr','etm','oxy','het'}
def traits(s):
    f=F[s['f']];o=f['o'];anal=o in('HEX','HET','ORE','LAM','CAR')
    dors='1' if o=='HEX' else '2'
    dors+=' · con espina' if (o=='HET' or s['f'] in SPINE) else ' · sin espina'
    gills='6' if s['f']=='chl' else '6–7' if o=='HEX' else '5'
    return [('Aleta anal','sí' if anal else 'no',anal),('Dorsales',dors,s['f'] in SPINE or o=='HET'),('Membrana nictitante','sí' if o=='CAR' else 'no',o=='CAR'),('Hendiduras branquiales',gills,o=='HEX')]
def shell(c,x,y):
    c.saveState();p=c.beginPath();p.roundRect(x,y,CW,CH,R);c.clipPath(p,stroke=0,fill=0)
def outline(c,x,y):
    c.setStrokeColorRGB(.6,.6,.6);c.setLineWidth(.35);c.roundRect(x,y,CW,CH,R,stroke=1,fill=0)
def band(c,x,y,o,hole_right,label,sub):
    c.saveState();_p=c.beginPath();_p.rect(x,y+CH-BAND,CW,BAND);c.clipPath(_p,stroke=0,fill=0)
    c.linearGradient(x,y+CH-BAND,x+CW,y+CH,(col(o,.28,.55),col(o,.46,.5)),extend=False);c.restoreState()
    c.setFillColorRGB(1,1,1);c.setFillAlpha(.10)
    for dx,dy,r in ((CW*.45,BAND*.15,6*mm),(CW*.6,BAND*.9,5*mm),(CW*.78,BAND*.3,6*mm),(CW*.92,BAND*.9,4*mm)):c.circle(x+dx,y+CH-BAND+dy,r,stroke=0,fill=1)
    c.setFillAlpha(1);hx=x+CW-HC if hole_right else x+HC;hy=y+CH-HC
    c.setFillColorRGB(1,1,1);c.setStrokeColorRGB(.55,.55,.55);c.setLineWidth(.4);c.circle(hx,hy,HR,stroke=1,fill=1)
    tx=x+4*mm if hole_right else x+HC*2+2*mm
    avail=(x+CW-HC*2-2*mm-tx) if hole_right else (x+CW-12*mm-tx);ls_=sfit(c,label.upper(),'SB',8,avail,5.5)
    if c.stringWidth(label.upper(),'SB',ls_)>avail:ISSUES.append(('banda',label))
    c.setFillColorRGB(1,1,1);c.setFont('SB',ls_);c.drawString(tx,y+CH-5*mm,label.upper())
    c.setFont('S',6.3);c.setFillColorRGB(1,1,1,0.85) if False else None;c.drawString(tx,y+CH-8.6*mm,sub)
def footer(c,x,y,o,num,s):
    c.setFillColor(col(o,.94,.4));c.rect(x,y,CW,5.5*mm,stroke=0,fill=1)
    c.setFillColor(col(o,.3,.5));c.setFont('S',6.5);c.drawString(x+4*mm,y+1.9*mm,f'Nº {num} · Pepe Flock Tiburones')
    ab=IUN.get((s['iucn'] or '').lower(),'')
    if ab:
        t='IUCN '+ab;w=c.stringWidth(t,'SB',6.5)+4*mm;c.setFillColorRGB(*IU[ab]);c.roundRect(x+CW-w-3*mm,y+.9*mm,w,3.7*mm,1.8*mm,stroke=0,fill=1)
        c.setFillColorRGB(1,1,1);c.setFont('SB',6.5);c.drawString(x+CW-w-3*mm+2*mm,y+1.9*mm,t)
def front(c,x,y,s,num):
    f=F[s['f']];o=f['o'];shell(c,x,y)
    c.setFillColorRGB(.985,.975,.95);c.rect(x,y,CW,CH,stroke=0,fill=1)
    band(c,x,y,o,False,'Ficha de tiburón','Clasificación taxonómica')
    ph_w,ph_h=39*mm,CH-BAND-5.5*mm-5*mm;px,py=x+4*mm,y+5.5*mm+2.5*mm
    c.saveState();pp=c.beginPath();pp.roundRect(px,py,ph_w,ph_h,2.2*mm);c.clipPath(pp,stroke=0,fill=0)
    c.drawImage(cover(os.path.join(root,s['img']['file']),ph_w,ph_h),px,py,ph_w,ph_h);c.restoreState()
    c.setStrokeColor(col(o,.5,.4));c.setLineWidth(.6);c.roundRect(px,py,ph_w,ph_h,2.2*mm,stroke=1,fill=0)
    rx=px+ph_w+4*mm;rw=x+CW-rx-4*mm;ink=(.07,.12,.16);c.setFillColorRGB(*ink)
    sz=11;nm_=name(s)
    while True:
        L=wrap(c,nm_,'SCB',sz,rw)
        if len(L)==1 or (len(L)==2 and sz<=9.2):break
        if sz<=6.5:break
        sz-=.3
    if len(L)>2 or max(c.stringWidth(l,'SCB',sz) for l in L)>rw:ISSUES.append(('nombre',nm_));L=[nm_[:int(rw/ (sz*.2))]]
    c.setFont('SCB',sz);ty=y+CH-BAND-5.2*mm
    for l in L:c.drawString(rx,ty,l);ty-=sz*.42*mm*1.25
    ty-=.6*mm
    rows=[('Filo','Chordata'),('Clase','Chondrichthyes'),('Orden',O[o]['es']),('Familia',f['la']),('Género',s['g']),('Especie',s['n'].split(' ',1)[1] if ' ' in s['n'] else s['n'])]
    c.setStrokeColor(col(o,.8,.3));c.setLineWidth(.3)
    for lab,val in rows:
        c.line(rx,ty+2.6*mm,rx+rw,ty+2.6*mm)
        c.setFillColor(col(o,.35,.5));c.setFont('SB',5.6);c.drawString(rx,ty-.2*mm,lab.upper())
        fnt='SI' if lab in('Género','Especie') else 'SC';lw=c.stringWidth(lab.upper(),'SB',5.6)+2*mm;vs=sfit(c,val,fnt,7.2,rw-lw,5)
        if c.stringWidth(val,fnt,vs)>rw-lw:ISSUES.append(('fila',val))
        c.setFillColorRGB(*ink);c.setFont(fnt,vs);c.drawRightString(rx+rw,ty-.2*mm,val);ty-=3.75*mm
    c.drawImage(LOGO,x+CW-10.5*mm,y+CH-9.5*mm,8*mm,8*mm,mask='auto')
    footer(c,x,y,o,num,s);c.restoreState();outline(c,x,y)
def back(c,x,y,s,num):
    f=F[s['f']];o=f['o'];d=FB.get(s['id'],{});shell(c,x,y)
    c.setFillColorRGB(.985,.975,.95);c.rect(x,y,CW,CH,stroke=0,fill=1)
    band(c,x,y,o,True,name(s),'Hábitat · tamaño · rasgos')
    ink=(.07,.12,.16);lx=x+4*mm;mid=x+CW*.5;ty=y+CH-BAND-4.2*mm
    def head(t,px,py):c.setFillColor(col(o,.35,.5));c.setFont('SB',6.2);c.drawString(px,py,t.upper());c.setStrokeColor(col(o,.75,.3));c.setLineWidth(.4);c.line(px,py-1*mm,px+(mid-lx-3*mm),py-1*mm)
    def kv(k,v,px,py,w):
        c.setFillColorRGB(.4,.45,.5);c.setFont('S',6.3);c.drawString(px,py,k);av=w-c.stringWidth(k,'S',6.3)-1.5*mm;vs=sfit(c,v,'SCB',7.2,av,5)
        if c.stringWidth(v,'SCB',vs)>av:ISSUES.append(('kv',v))
        c.setFillColorRGB(*ink);c.setFont('SCB',vs);c.drawRightString(px+w,py,v)
    head('Hábitat y tamaño',lx,ty);ty-=4.4*mm;w=mid-lx-3*mm
    tp,depth=habitat(d);cl,rng=clima(d);ls,ws=size_w(d)
    c.setFillColorRGB(.4,.45,.5);c.setFont('S',6.3);c.drawString(lx,ty,'Medio');c.setFillColorRGB(*ink)
    L,sz=fit(c,tp or 'sin dato','SCB',7.2,w-11*mm,5.2,2)
    if len(L)>2 or any(c.stringWidth(l,'SCB',sz)>w-11*mm for l in L):ISSUES.append(('medio',tp))
    c.setFont('SCB',sz)
    for l in L:c.drawRightString(lx+w,ty,l);ty-=2.9*mm
    ty-=.5*mm
    kv('Profundidad',depth or 'sin dato',lx,ty,w);ty-=3.5*mm
    kv('Zona',cl or 'sin dato',lx,ty,w);ty-=3.5*mm
    kv('Tamaño máx.',ls,lx,ty,w);ty-=3.5*mm
    kv('Peso máx.',ws,lx,ty,w);ty-=3.5*mm
    # rasgos
    rx=mid+2*mm;rw=x+CW-rx-4*mm;ty=y+CH-BAND-4.2*mm
    c.setFillColor(col(o,.35,.5));c.setFont('SB',6.2);c.drawString(rx,ty,'RASGOS DETERMINANTES');c.setStrokeColor(col(o,.75,.3));c.line(rx,ty-1*mm,rx+rw,ty-1*mm);ty-=4.4*mm
    for k,v,pos in traits(s):
        c.setFillColorRGB(.4,.45,.5);c.setFont('S',6.3);c.drawString(rx,ty,k)
        c.setFillColorRGB(*((.12,.5,.3) if pos else (.55,.2,.18)) if k in('Aleta anal','Membrana nictitante') else ink);vs=sfit(c,v,'SCB',7.2,rw-c.stringWidth(k,'S',6.3)-1.5*mm,5);c.setFont('SCB',vs);c.drawRightString(rx+rw,ty,v);ty-=3.8*mm
    c.setFillColorRGB(*ink)
    for r in f['r'][:2]:
        L=wrap(c,r,'SC',6.6,rw-2.5*mm)[:2]
        if len(wrap(c,r,'SC',6.6,rw-2.5*mm))>2:L[1]=L[1][:-1].rstrip(' ,.;')+'…'
        c.setFillColor(col(o,.5,.5));c.circle(rx+.7*mm,ty+.9*mm,.6*mm,stroke=0,fill=1);c.setFillColorRGB(*ink);c.setFont('SC',6.6)
        for l in L:c.drawString(rx+2.5*mm,ty,l);ty-=2.9*mm
    c.setFillColor(col(o,.5,.5));c.rect(lx,y+7*mm,.8*mm,7*mm,stroke=0,fill=1)
    c.setFillColorRGB(.2,.27,.33);hy=y+12.2*mm;c.setFont('SI',6.4)
    hs=6.4;HL=wrap(c,f['g'],'SI',hs,mid-lx-5*mm)
    while len(HL)>3 and hs>5.2:hs-=.2;HL=wrap(c,f['g'],'SI',hs,mid-lx-5*mm)
    if len(HL)>3:ISSUES.append(('gancho',f['g']))
    c.setFont('SI',hs)
    for l in HL[:3]:c.drawString(lx+2.2*mm,hy,l);hy-=2.8*mm
    footer(c,x,y,o,num,s);c.restoreState();outline(c,x,y)
def make(cards,path):
    c=canvas.Canvas(path,pagesize=A4);per=COLS*ROWS
    for p in range(0,len(cards),per):
        chunk=cards[p:p+per]
        for side in (front,back):
            for i,(num,s) in enumerate(chunk):
                r,cc=divmod(i,COLS)
                if side is back:cc=COLS-1-cc
                x=MX+cc*CW;y=A4[1]-MY-(r+1)*CH;side(c,x,y,s,num)
            c.showPage()
    c.save()
if __name__=='__main__':
    out=root+'/cartas_carne';os.makedirs(out,exist_ok=True);cards=list(enumerate(sp,1))
    lim=int(sys.argv[1]) if len(sys.argv)>1 else None
    if lim:make(cards[196:196+lim],out+'/prueba.pdf');print('prueba')
    else:
        make(cards,out+'/carne_todas.pdf')
        for oid in OORD:
            sub=[(n,s) for n,s in cards if F[s['f']]['o']==oid]
            if sub:make(sub,f"{out}/carne_{O[oid]['es'].lower()}.pdf")
        print(len(cards),'fichas');print(len(ISSUES),'avisos de desbordamiento');[print(' ',i) for i in ISSUES[:30]]
