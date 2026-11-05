"""Busca en Commons por nombre científico foto para especies sin foto (uso personal) -> images_extra.json"""
import json,urllib.request,urllib.parse,re,os,time,html
UA="TiburonesStudyApp/1.0 (personal learning project)"
def get(u):
    for a in range(5):
        try:return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=40))
        except Exception:time.sleep(4+a*6)
sp=json.load(open('../data/species.json'))
try:out=json.load(open('images_extra.json'))
except Exception:out={}
todo=[s for s in sp if not s['img'] and s['id'] not in out]
print(len(todo),'pendientes',flush=True)
BAD=re.compile(r'map|distmap|\.pdf|\.svg|\.ogv|\.tif|tooth|teeth|jaw|egg|skeleton|range',re.I)
for i,s in enumerate(todo):
    q=get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','list':'search','srsearch':f'"{s["n"]}"','srnamespace':6,'srlimit':8}));time.sleep(1)
    cand=[r['title'][5:] for r in (q or {}).get('query',{}).get('search',[]) if re.search(r'\.jpe?g$|\.png$',r['title'],re.I) and not BAD.search(r['title']) and s['g'].lower() in r['title'].lower()]
    if not cand:continue
    f=cand[0];key=re.sub(r'[^a-z0-9]+','-',s['n'].lower()).strip('-');path=f'../img/species/{key}.jpg'
    try:open(path,'wb').write(urllib.request.urlopen(urllib.request.Request('https://commons.wikimedia.org/wiki/Special:FilePath/'+urllib.parse.quote(f)+'?width=520',headers={'User-Agent':UA}),timeout=60).read())
    except Exception:continue
    out[s['id']]={'file':f'img/species/{key}.jpg','license':'Commons (uso personal)','author':'Wikimedia Commons','url':'https://commons.wikimedia.org/wiki/File:'+urllib.parse.quote(f.replace(' ','_'))}
    time.sleep(1)
    if i%10==0:json.dump(out,open('images_extra.json','w'),ensure_ascii=False);print(i,len(out),flush=True)
json.dump(out,open('images_extra.json','w'),ensure_ascii=False);print('fin',len(out),flush=True)
