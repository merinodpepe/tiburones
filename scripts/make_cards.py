"""Flashcards imprimibles (poker 63.5x88.9 mm, 9 por hoja A4, doble cara) -> ../cartas/*.pdf
Hojas impares = fotos (anverso); pares = nombres (reverso, columnas espejadas para imprimir a doble cara por el lado largo)."""
import json,os,io,colorsys,textwrap,sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
D='/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('S',D+'DejaVuSans.ttf'));pdfmetrics.registerFont(TTFont('SB',D+'DejaVuSans-Bold.ttf'));pdfmetrics.registerFont(TTFont('SI',D+'DejaVuSans-Oblique.ttf'))
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T=json.load(open('taxo_dump.json'));O={o['id']:o for o in T['O']};F={f['id']:f for f in T['F']}
OORD=[o['id'] for o in T['O']];FORD={f['id']:i for i,f in enumerate(T['F'])}
sp=[s for s in json.load(open(root+'/data/species.json')) if s['img'] and os.path.exists(os.path.join(root,s['img']['file']))]
sp.sort(key=lambda s:(OORD.index(F[s['f']]['o']),FORD[s['f']],s['g'],s['n']))
CW,CH=63.5*mm,88.9*mm;COLS,ROWS=3,3;MX=(A4[0]-COLS*CW)/2;MY=(A4[1]-ROWS*CH)/2
def col(o,l=.40,s=.5):
    r,g,b=colorsys.hls_to_rgb(O[o]['h']/360,l,s);return (r,g,b)
def cover(path,w,h):
    im=Image.open(path).convert('RGB');ar=w/h;iw,ih=im.size
    if iw/ih>ar:nw=int(ih*ar);im=im.crop(((iw-nw)//2,0,(iw-nw)//2+nw,ih))
    else:nh=int(iw/ar);im=im.crop((0,(ih-nh)//3,iw,(ih-nh)//3+nh))
    im=im.resize((min(im.size[0],900),int(min(im.size[0],900)/ar)));b=io.BytesIO();im.save(b,'JPEG',quality=85);b.seek(0);return ImageReader(b)
def wrap(c,t,font,size,w):
    c.setFont(font,size);words=t.split();lines=[];cur=''
    for x in words:
        if c.stringWidth((cur+' '+x).strip(),font,size)<=w:cur=(cur+' '+x).strip()
        else:lines.append(cur);cur=x
    if cur:lines.append(cur)
    return lines
def name(s):return s['es'] or s['en'] or s['n']
R=3.2*mm;BAND=15*mm;HOLE_R=3*mm;HOLE_C=7*mm
IU={'CR':(.78,.12,.12),'EN':(.88,.42,.1),'VU':(.85,.68,.05),'NT':(.55,.7,.2),'LC':(.2,.6,.38),'DD':(.5,.5,.55)}
IUN={'critically endangered':'CR','endangered':'EN','vulnerable':'VU','near threatened':'NT','least concern':'LC','data deficient':'DD'}
LOGO=ImageReader(root+'/img/icon-192.png')
def shell(c,x,y,o,hole_right):
    """Forma de la carta: esquinas redondeadas, banda con degradado, agujero para anilla."""
    c.saveState();p=c.beginPath();p.roundRect(x,y,CW,CH,R);c.clipPath(p,stroke=0,fill=0)
    return p
def band(c,x,y,o,hole_right,label):
    c.saveState();_p=c.beginPath();_p.rect(x,y+CH-BAND,CW,BAND);c.clipPath(_p,stroke=0,fill=0)
    c.linearGradient(x,y+CH-BAND,x+CW,y+CH,(col(o,.30,.55),col(o,.46,.5)),extend=False);c.restoreState()
    c.setFillColor(col(o,.25,.5));c.rect(x,y+CH-BAND-.6*mm,CW,.6*mm,stroke=0,fill=1)
    # burbujas de lana (guiño al logo PMD)
    c.setFillColorRGB(1,1,1);c.setFillAlpha(.10)
    for dx,dy,r in ((CW*.55,BAND*.2,6*mm),(CW*.72,BAND*.85,4.5*mm),(CW*.9,BAND*.3,5*mm)):
        c.circle(x+(CW-dx if hole_right is False else dx),y+CH-BAND+dy,r,stroke=0,fill=1)
    c.setFillAlpha(1)
    hx=x+CW-HOLE_C if hole_right else x+HOLE_C;hy=y+CH-HOLE_C
    c.setFillColorRGB(1,1,1);c.setStrokeColorRGB(.55,.55,.55);c.setLineWidth(.4);c.circle(hx,hy,HOLE_R,stroke=1,fill=1)
    c.setFillColorRGB(1,1,1);c.setFont('SB',8.5)
    tx=x+HOLE_C*2+1.5*mm if not hole_right else x+4.5*mm
    c.drawString(tx,y+CH-BAND/2-1*mm,label[:24].upper())
def outline(c,x,y):
    c.setStrokeColorRGB(.6,.6,.6);c.setLineWidth(.35);c.roundRect(x,y,CW,CH,R,stroke=1,fill=0)
def front(c,x,y,s,num):
    f=F[s['f']];o=f['o'];shell(c,x,y,o,False)
    c.setFillColorRGB(.97,.97,.95);c.rect(x,y,CW,CH,stroke=0,fill=1)
    ph=CH-BAND-9*mm;c.drawImage(cover(os.path.join(root,s['img']['file']),CW,ph),x,y+9*mm,CW,ph)
    band(c,x,y,o,False,f['es'])
    c.setFillColor(col(o,.93,.4));c.rect(x,y,CW,9*mm,stroke=0,fill=1)
    c.setFillColor(col(o,.3,.5));c.setFont('SB',7.5);c.drawString(x+4*mm,y+3.4*mm,O[o]['es'].upper())
    c.setFont('S',7.5);c.drawRightString(x+CW-4*mm,y+3.4*mm,f'Nº {num}')
    c.restoreState();outline(c,x,y)
def fit(c,t,font,size,w,minsize=9,maxlines=3):
    while True:
        L=wrap(c,t,font,size,w)
        if len(L)<=maxlines or size<=minsize:return L,size
        size-=.5
def back(c,x,y,s,num):
    f=F[s['f']];o=f['o'];shell(c,x,y,o,True)
    c.setFillColorRGB(.985,.972,.945);c.rect(x,y,CW,CH,stroke=0,fill=1)
    c.setFillColor(col(o,.5,.5));c.setFillAlpha(.07)
    for dx,dy,r in ((CW*.2,CH*.30,16*mm),(CW*.35,CH*.22,12*mm),(CW*.1,CH*.18,9*mm)):c.circle(x+dx,y+dy,r,stroke=0,fill=1)
    c.setFillAlpha(1)
    band(c,x,y,o,True,O[o]['es'])
    ink=(.07,.12,.16);c.setFillColorRGB(*ink)
    L,sz=fit(c,name(s),'SB',17,CW-9*mm);c.setFont('SB',sz);ty=y+CH-BAND-9*mm
    for l in L:c.drawString(x+4.5*mm,ty,l);ty-=sz*.42*mm*1.25
    c.setFillColorRGB(.25,.32,.38);L2,sz2=fit(c,s['n'],'SI',11,CW-9*mm,8,2);c.setFont('SI',sz2);ty-=1*mm
    for l in L2:c.drawString(x+4.5*mm,ty,l);ty-=sz2*.42*mm*1.3
    if s['en'] and s['es'] and s['en']!=s['es']:
        c.setFont('S',8);c.setFillColorRGB(.4,.4,.4);c.drawString(x+4.5*mm,ty-.5*mm,s['en'][:36]);ty-=4.5*mm
    ty-=2*mm
    # chips familia / género
    def chip(t,cx,cy,fill,txt=(1,1,1),size=7.5):
        w=c.stringWidth(t,'SB',size)+5*mm;c.setFillColorRGB(*fill);c.roundRect(cx,cy-1.2*mm,w,5.2*mm,2.6*mm,stroke=0,fill=1)
        c.setFillColorRGB(*txt);c.setFont('SB',size);c.drawString(cx+2.5*mm,cy+.4*mm,t);return w
    w=chip(f['es'][:24],x+4.5*mm,ty,col(o,.35,.5));ty-=7*mm
    chip(s['g'],x+4.5*mm,ty,col(o,.9,.35),col(o,.25,.5));
    ab=IUN.get((s['iucn'] or '').lower(),'')
    if ab:chip('IUCN '+ab,x+CW-4.5*mm-(c.stringWidth('IUCN '+ab,'SB',7.5)+5*mm),ty,IU[ab])
    # cita con el rasgo clave
    qy=y+9*mm+17*mm;c.setFillColor(col(o,.5,.5));c.rect(x+4.5*mm,y+13*mm,.9*mm,15*mm,stroke=0,fill=1)
    c.setFillColorRGB(.2,.27,.33);hy=y+25*mm;c.setFont('SI',8)
    for l in wrap(c,f['g'],'SI',8,CW-24*mm)[:4]:c.drawString(x+7.5*mm,hy,l);hy-=3.7*mm
    c.drawImage(LOGO,x+CW-14*mm,y+3.5*mm,9*mm,9*mm,mask='auto')
    c.setFillColorRGB(.5,.5,.5);c.setFont('S',7);c.drawString(x+4.5*mm,y+4*mm,f'Nº {num}')
    c.restoreState();outline(c,x,y)
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
os.makedirs(root+'/cartas',exist_ok=True)
cards=list(enumerate(sp,1))
make(cards,root+'/cartas/tiburones_todas.pdf')
for oid in OORD:
    sub=[(n,s) for n,s in cards if F[s['f']]['o']==oid]
    if sub:make(sub,f"{root}/cartas/tiburones_{O[oid]['es'].lower()}.pdf")
print(len(cards),'cartas')
