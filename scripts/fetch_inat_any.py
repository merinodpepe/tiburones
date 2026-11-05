"""Foto de iNaturalist (cualquier licencia, uso personal) para especies sin foto -> ../img/species + images_inat.json"""
import json,urllib.request,urllib.parse,re,os,time
UA="TiburonesStudyApp/1.0 (personal learning project)"
def get(u):
    for a in range(5):
        try:return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=40))
        except Exception:time.sleep(4+a*6)
sp=json.load(open('../data/species.json'))
try:out=json.load(open('images_inat.json'))
except Exception:out={}
have={s['id'] for s in sp if s['img']}|set(out)
todo=[s for s in sp if s['id'] not in have]
print(len(todo),'pendientes',flush=True)
LIC={'cc0':'CC0','cc-by':'CC BY','cc-by-sa':'CC BY-SA'}
for i,s in enumerate(todo):
    q=get('https://api.inaturalist.org/v1/taxa?'+urllib.parse.urlencode({'q':s['n'],'rank':'species','per_page':5}));time.sleep(1.0)
    t=next((t for t in (q or {}).get('results',[]) if t['name'].lower()==s['n'].lower()),None)
    ph=t and t.get('default_photo')
    if not ph or not ph.get('medium_url'):continue
    key=re.sub(r'[^a-z0-9]+','-',s['n'].lower()).strip('-');path=f'../img/species/{key}.jpg'
    try:open(path,'wb').write(urllib.request.urlopen(urllib.request.Request(ph['medium_url'],headers={'User-Agent':UA}),timeout=60).read())
    except Exception:continue
    lc=(ph.get('license_code') or '').lower()
    out[s['id']]={'file':f'img/species/{key}.jpg','license':LIC.get(lc,'© todos los derechos (uso personal)'),'author':re.sub(r'\s*\(.*$','',(ph.get('attribution') or '').replace('(c) ','')) or 'iNaturalist','url':f"https://www.inaturalist.org/taxa/{t['id']}",'free':lc in LIC}
    if i%10==0:json.dump(out,open('images_inat.json','w'),ensure_ascii=False);print(i,len(out),flush=True)
json.dump(out,open('images_inat.json','w'),ensure_ascii=False);print('fin',len(out),flush=True)
