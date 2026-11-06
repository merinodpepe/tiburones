import re,subprocess
src=open('scripts/icon_sheep_original.svg').read()
W,L,P='#0B4F5C','#8FD3DC','#EAF2F4'
tiles=src[src.index("<g fill='#FFFFFF'>"):src.index('</svg>')]
earsHead=re.search(r"<g fill='#8FD3DC'><ellipse.*?</g><ellipse[^>]*/><g fill='#0B4F5C'><circle.*?</g>",src,re.S).group(0)
body=("<path d='M100 26 C106 26 108 34 112 46 C124 70 138 90 138 124 C138 170 126 206 100 212 C74 206 62 170 62 124 C62 90 76 70 88 46 C92 34 94 26 100 26 Z'/>"
      "<path d='M100 32 C88 24 78 12 70 -8 C86 -2 114 -2 130 -8 C122 12 112 24 100 32 Z'/>"
      "<path d='M64 92 L12 126 L66 130 Z'/><path d='M136 92 L188 126 L134 130 Z'/>")
shape=f"<g fill='{L}' stroke='{L}' stroke-width='10' stroke-linejoin='round'>{body}</g><g fill='{W}'>{body}</g>"
gills=(f"<g fill='none' stroke='{L}' stroke-width='2.6' stroke-linecap='round'><path d='M70 96 q-4 8 0 16'/><path d='M77 92 q-4 8 0 16'/>"
       "<path d='M130 96 q4 8 0 16'/><path d='M123 92 q4 8 0 16'/></g>")
# casillas P M D + aleta, en columna a lo largo del cuerpo
glyph={}
for m in re.finditer(r"<path transform='translate\((\d+) (\d+)\)' (d='[^']*') ([^/]*)/>",tiles): glyph[(m.group(1),m.group(2))]=f"<path {m.group(3)} {m.group(4)}/>"
fin=re.search(r"<g transform='translate\(104 86\)'([^>]*)>(.*?)</g>",tiles,re.S)
def tile(i,key):
    ty=52+i*32.3; fill=L if i==3 else '#FFFFFF'
    inner=f"<g transform='translate(0 0)'{fin.group(1)}>{fin.group(2)}</g>" if i==3 else glyph[key]
    return f"<g transform='translate(85.6 {ty}) scale(.8)'><rect width='36' height='36' rx='9' fill='{fill}'/>{inner}</g>"
tl=''.join(tile(i,k) for i,k in enumerate([('60','42'),('104','42'),('60','86'),None]))
head=f"<g transform='translate(0 64)'>{earsHead}<path d='M77 168 Q100 194 123 168 Z' fill='{W}'/>"+''.join(f"<path d='M{x} 168 h7 l-3.5 {d} Z' fill='#fff'/>" for x,d in [(80,5),(87,7),(94,8),(101,8),(108,7),(115,5)])+"</g>"
inner=shape+gills+tl+head
def svg(bg,vb):
    r=f"<rect x='{vb[0]}' y='{vb[1]}' width='{vb[2]}' height='{vb[3]}' rx='54' fill='{P}'/>" if bg else ''
    return f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{' '.join(map(str,vb))}' role='img' aria-label='Logo Pepe Flock: tiburón oveja'><title>Logo Pepe Flock</title>{r}{inner}</svg>"
open('img/icon.svg','w').write(svg(True,(-50,-26,300,300)))
open('img/logo.svg','w').write(svg(False,(-20,-18,240,292)))
for n in (512,192,180):
    subprocess.run(['inkscape','img/icon.svg','-w',str(n),'-h',str(n),'-o',f'img/icon-{n}.png'],check=True,capture_output=True)
