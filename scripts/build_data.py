"""species_raw.json + images.json + familias de js/data.js -> ../data/species.json"""
import json,re
sp=json.load(open('species_raw.json'))
im={}
for f in ('images.json','images_inat.json'):
    try: im.update({k:v for k,v in json.load(open(f)).items() if k not in im})
    except Exception: pass
src=open('../js/data.js').read()
fam={m.group(2):m.group(1) for m in re.finditer(r"^f\('(\w+)','\w+','[^']*','(\w+)'",src,re.M)}
ordmap={'Hexanchiformes':'HEX','Squaliformes':'SQU','Echinorhiniformes':'ECH','Pristiophoriformes':'PRI','Squatiniformes':'SQT','Heterodontiformes':'HET','Orectolobiformes':'ORE','Lamniformes':'LAM','Carcharhiniformes':'CAR'}
out=[];miss=set()
for s in sorted(sp,key=lambda s:(s['order'],s['family'],s['genus'],s['name'])):
    f=fam.get(s['family'])
    if not f: miss.add(s['family']);continue
    es=s['es'] if s['es'] and s['es']!=s['name'] else ''
    en=s['en'] if s['en'] and s['en']!=s['name'] else ''
    rec={'id':s['wd'],'n':s['name'],'g':s['genus'],'f':f,'es':es,'en':en,'iucn':s['iucn'] or '','fb':s['fb'] or '','img':im.get(s['wd'])}
    out.append(rec)
print(len(out),'especies; familias sin mapa:',miss)
print('con foto',sum(1 for r in out if r['img']),'con nombre es',sum(1 for r in out if r['es']),'con nombre en',sum(1 for r in out if r['en']))
json.dump(out,open('../data/species.json','w'),ensure_ascii=False,separators=(',',':'))
