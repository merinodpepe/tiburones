import re,subprocess
src=open('scripts/icon_sheep_original.svg').read()
W,L,P='#0B4F5C','#8FD3DC','#EAF2F4'
tiles=src[src.index("<g fill='#FFFFFF'>"):src.index('</svg>')]
earsHead=re.search(r"<g fill='#8FD3DC'><ellipse.*?</g><ellipse[^>]*/><g fill='#0B4F5C'><circle.*?</g>",src,re.S).group(0)
body=("<path d='M100 22 C118 22 128 44 150 64 C172 84 182 104 180 126 C178 152 140 166 100 166 C60 166 22 152 20 126 C18 104 28 84 50 64 C72 44 82 22 100 22 Z'/>"  # cuerpo
      "<path d='M100 34 C84 26 70 12 60 -12 C80 -4 120 -4 140 -12 C130 12 116 26 100 34 Z'/>"                                                                         # cola
      "<path d='M34 82 L-16 110 L38 122 Z'/><path d='M166 82 L216 110 L162 122 Z'/>")                                                                                # aletas laterales
shape=f"<g fill='{L}' stroke='{L}' stroke-width='10' stroke-linejoin='round'>{body}</g><g fill='{W}'>{body}</g>"
gills=(f"<g fill='none' stroke='{L}' stroke-width='3' stroke-linecap='round'><path d='M30 80 q-5 9 0 18'/><path d='M38 74 q-5 9 0 18'/><path d='M46 70 q-5 9 0 18'/>"
       "<path d='M170 80 q5 9 0 18'/><path d='M162 74 q5 9 0 18'/><path d='M154 70 q5 9 0 18'/></g>")
mouth=f"<path d='M77 168 Q100 194 123 168 Z' fill='{W}'/>"+''.join(f"<path d='M{x} 168 h7 l-3.5 {d} Z' fill='#fff'/>" for x,d in [(80,5),(87,7),(94,8),(101,8),(108,7),(115,5)])
inner=shape+gills+tiles+earsHead+mouth
def svg(bg,vb):
    r=f"<rect x='{vb[0]}' y='{vb[1]}' width='{vb[2]}' height='{vb[3]}' rx='54' fill='{P}'/>" if bg else ''
    return f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{' '.join(map(str,vb))}' role='img' aria-label='Logo Pepe Flock: tiburón oveja'><title>Logo Pepe Flock</title>{r}{inner}</svg>"
open('img/icon.svg','w').write(svg(True,(-34,-34,268,268)))
open('img/logo.svg','w').write(svg(False,(-24,-24,248,248)))
for n in (512,192,180):
    subprocess.run(['inkscape','img/icon.svg','-w',str(n),'-h',str(n),'-o',f'img/icon-{n}.png'],check=True,capture_output=True)
