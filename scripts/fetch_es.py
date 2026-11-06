import json,urllib.request,urllib.parse,time
sp=json.load(open('data/species.json'))
sp=sp if isinstance(sp,list) else sp.get('species',sp)
ids=[x['id'] for x in sp];out={}
for i in range(0,len(ids),50):
    b=ids[i:i+50]
    u='https://www.wikidata.org/w/api.php?'+urllib.parse.urlencode({'action':'wbgetentities','ids':'|'.join(b),'props':'labels|aliases|sitelinks','languages':'es','sitefilter':'eswiki','format':'json'})
    r=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'tiburones-personal/1.0'})))
    for q,e in r['entities'].items():
        lab=e.get('labels',{}).get('es',{}).get('value');sl=e.get('sitelinks',{}).get('eswiki',{}).get('title')
        al=[a['value'] for a in e.get('aliases',{}).get('es',[])]
        out[q]={'label':lab,'wiki':sl,'alias':al}
    time.sleep(3)
json.dump(out,open('scripts/es_raw.json','w'),ensure_ascii=False)
n={x['id']:x['n'] for x in sp}
good=[q for q,v in out.items() if (v['label'] or v['wiki']) and (v['label'] or v['wiki']).lower()!=n[q].lower()]
print(len(good),len(ids));[print(n[q],'→',out[q]['label'],out[q]['wiki']) for q in good[:25]]
