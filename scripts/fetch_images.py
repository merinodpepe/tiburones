"""Metadatos de licencia de las fotos P18 en Commons; descarga miniaturas libres -> ../img/species/ + images.json"""
import json,urllib.request,urllib.parse,urllib.parse as up,re,os,time,html
UA="TiburonesStudyApp/1.0 (personal learning project; merinodpepe@gmail.com)"
sp=json.load(open('species_raw.json'))
def fname(u): return up.unquote(u.rsplit('/',1)[-1])
files={fname(s['img']) for s in sp if s['img']}
print(len(files),'archivos')
OK=re.compile(r'^(cc0|cc[- ]by(-sa)?[- ]\d|public domain|pd)',re.I)
meta={}
fl=sorted(files)
for i in range(0,len(fl),40):
    ch=fl[i:i+40]
    q=urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','iiprop':'extmetadata','titles':'|'.join('File:'+f for f in ch)})
    d=json.load(urllib.request.urlopen(urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+q,headers={'User-Agent':UA}),timeout=60))
    norm={n['to']:n['from'] for n in d['query'].get('normalized',[])}
    for p in d['query']['pages'].values():
        ii=p.get('imageinfo');
        if not ii:continue
        m=ii[0]['extmetadata']
        g=lambda k:html.unescape(re.sub('<[^>]+>','',m.get(k,{}).get('value','')))
        t=p['title'][5:]
        meta[t]={'license':g('LicenseShortName'),'author':g('Artist') or g('Credit'),'url':'https://commons.wikimedia.org/wiki/'+urllib.parse.quote(p['title'].replace(' ','_'))}
    time.sleep(.5)
good={k.replace(' ','_'):v for k,v in meta.items() if OK.match(v['license'] or '')}
print(len(meta),'con metadatos;',len(good),'con licencia libre')
os.makedirs('../img/species',exist_ok=True)
out={}
for s in sp:
    if not s['img']:continue
    f=fname(s['img']);m=good.get(f.replace(' ','_'))
    if not m:continue
    key=re.sub(r'[^a-z0-9]+','-',s['name'].lower()).strip('-')
    path=f'../img/species/{key}.jpg'
    if not os.path.exists(path):
        u='https://commons.wikimedia.org/wiki/Special:FilePath/'+urllib.parse.quote(f)+'?width=520'
        for a in range(4):
            try:
                data=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=60).read()
                open(path,'wb').write(data);break
            except Exception as e:
                time.sleep(3+a*4)
        else:
            print('fallo',f);continue
        time.sleep(.4)
    out[s['wd']]={'file':f'img/species/{key}.jpg',**m}
json.dump(out,open('images.json','w'),ensure_ascii=False)
print(len(out),'fotos descargadas')
