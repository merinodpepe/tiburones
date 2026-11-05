/* ===== DATOS: 9 órdenes y 34 familias (nº de especies aproximado) ===== */
const O=[
 {id:'HEX',h:270,es:'Hexanchiformes',com:'Cañabotas y tiburón anguila',ct:7,rule:'Una sola dorsal + aleta anal + 6–7 branquias.'},
 {id:'SQU',h:215,es:'Squaliformes',com:'Mielgas, quelvachos y tiburones de profundidad',ct:140,rule:'Sin aleta anal; dos dorsales, casi siempre con espina.'},
 {id:'ECH',h:185,es:'Echinorhiniformes',com:'Tiburones de clavos',ct:2,rule:'Sin aleta anal ni espinas; dorsales pequeñas muy atrás.'},
 {id:'PRI',h:150,es:'Pristiophoriformes',com:'Tiburones sierra',ct:8,rule:'Rostro en sierra con dos barbillones; sin aleta anal.'},
 {id:'SQT',h:95,es:'Squatiniformes',com:'Angelotes',ct:25,rule:'Cuerpo aplanado, boca terminal, sin aleta anal.'},
 {id:'HET',h:55,es:'Heterodontiformes',com:'Tiburones cabeza de toro',ct:9,rule:'Espina en cada dorsal + aleta anal.'},
 {id:'ORE',h:25,es:'Orectolobiformes',com:'Alfombra, nodriza, cebra y ballena',ct:45,rule:'Boca delante de los ojos, barbillones nasales, dos dorsales sin espina.'},
 {id:'LAM',h:350,es:'Lamniformes',com:'Marrajos, zorros, peregrino y afines',ct:15,rule:'Con aleta anal, sin espinas, sin membrana nictitante.'},
 {id:'CAR',h:305,es:'Carcharhiniformes',com:'Pintarrojas, cazones, requiems y cornudas',ct:290,rule:'Con aleta anal, sin espinas, con membrana nictitante.'}
];
const F=[];
const f=(id,o,es,la,n,s,r,g,ej,t=[])=>F.push({id,o,es,la,n,s,r,g,ej,t});
/* s = parámetros de la silueta (ver sil()); r = rasgos; g = gancho; ej = [nombre, especie] */
f('hex','HEX','Cañabotas','Hexanchidae',5,{hb:14,sn:'round',d:1,d1:14,pec:15,gills:7},
 ['6 o 7 branquias','Una sola dorsal, muy atrás','Con aleta anal','Cuerpo robusto, hocico romo'],
 'Cuenta las branquias: 6 o 7, y una sola dorsal.',
 [['Cañabota gris','Hexanchus griseus'],['Tiburón de siete branquias','Notorynchus cepedianus'],['Cañabota ojigrande','Heptranchias perlo']]);
f('chl','HEX','Tiburones anguila','Chlamydoselachidae',2,{hb:6,sn:'blunt',tail:'paddle',d:1,d1:9,pec:9,gills:6},
 ['Cuerpo de anguila','6 branquias con bordes de volante','Boca terminal, dientes de tres puntas','Una dorsal retrasada'],
 'Anguila con volantes en las branquias.',
 [['Tiburón anguila','Chlamydoselachus anguineus'],['Tiburón anguila africano','Chlamydoselachus africana']],['Aguas profundas']);
f('sqd','SQU','Mielgas','Squalidae',35,{hb:9,sn:'point',d1:13,d2:9,pec:12,anal:0,sp:1},
 ['Sin aleta anal','Espina delante de cada dorsal','Cuerpo esbelto y hocico en punta'],
 'Un pincho por dorsal: el cazón espinoso.',
 [['Mielga','Squalus acanthias'],['Galludo','Squalus blainville']],['Espinas dorsales']);
f('ctr','SQU','Quelvachos','Centrophoridae',16,{hb:10,sn:'point',d1:12,d2:11,pec:12,anal:0,sp:1},
 ['Sin aleta anal','Espinas en ambas dorsales','Hocico largo y ojos grandes','Aguas profundas'],
 'Mielga de profundidad: hocico largo y espinas marcadas.',
 [['Quelvacho','Centrophorus granulosus'],['','Deania calcea']],['Espinas dorsales','Aguas profundas']);
f('etm','SQU','Tiburones linterna','Etmopteridae',55,{hb:8,sn:'blunt',d1:10,d2:10,pec:8,anal:0,sp:1,deco:'photo'},
 ['Pequeños (la mayoría menos de 1 m)','Fotóforos: puntos luminosos en el vientre','Espinas en ambas dorsales','Sin aleta anal'],
 'Linterna encendida en la panza.',
 [['Negrito','Etmopterus spinax'],['Tiburón víbora','Trigonognathus kabeyai']],['Bioluminiscentes','Aguas profundas','Espinas dorsales']);
f('som','SQU','Tiburones dormilones','Somniosidae',17,{hb:15,sn:'round',d1:9,d2:8,pec:11,anal:0},
 ['Sin aleta anal','Dorsales pequeñas y bajas','Cuerpo cilíndrico y robusto','Aguas frías y profundas'],
 'Gordo, lento y de dorsales diminutas.',
 [['Tiburón de Groenlandia','Somniosus microcephalus'],['Pailona común','Centroscymnus coelolepis']],['Aguas profundas']);
f('oxy','SQU','Peces cerdo','Oxynotidae',5,{hb:17,sn:'blunt',d1:21,d2:20,pec:12,anal:0,sp:1},
 ['Sin aleta anal','Dos dorsales altas como velas, con espina','Cuerpo alto, de sección triangular','Piel muy áspera'],
 'Dos velas triangulares sobre un cuerpo alto.',
 [['Pez cerdo','Oxynotus centrina'],['','Oxynotus bruniensis']],['Espinas dorsales']);
f('dal','SQU','Dalátidos','Dalatiidae',10,{hb:8,sn:'blunt',d1:8,d2:8,pec:9,anal:0,deco:'photo'},
 ['Sin aleta anal','Cuerpo fusiforme, casi cilíndrico','Dientes inferiores grandes y cortantes','Muchos son luminiscentes'],
 'Cuerpo de cigarro y mordisco redondo (Isistius).',
 [['Tiburón cigarro','Isistius brasiliensis'],['','Dalatias licha'],['','Squaliolus laticaudus']],['Bioluminiscentes','Aguas profundas']);
f('ech','ECH','Tiburones de clavos','Echinorhinidae',2,{hb:15,sn:'blunt',d1:9,d2:9,pec:11,anal:0},
 ['Sin aleta anal ni espinas','Dos dorsales pequeñas y retrasadas','Piel con grandes dentículos como clavos','Cuerpo robusto, hocico corto'],
 'Piel de clavos y dorsales escondidas atrás.',
 [['Tiburón de clavos','Echinorhinus brucus'],['','Echinorhinus cookei']]);
f('pri','PRI','Tiburones sierra','Pristiophoridae',8,{hb:8,sn:'point',x:'saw',d1:11,d2:10,pec:14,anal:0},
 ['Rostro alargado en forma de sierra','Dos barbillones largos a mitad del rostro','Sin aleta anal','Branquias en los costados'],
 'Sierra con dos bigotes. Ojo: el pez sierra es una raya, con branquias en el vientre.',
 [['Tiburón sierra común','Pristiophorus cirratus'],['Tiburón sierra de seis branquias','Pliotrema warreni']],['Hocico/cabeza rara','Barbillones']);
f('sqt','SQT','Angelotes','Squatinidae',25,{x:'flat'},
 ['Cuerpo aplanado, aspecto de raya','Branquias laterales, pectorales separadas de la cabeza','Boca en la punta del hocico','Sin aleta anal'],
 'Raya con branquias de tiburón, enterrada en la arena.',
 [['Angelote','Squatina squatina'],['Angelote del Pacífico','Squatina californica']],['Aplanados']);
f('het','HET','Tiburones cabeza de toro','Heterodontidae',9,{hb:15,sn:'blunt',d1:16,d2:14,pec:18,sp:1},
 ['Espina en cada dorsal','Cresta ósea sobre los ojos','Con aleta anal','Dientes delanteros punzantes, traseros planos'],
 'Aleta anal + espina en cada dorsal: combinación única.',
 [['Tiburón cornudo','Heterodontus francisci'],['Tiburón de Port Jackson','Heterodontus portusjacksoni']],['Espinas dorsales']);
f('par','ORE','Alfombra de collar','Parascylliidae',8,{hb:6,sn:'round',d1:9,d2:9,pec:9,x:'barb'},
 ['Pequeños y muy esbeltos','Barbillones nasales','Dos dorsales muy retrasadas','Algunos con collar oscuro'],
 'Alfombrita esbelta con barbillones.',
 [['Tiburón alfombra de collar','Parascyllium collare']],['Barbillones']);
f('bra','ORE','Tiburones ciegos','Brachaeluridae',2,{hb:12,sn:'round',d1:14,d2:12,pec:14,x:'barb',deco:'saddle'},
 ['Cuerpo robusto con barbillones nasales','Boca delante de los ojos','Dos dorsales sin espinas','Aguanta fuera del agua en charcas de marea'],
 'Robusto, con barbillones, sobrevive en seco entre mareas.',
 [['Tiburón ciego','Brachaelurus waddi'],['','Heteroscyllium colcloughi']],['Barbillones']);
f('ore','ORE','Wobbegongs','Orectolobidae',12,{hb:12,sn:'blunt',d1:13,d2:12,pec:17,x:'fringe',deco:'saddle'},
 ['Aplanados, camuflaje en mosaico','Flecos de piel alrededor de la boca','Boca delante de los ojos, con barbillones','Dos dorsales sin espinas'],
 'Alfombra con flecos alrededor de la boca.',
 [['Wobbegong manchado','Orectolobus maculatus'],['Wobbegong de flecos','Eucrossorhinus dasypogon']],['Aplanados','Barbillones']);
f('hem','ORE','Tiburones bambú','Hemiscylliidae',17,{hb:7,sn:'round',d1:11,d2:11,pec:13,tk:1.4,xp:128,deco:'bands'},
 ['Esbeltos, de cola muy larga','Dos dorsales retrasadas casi iguales','Barbillones nasales','Algunos "caminan" por el fondo con las aletas'],
 'Cola larga y a veces caminan con las aletas.',
 [['Tiburón bambú','Chiloscyllium plagiosum'],['Tiburón epaulette','Hemiscyllium ocellatum']],['Barbillones']);
f('gin','ORE','Tiburones nodriza','Ginglymostomatidae',4,{hb:14,sn:'blunt',d1:13,d2:12,pec:16,x:'barb'},
 ['Cuerpo robusto, pardo uniforme','Barbillones nasales cortos y gruesos','Dos dorsales casi iguales, muy atrás','Descansa en el fondo, a veces en grupos'],
 'Pardo liso, barbillones gordos y siesta en el fondo.',
 [['Tiburón nodriza','Ginglymostoma cirratum'],['Tiburón nodriza leonado','Nebrius ferrugineus']],['Barbillones']);
f('ste','ORE','Tiburón cebra','Stegostomatidae',1,{hb:11,sn:'round',d1:16,d2:11,pec:16,tk:1.9,xp:104,x:'barb',deco:'spots'},
 ['Cola larguísima, casi como el cuerpo','Crestas longitudinales en el cuerpo','Juveniles a rayas, adultos moteados','Barbillones nasales cortos'],
 'La cola mide casi como el cuerpo.',
 [['Tiburón cebra','Stegostoma tigrinum']],['Cola larguísima','Barbillones']);
f('rhi','ORE','Tiburón ballena','Rhincodontidae',1,{hb:19,sn:'blunt',tail:'lunate',d1:20,d2:11,pec:18,deco:'grid'},
 ['El pez más grande: hasta unos 12 m','Boca ancha en la punta del hocico','Damero de puntos y líneas blancas','Tres crestas a cada lado'],
 'Gigante con damero de puntos blancos.',
 [['Tiburón ballena','Rhincodon typus']],['Filtradores']);
f('odo','LAM','Tiburones de arena','Odontaspididae',3,{hb:15,sn:'round',d1:16,d2:14,pec:15},
 ['Dientes largos y finos, visibles con la boca cerrada','Segunda dorsal y anal casi tan grandes como la primera','Cuerpo robusto, hocico cónico','Cola asimétrica, lóbulo superior largo'],
 'Dientes de aguja que se ven con la boca cerrada.',
 [['Tiburón de arena','Carcharias taurus'],['Solrayo','Odontaspis ferox']]);
f('mit','LAM','Tiburón duende','Mitsukurinidae',1,{hb:11,sn:'point',x:'beak',d1:10,d2:9,pec:12},
 ['Hocico larguísimo y plano, como un espolón','Mandíbulas que se proyectan hacia delante','Piel rosada, casi translúcida','Dorsales redondeadas y bajas'],
 'Hocico en espolón y mandíbula que salta.',
 [['Tiburón duende','Mitsukurina owstoni']],['Hocico/cabeza rara','Aguas profundas']);
f('pse','LAM','Tiburón cocodrilo','Pseudocarchariidae',1,{hb:9,sn:'round',d1:10,d2:9,pec:12},
 ['Pequeño y cilíndrico (hasta ~1 m)','Ojos muy grandes','Dientes largos y finos','Dorsales pequeñas y retrasadas'],
 'Pequeño, ojos enormes y dientes de aguja.',
 [['Tiburón cocodrilo','Pseudocarcharias kamoharai']]);
f('meg','LAM','Tiburón bocudo','Megachasmidae',1,{hb:17,sn:'blunt',d1:14,d2:9,pec:15},
 ['Boca enorme y terminal con borde claro','Cabeza grande y roma','Dientes diminutos: filtra krill','Cola asimétrica'],
 'Bocaza con borde claro: filtra krill.',
 [['Tiburón bocudo','Megachasma pelagios']],['Filtradores']);
f('alo','LAM','Tiburones zorro','Alopiidae',3,{hb:11,sn:'round',tail:'long',d1:17,d2:6,pec:20},
 ['Lóbulo superior de la cola casi tan largo como el cuerpo','Segunda dorsal diminuta','Pectorales largas y curvas'],
 'La cola superior es un látigo del largo del cuerpo.',
 [['Tiburón zorro','Alopias vulpinus'],['Zorro pelágico','Alopias pelagicus'],['Zorro ojón','Alopias superciliosus']],['Cola larguísima']);
f('cet','LAM','Tiburón peregrino','Cetorhinidae',1,{hb:17,sn:'round',tail:'lunate',d1:20,d2:8,pec:16,x:'keel'},
 ['Boca enorme que se abre al filtrar','Branquias que casi rodean la cabeza','Hocico cónico y cola semilunar con quilla','Segundo pez más grande: ~10 m'],
 'Boca enorme y branquias que rodean la cabeza.',
 [['Tiburón peregrino','Cetorhinus maximus']],['Filtradores']);
f('lam','LAM','Marrajos y tiburón blanco','Lamnidae',5,{hb:17,sn:'point',tail:'lunate',d1:22,d2:6,pec:20,x:'keel'},
 ['Cuerpo en torpedo','Cola en media luna con quilla en el pedúnculo','Segunda dorsal y anal diminutas','Mantienen el cuerpo más caliente que el agua'],
 'Torpedo con cola en media luna.',
 [['Tiburón blanco','Carcharodon carcharias'],['Marrajo dientuso','Isurus oxyrinchus'],['Marrajo sardinero','Lamna nasus']]);
f('sci','CAR','Pintarrojas y gatos','Scyliorhinidae',160,{hb:8,sn:'round',d1:10,d2:9,pec:11,deco:'spots'},
 ['Pequeños y alargados (la mayoría menos de 1 m)','Ojos alargados, de gato','Dorsales retrasadas','Ponen huevos en cápsulas córneas'],
 'Pequeña, alargada y con ojos de gato.',
 [['Pintarroja','Scyliorhinus canicula'],['Alitán','Scyliorhinus stellaris']]);
f('pro','CAR','Gatos de dorsales bajas','Proscylliidae',6,{hb:6,sn:'round',d1:8,d2:8,pec:9},
 ['Muy pequeños y esbeltos','Dorsales bajas y alargadas','Membrana nictitante','Pocas especies (unas 6)'],
 'Gatos esbeltos de dorsales bajas.',
 [['','Proscyllium habereri'],['','Eridacnis radcliffei']]);
f('psu','CAR','Falsos gatos','Pseudotriakidae',3,{hb:12,sn:'round',d1:12,d2:10,pec:13},
 ['Primera dorsal larga y baja, como una cresta','Cuerpo flácido y aceitoso','Dientes pequeños en muchas hileras','Aguas profundas'],
 'Dorsal larga y baja, como una cresta.',
 [['Tiburón gato falso','Pseudotriakis microdon'],['','Gollum attenuatus']],['Aguas profundas']);
f('lep','CAR','Tiburón barbudo','Leptochariidae',1,{hb:7,sn:'round',d1:10,d2:9,pec:11,x:'barb'},
 ['Barbillones en las narinas','Cuerpo esbelto, hasta ~80 cm','Dos dorsales sin espinas','Costas tropicales de África occidental'],
 'Barbillones y cuerpo fino: el barbudo de África.',
 [['Tiburón barbudo','Leptocharias smithii']],['Barbillones']);
f('tri','CAR','Musolas y cazones','Triakidae',45,{hb:10,sn:'round',d1:14,d2:12,pec:14,deco:'spots'},
 ['Medianos y esbeltos','Ojos ovalados con membrana nictitante','Segunda dorsal casi tan grande como la primera','Mustelus: dientes planos en mosaico'],
 'Ojos ovalados y dos dorsales de tamaño parecido.',
 [['Musola','Mustelus mustelus'],['Cazón','Galeorhinus galeus'],['Tiburón leopardo','Triakis semifasciata']]);
f('hmg','CAR','Tiburones comadreja','Hemigaleidae',8,{hb:9,sn:'round',d1:14,d2:11,pec:12},
 ['Esbeltos, de hocico corto','Segunda dorsal casi igual a la primera','Membrana nictitante','Hemipristis: dientes serrados que asoman con la boca cerrada'],
 'Delgados; en Hemipristis los dientes asoman.',
 [['Tiburón comadreja','Hemigaleus microstoma'],['','Hemipristis elongata']]);
f('car','CAR','Tiburones requiem','Carcharhinidae',57,{hb:13,sn:'round',d1:19,d2:8,pec:17},
 ['Membrana nictitante','Primera dorsal alta y triangular','Segunda dorsal pequeña, sin espinas','Medianos a grandes, de aguas cálidas'],
 'Dorsal alta y triangular + membrana nictitante.',
 [['Tiburón azul (tintorera)','Prionace glauca'],['Tiburón tigre','Galeocerdo cuvier'],['Tiburón toro','Carcharhinus leucas'],['Tiburón de puntas negras','Carcharhinus melanopterus']]);
f('sph','CAR','Cornudas','Sphyrnidae',10,{hb:12,sn:'round',x:'hammer',d1:22,d2:8,pec:16},
 ['Cabeza aplanada en martillo (cefalofoil)','Ojos en los extremos de la cabeza','Primera dorsal muy alta','Membrana nictitante'],
 'Cabeza en martillo con los ojos en las puntas.',
 [['Cornuda gigante','Sphyrna mokarran'],['Cornuda cruz','Sphyrna zygaena']],['Hocico/cabeza rara']);

f('pen','CAR','Pintarrojas de profundidad','Pentanchidae',69,{hb:7,sn:'round',d1:9,d2:8,pec:10,deco:'spots'},
 ['Gatos pequeños, la mayoría de aguas profundas','Ojos alargados y dorsales retrasadas','Ponen huevos en cápsulas córneas','Hasta 2013 se contaban dentro de Scyliorhinidae'],
 'Gatos de profundidad: antes eran pintarrojas.',
 [],['Aguas profundas']);
f('gal','CAR','Tiburón tigre','Galeocerdonidae',1,{hb:15,sn:'blunt',d1:17,d2:8,pec:16,deco:'bands'},
 ['Una sola especie viva','Rayas verticales que se difuminan con la edad','Hocico romo y cabeza ancha','Dientes con muesca, como cresta de gallo'],
 'Rayas de tigre y hocico romo: familia de una sola especie.',
 []);
