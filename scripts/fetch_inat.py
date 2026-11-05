"""Fotos CC0/CC-BY/CC-BY-SA de iNaturalist para especies sin foto de Commons -> ../img/species + images_inat.json"""
import json,urllib.request,urllib.parse,re,os,time,sys
UA="TiburonesStudyApp/1.0 (personal learning project)"
def get(u):
    for a in range(5):
        try:return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=40))
        except Exception as e:time.sleep(4+a*6)
    return None
sp=json.load(open('../data/species.json'))
try:out=json.load(open('images_inat.json'))
except Exception:out={}
todo=[s for s in sp if not s['img'] and s['id'] not in out]
print(len(todo),'pendientes',flush=True)
for i,s in enumerate(todo):
    q=get('https://api.inaturalist.org/v1/taxa?'+urllib.parse.urlencode({'q':s['n'],'rank':'species','per_page':5}));time.sleep(1.1)
    tid=None
    for t in (q or {}).get('results',[]):
        if t['name'].lower()==s['n'].lower():tid=t['id'];break
    if not tid:continue
    o=get('https://api.inaturalist.org/v1/observations?'+urllib.parse.urlencode({'taxon_id':tid,'photo_license':'cc0,cc-by,cc-by-sa','quality_grade':'research','order_by':'votes','per_page':1,'photos':'true'}));time.sleep(1.1)
    r=(o or {}).get('results',[])
    if not r:continue
    ph=r[0]['photos'][0];lic=(ph.get('license_code') or '').upper()
    if lic not in('CC0','CC-BY','CC-BY-SA'):continue
    url=ph['url'].replace('square','medium')
    key=re.sub(r'[^a-z0-9]+','-',s['n'].lower()).strip('-');path=f'../img/species/{key}.jpg'
    try:
        open(path,'wb').write(urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=60).read())
    except Exception:continue
    out[s['id']]={'file':f'img/species/{key}.jpg','license':lic.replace('CC-BY-SA','CC BY-SA').replace('CC-BY','CC BY'),'author':re.sub(r'\s*\(.*$','',ph.get('attribution','').replace('(c) ','')) or 'iNaturalist','url':f"https://www.inaturalist.org/observations/{r[0]['id']}"}
    if i%10==0:json.dump(out,open('images_inat.json','w'),ensure_ascii=False);print(i,len(out),flush=True)
json.dump(out,open('images_inat.json','w'),ensure_ascii=False);print('fin',len(out),flush=True)
