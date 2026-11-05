"""Fotos reales de las partes que explica la app -> ../img/parts + ../data/parts.json"""
import json,urllib.request,urllib.parse,re,os,time,html,shutil
UA="TiburonesStudyApp/1.0 (personal learning project)"
OK=re.compile(r'^(cc0|cc[- ]by(-sa)?[- ]\d|public domain|pd)',re.I)
SP={s['n']:s for s in json.load(open('../data/species.json'))}
# id, título, texto, fuente: ('sp','Género especie') o ('file','Nombre en Commons')
P=[
('anal','Aleta anal y aletas','La anal es la aleta pequeña del vientre, justo antes de la cola. La tienen cinco órdenes (Carcharhiniformes, Lamniformes, Orectolobiformes, Heterodontiformes, Hexanchiformes) y les falta a Squaliformes, Squatiniformes, Pristiophoriformes y Echinorhiniformes.',('file','Parts of a shark.svg')),
('nict','Membrana nictitante','Tercer párpado que sube desde abajo y cubre el ojo. Si lo tiene: Carcharhiniformes. Si no: Lamniformes y el resto.',('file','Nictating membrane of a blue shark.tiff')),
('espina','Espina dorsal','Una espina delante de cada dorsal: mielgas y quelvachos (Squaliformes), y también los cabeza de toro.',('file','Squalus bucephalus JNC2621 Dorsal fin 1.JPG')),
('dent','Dentículos dérmicos','La piel de tiburón son escamas diminutas de dentina. En los tiburones de clavos son enormes y redondos.',('file','Denticules cutanés du requin citron Negaprion brevirostris vus au microscope électronique à balayage.jpg')),
('espir','Espiráculo','Orificio justo detrás del ojo. Grande en los de fondo (cebra, nodriza, angelotes) y pequeño o ausente en los nadadores.',('file','Shark spiracle and eye.jpg')),
('barb','Barbillones nasales','Bigotes carnosos junto a las narinas, con la boca delante de los ojos: Orectolobiformes (aquí un wobbegong con flecos).',('sp','Eucrossorhinus dasypogon')),
('bran','Seis o siete branquias','Los demás tiburones tienen cinco hendiduras. Seis o siete, y una sola dorsal: Hexanchiformes.',('sp','Notorynchus cepedianus')),
('sierra','Rostro en sierra','Sierra con dos barbillones largos y branquias en los costados (el pez sierra es una raya).',('file','Pristiophorus nudipinnis 591177769.jpg')),
('plano','Cuerpo plano','Aspecto de raya, pero con branquias laterales y boca en la punta del hocico: angelotes.',('sp','Squatina squatina')),
('martillo','Cefalofoil','Cabeza en martillo con los ojos en las puntas: cornudas (Sphyrnidae).',('sp','Sphyrna mokarran')),
('zorro','Cola de látigo','El lóbulo superior de la cola mide casi como el cuerpo: tiburones zorro.',('sp','Alopias vulpinus')),
('dientes','Dientes que asoman','Dientes finos y largos visibles con la boca cerrada: tiburones de arena.',('sp','Carcharias taurus')),
('quilla','Cola lunada con quilla','Cola en media luna y quilla en el pedúnculo: marrajos y tiburón blanco.',('sp','Isurus oxyrinchus')),
]
def meta(f):
    q=urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','iiprop':'extmetadata','titles':'File:'+f})
    d=json.load(urllib.request.urlopen(urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+q,headers={'User-Agent':UA}),timeout=60))
    p=list(d['query']['pages'].values())[0]
    m=p['imageinfo'][0]['extmetadata'];g=lambda k:html.unescape(re.sub('<[^>]+>','',m.get(k,{}).get('value','')))
    return {'license':g('LicenseShortName'),'author':g('Artist') or g('Credit'),'url':'https://commons.wikimedia.org/wiki/File:'+urllib.parse.quote(f.replace(' ','_'))}
os.makedirs('../img/parts',exist_ok=True);out=[]
for id,t,d,(k,v) in P:
    if k=='sp':
        s=SP.get(v)
        if not s or not s.get('img'):print('sin foto',v);continue
        out.append({'id':id,'t':t,'d':d,**s['img'],'sp':v});continue
    m=meta(v);time.sleep(1)
    if not OK.match(m['license'] or ''):print('licencia no libre',v,m['license']);continue
    ext='svg' if v.lower().endswith('.svg') else 'jpg'
    path=f'../img/parts/{id}.{ "png" if ext=="svg" else "jpg"}'
    u='https://commons.wikimedia.org/wiki/Special:FilePath/'+urllib.parse.quote(v)+'?width=700'
    for a in range(5):
        try:
            open(path,'wb').write(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=60).read());break
        except Exception as e:time.sleep(5+a*5)
    else:print('fallo',v);continue
    out.append({'id':id,'t':t,'d':d,'file':path[3:],**m});time.sleep(1)
json.dump(out,open('../data/parts.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(out),'partes')
