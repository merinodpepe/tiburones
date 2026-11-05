"""Hábitat, profundidad, tamaño y peso de FishBase (resumen de especie) -> fishbase_data.json"""
import json,re,html,urllib.request,time
UA="Mozilla/5.0 TiburonesStudyApp/1.0 (personal learning project)"
sp=json.load(open('../data/species.json'))
try:out=json.load(open('fishbase_data.json'))
except Exception:out={}
def clean(t):return re.sub(r'\s*\(Ref\.[^)]*\)','',t).strip()
for i,s in enumerate(sp):
    if s['id'] in out:continue
    url=f"https://www.fishbase.se/summary/SpeciesSummary.php?ID={s['fb']}" if s['fb'] else "https://www.fishbase.se/summary/"+s['n'].replace(' ','-')+".html"
    h=None
    for a in range(3):
        try:h=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=40).read().decode('utf8','ignore');break
        except Exception:time.sleep(4+a*5)
    time.sleep(1.2)
    if not h:continue
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',h,flags=re.S);t=html.unescape(re.sub(r'<[^>]+>',' ',t));t=re.sub(r'\s+',' ',t)
    d={}
    m=re.search(r'Ecology (.*?) (?:Distribution Territories|Subtropical|Tropical|Temperate|Deep-water|Polar|Boreal)',t)
    if m:d['env']=clean(m.group(1))
    m=re.search(r'Ecology .*? ((?:Subtropical|Tropical|Temperate|Deep-water|Polar|Boreal)[^D]*?)(?: Distribution Territories)',t)
    if m:d['clima']=clean(m.group(1))
    m=re.search(r'Max length : ([\d.]+) cm (\w+)',t)
    if m:d['len_cm']=float(m.group(1));d['len_t']=m.group(2)
    m=re.search(r'max\. published weight: ([\d.]+) (g|kg)',t)
    if m and float(m.group(1))>0:d['w_kg']=float(m.group(1))/(1000 if m.group(2)=='g' else 1)
    m=re.search(r'Dorsal spines \(total\): (\d+)',t)
    if m:d['dsp']=int(m.group(1))
    m=re.search(r'Faunafri (.*?) (?:Length at first maturity|Size / Weight)',t)
    if m:d['dist']=clean(m.group(1))[:200]
    out[s['id']]=d
    if i%25==0:json.dump(out,open('fishbase_data.json','w'),ensure_ascii=False);print(i,len(out),flush=True)
json.dump(out,open('fishbase_data.json','w'),ensure_ascii=False);print('fin',len(out),flush=True)
