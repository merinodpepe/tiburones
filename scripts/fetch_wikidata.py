"""Descarga de Wikidata todos los taxones bajo 'shark' (Q7372) -> raw_taxa.json"""
import json, urllib.request, urllib.parse
UA = "TiburonesStudyApp/1.0 (personal learning project)"
Q = """
SELECT ?t ?name ?rank ?parent ?es ?en ?img ?iucn ?iucnL ?fb ?iid WHERE {
  ?t wdt:P171* wd:Q7372 .
  ?t wdt:P225 ?name . ?t wdt:P105 ?rank .
  OPTIONAL { ?t wdt:P171 ?parent }
  OPTIONAL { ?t rdfs:label ?es FILTER(lang(?es)='es') }
  OPTIONAL { ?t rdfs:label ?en FILTER(lang(?en)='en') }
  OPTIONAL { ?t wdt:P18 ?img }
  OPTIONAL { ?t wdt:P938 ?fb }
  OPTIONAL { ?t wdt:P627 ?iid }
  OPTIONAL { ?t wdt:P141 ?iucn . ?iucn rdfs:label ?iucnL FILTER(lang(?iucnL)='en') }
}"""
url = "https://query.wikidata.org/sparql?format=json&query=" + urllib.parse.quote(Q)
d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120))
json.dump(d["results"]["bindings"], open("raw_taxa.json", "w"), ensure_ascii=False)
print(len(d["results"]["bindings"]))
