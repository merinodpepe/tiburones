import json,urllib.request,urllib.parse,sys
UA="TiburonesStudyApp/1.0 (personal learning project)"
qs=sys.argv[1:]
for q in qs:
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','list':'search','srsearch':q,'srnamespace':6,'srlimit':8})
    d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=40))
    print('##',q)
    for r in d['query']['search']:print('  ',r['title'])
