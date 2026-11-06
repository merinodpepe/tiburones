import re,subprocess
src=open('scripts/icon_sheep_original.svg').read()
W,L,P='#0B4F5C','#8FD3DC','#EAF2F4'
tiles=src[src.index("<g fill='#FFFFFF'>"):src.index('</svg>')]
body=("<path d='M14 112 C14 74 54 54 102 54 C142 54 166 86 174 112 C166 138 142 160 102 160 C54 160 14 150 14 112 Z'/>"   # cuerpo
      "<path d='M166 112 C180 100 192 84 198 58 C194 88 196 116 202 152 C186 144 174 130 166 120 Z'/>"                    # cola
      "<path d='M92 58 C106 36 122 20 136 8 C136 32 140 50 150 68 Z'/>"                                                    # dorsal
      "<path d='M84 146 L58 186 L112 152 Z'/>")                                                                            # pectoral
shape=f"<g fill='{L}' stroke='{L}' stroke-width='10' stroke-linejoin='round'>{body}</g><g fill='{W}'>{body}</g>"
belly=f"<path d='M20 124 C40 146 70 150 102 150 C136 150 160 134 170 118 C150 138 126 140 102 140 C66 140 36 136 20 124 Z' fill='{P}' opacity='.9'/>"
head=(f"<g fill='{L}'><ellipse cx='28' cy='84' rx='14' ry='7' transform='rotate(-25 28 84)'/><ellipse cx='72' cy='84' rx='14' ry='7' transform='rotate(25 72 84)'/>"
      f"<ellipse cx='50' cy='116' rx='30' ry='33'/></g><g fill='{W}'><circle cx='39' cy='108' r='3.6'/><circle cx='61' cy='108' r='3.6'/></g>"
      f"<path d='M28 128 Q50 154 72 128 Z' fill='{W}'/>"+''.join(f"<path d='M{x} 128 h7 l-3.5 {d} Z' fill='#fff'/>" for x,d in [(31,5),(38,7),(45,8),(52,8),(59,7),(66,5)]))
t=f"<g transform='translate(52 40) scale(.8)'>{tiles}</g>"
inner=shape+belly+t+head
def svg(bg,vb):
    r=f"<rect x='{vb[0]}' y='{vb[1]}' width='{vb[2]}' height='{vb[3]}' rx='54' fill='{P}'/>" if bg else ''
    return f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{' '.join(map(str,vb))}' role='img' aria-label='Logo Pepe Flock: tiburón oveja'><title>Logo Pepe Flock</title>{r}{inner}</svg>"
open('img/icon.svg','w').write(svg(True,(-30,-24,260,260)))
open('img/logo.svg','w').write(svg(False,(-12,0,224,200)))
for n in (512,192,180):
    subprocess.run(['inkscape','img/icon.svg','-w',str(n),'-h',str(n),'-o',f'img/icon-{n}.png'],check=True,capture_output=True)
