import json,re,collections
r=json.load(open('raw_taxa.json'))
nodes={}
for x in r:
    t=x['t']['value'].split('/')[-1]
    n=nodes.setdefault(t,{'id':t,'name':x['name']['value'],'rank':x['rank']['value'].split('/')[-1],'parents':set(),'fb':None,'iid':None,'es':None,'en':None,'img':None,'iucn':None})
    if 'parent' in x:n['parents'].add(x['parent']['value'].split('/')[-1])
    for k,src in (('fb','fb'),('iid','iid'),('es','es'),('en','en'),('img','img'),('iucn','iucnL')):
        if src in x:n[k]=x[src]['value']
RANK={'Q7432':'species','Q34740':'genus','Q35409':'family','Q36602':'order'}
EXTANT={'Echinorhiniformes','Heterodontiformes','Carcharhiniformes','Hexanchiformes','Lamniformes','Orectolobiformes','Squaliformes','Pristiophoriformes','Squatiniformes'}
def up(t,want,seen=0):
    n=nodes.get(t)
    if not n or seen>15:return None
    if RANK.get(n['rank'])==want:return n
    for p in n['parents']:
        a=up(p,want,seen+1)
        if a:return a
species=[];fams=collections.defaultdict(set);gens=collections.defaultdict(set)
for n in nodes.values():
    if n['rank']!='Q7432' or not(n['fb'] or n['iid']):continue
    g,f,o=up(n['id'],'genus'),up(n['id'],'family'),up(n['id'],'order')
    if not(g and f and o) or o['name'] not in EXTANT:continue
    species.append((n,g['name'],f['name'],o['name']))
    fams[(o['name'],f['name'])].add(g['name'])
print(len(species),len(fams))
for (o,f),g in sorted(fams.items()):
    c=sum(1 for s in species if s[2]==f)
    print(o,f,len(g),c)
json.dump([{'wd':n['id'],'name':n['name'],'genus':g,'family':f,'order':o,'es':n['es'],'en':n['en'],'img':n['img'],'iucn':n['iucn'],'fb':n['fb'],'iid':n['iid']} for n,g,f,o in species],open('species_raw.json','w'),ensure_ascii=False)
