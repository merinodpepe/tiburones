"""Formato de los datos de FishBase (traducidos al español) para fichas impresas y web."""
import re
TR={'marine':'marino','brackish':'salobre','freshwater':'agua dulce','demersal':'demersal','pelagic':'pelágico','pelagic-oceanic':'pelágico oceánico','pelagic-neritic':'pelágico nerítico','benthopelagic':'bentopelágico','bathydemersal':'batidemersal','bathypelagic':'batipelágico','reef-associated':'de arrecife','oceanodromous':'oceanódromo','non-migratory':'no migratorio','potamodromous':'potamódromo','amphidromous':'anfídromo','anadromous':'anádromo','catadromous':'catádromo'}
CL={'subtropical':'Subtropical','tropical':'Tropical','temperate':'Templado','deep-water':'Aguas profundas','boreal':'Boreal','polar':'Polar'}
def habitat(d):
    env=d.get('env','');tt=[];depth=''
    for p in [p.strip() for p in env.split(';')]:
        k=p.lower().rstrip('.').strip()
        if k.startswith('depth range') or k.startswith('usually') or re.search(r'\d|\?',k) or not k:continue
        tt.append(TR.get(k,k))
    m=re.search(r'depth range (\d+) - (\d+) m',env)
    if m:depth=f'{m.group(1)}–{m.group(2)} m'
    if len(tt)>1:tt=[t for t in tt if t!='marino']
    return ', '.join(tt),depth
def clima(d):
    c=d.get('clima','');k=c.split(';')[0].strip().lower()
    return CL.get(k,c.split(';')[0].strip()[:20])
