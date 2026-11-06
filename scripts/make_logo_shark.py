import re,subprocess
src=open('scripts/icon_sheep_original.svg').read()
W,L='#0B4F5C','#8FD3DC'
inner=re.search(r"<title>.*?</title>(.*)</svg>",src,re.S).group(1)
inner=re.sub(r"<rect width='200' height='200'[^>]*/>","",inner,1)
wool=re.search(r"<g fill='#0B4F5C'><circle.*?</g>",inner,re.S).group(0)
circles=re.search(r"<g fill='#0B4F5C'>(<circle.*?)</g>",wool,re.S).group(1)
fins=("<path d='M84 24 C96 6 108 -12 116 -22 C118 -4 124 10 132 26 Z'/>"          # aleta dorsal
      "<path d='M30 92 L-10 132 L38 124 Z'/><path d='M170 92 L210 132 L162 124 Z'/>") # pectorales
sil=f"<g fill='{L}' stroke='{L}' stroke-width='10' stroke-linejoin='round'>{circles}{fins}</g><g fill='{W}'>{circles}{fins}</g>"
inner=inner.replace(wool,sil)
teeth=''.join(f"<path d='M{x} 167 h7 l-3.5 {d} Z' fill='#fff'/>" for x,d in [(80,5),(87,7),(94,8),(101,8),(108,7),(115,5)])
face=(f"<path d='M77 166 Q100 192 123 166 Z' fill='{W}'/>"+teeth+
      f"<g fill='none' stroke='{L}' stroke-width='3' stroke-linecap='round'>"
      "<path d='M30 74 q-5 9 0 18'/><path d='M38 70 q-5 9 0 18'/><path d='M46 68 q-5 9 0 18'/>"
      "<path d='M170 74 q5 9 0 18'/><path d='M162 70 q5 9 0 18'/><path d='M154 68 q5 9 0 18'/></g>")
def svg(bg,vb):
    r=f"<rect x='{vb[0]}' y='{vb[1]}' width='{vb[2]}' height='{vb[3]}' rx='54' fill='#EAF2F4'/>" if bg else ''
    return f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{' '.join(map(str,vb))}' role='img' aria-label='Logo Pepe Flock: oveja tiburón'><title>Logo Pepe Flock</title>{r}{inner}{face}</svg>"
open('img/icon.svg','w').write(svg(True,(-24,-34,248,248)))
open('img/logo.svg','w').write(svg(False,(-16,-26,232,232)))
for n in (512,192,180):
    subprocess.run(['inkscape','img/icon.svg','-w',str(n),'-h',str(n),'-o',f'img/icon-{n}.png'],check=True,capture_output=True)
subprocess.run(['inkscape','img/logo.svg','-w','600','-o','/tmp/claude-1000/-home-pepe-Pepe-Flock-Tiburones/cca105eb-7f9f-4bd2-8a29-f88069cb36c0/scratchpad/logo_prev.png'],check=True,capture_output=True)
