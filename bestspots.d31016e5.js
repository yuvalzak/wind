const BEST_SPOTS=[
{name:'Kanaha Beach,Maui',lat:20.8978,lon:-156.4654,country:'USA'},
{name:"Ho'okipa Beach,Maui",lat:20.9333,lon:-156.3439,country:'USA'},
{name:'Crissy Field,San Francisco',lat:37.8047,lon:-122.4657,country:'USA',windguru:'https://www.windguru.cz/station/1502',webcam:'https://www.parksconservancy.org/parks/golden-gate-bridge-live-webcams'},
{name:'Sherman Island,CA Delta',lat:38.0333,lon:-121.7667,country:'USA'},
{name:'Columbia River Gorge,OR',lat:45.7028,lon:-121.5236,country:'USA',webcam:'https://www.portofhoodriver.com/live-cam-viewer'},
{name:'Cape Hatteras,NC',lat:35.2331,lon:-75.5296,country:'USA'},
{name:'Nags Head,NC',lat:35.9571,lon:-75.6246,country:'USA'},
{name:'Key West,Florida',lat:24.5551,lon:-81.7800,country:'USA'},
{name:'South Padre Island,TX',lat:26.0697,lon:-97.1664,country:'USA'},
{name:'Long Island Sound,NY',lat:40.9176,lon:-73.1282,country:'USA'},
{name:'Squamish,British Columbia',lat:49.7016,lon:-123.1558,country:'Canada'},
{name:'Goderich,Ontario',lat:43.7453,lon:-81.7167,country:'Canada'},
{name:'Niagara-on-the-Lake,ON',lat:43.2553,lon:-79.0711,country:'Canada'},
{name:'Iles-de-la-Madeleine,QC',lat:47.3833,lon:-61.8667,country:'Canada'},
{name:'Inverness,Nova Scotia',lat:46.2167,lon:-61.0833,country:'Canada'},
{name:'Tarifa,Spain',lat:36.0136,lon:-5.6065,country:'Spain',windguru:'https://www.windguru.cz/station/2667',webcam:'https://liamwhaleyprocenter.com/webcam/'},
{name:'El Medano,Tenerife',lat:28.0500,lon:-16.5333,country:'Spain',windguru:'https://www.windguru.cz/station/353',webcam:'https://www.skylinewebcams.com/en/webcam/espana/canarias/santa-cruz-de-tenerife/playa-de-el-medano.html'},
{name:'Fuerteventura-Sotavento',lat:28.0833,lon:-14.1167,country:'Spain',windguru:'https://www.windguru.cz/station/213'},
{name:'Valencia,Spain',lat:39.4542,lon:-0.3256,country:'Spain'},
{name:'Maresme Coast,Barcelona',lat:41.5000,lon:2.5000,country:'Spain'},
{name:'Leucate,France',lat:42.9097,lon:3.0281,country:'France',windguru:'https://www.windguru.cz/station/148',webcam:'https://en.tourisme-leucate.com/webcam/'},
{name:'La Torche,Brittany',lat:47.8500,lon:-4.3333,country:'France'},
{name:'Almanarre,France',lat:43.0833,lon:6.0833,country:'France',windguru:'https://www.windguru.cz/station/50'},
{name:'Gruissan,France',lat:43.0972,lon:3.0833,country:'France',windguru:'https://www.windguru.cz/station/243'},
{name:'Hyeres,France',lat:43.1200,lon:6.1200,country:'France',windguru:'https://www.windguru.cz/station/50'},
{name:'Fehmarn,Germany',lat:54.4617,lon:11.1900,country:'Germany',webcam:'https://fehmarn.me/'},
{name:'Sylt-Westerland',lat:54.9025,lon:8.3125,country:'Germany'},
{name:'Kuehlungsborn,Germany',lat:54.1467,lon:11.7439,country:'Germany'},
{name:'Timmendorfer Strand',lat:53.9986,lon:10.7758,country:'Germany'},
{name:'Ruegen-Dranske',lat:54.6333,lon:13.2167,country:'Germany'},
{name:'Brouwersdam,Netherlands',lat:51.7464,lon:3.8872,country:'Netherlands'},
{name:'Zandvoort,Netherlands',lat:52.3731,lon:4.5317,country:'Netherlands'},
{name:'Grevelingenmeer',lat:51.7333,lon:3.9000,country:'Netherlands'},
{name:'Haringvliet,Netherlands',lat:51.7833,lon:4.1333,country:'Netherlands'},
{name:'IJsselmeer-Workum',lat:52.9833,lon:5.4500,country:'Netherlands'},
{name:'Lake Garda-Torbole',lat:45.8753,lon:10.8739,country:'Italy',windguru:'https://www.windguru.cz/station/56',webcam:'https://www.skylinewebcams.com/en/webcam/italia/trentino-alto-adige/trento/garda-torbole.html'},
{name:'Lake Garda-Malcesine',lat:45.7667,lon:10.8333,country:'Italy',windguru:'https://www.windguru.cz/station/83'},
{name:'Taranto,Italy',lat:40.4644,lon:17.2472,country:'Italy'},
{name:'Cagliari-Poetto,Sardinia',lat:39.2100,lon:9.1700,country:'Italy'},
{name:'Porto Pollo,Sardinia',lat:41.1000,lon:9.3000,country:'Italy',webcam:'https://www.skylinewebcams.com/en/webcam/italia/sardegna/sassari/palau.html'},
{name:'Karpathos,Greece',lat:35.5074,lon:27.1483,country:'Greece',windguru:'https://www.windguru.cz/station/2170'},
{name:'Rhodes,Greece',lat:36.1944,lon:27.9694,country:'Greece'},
{name:'Paros,Greece',lat:37.0853,lon:25.1489,country:'Greece',windguru:'https://www.windguru.cz/station/1919'},
{name:'Naxos,Greece',lat:37.1036,lon:25.3766,country:'Greece',windguru:'https://www.windguru.cz/station/280'},
{name:'Vassiliki,Lefkada',lat:38.6167,lon:20.5833,country:'Greece',windguru:'https://www.windguru.cz/station/111',webcam:'https://www.webcameras.gr/loc_wc/webcameras.asp?ID=581&lang=en'},
{name:'Mykonos-Korfos Bay',lat:37.4500,lon:25.3800,country:'Greece',windguru:'https://www.windguru.cz/station/5500'},
{name:'Naxos-Mikri Vigla',lat:36.9667,lon:25.4833,country:'Greece',windguru:'https://www.windguru.cz/station/3200'},
{name:'Paros-Pounda',lat:37.0500,lon:25.1000,country:'Greece',windguru:'https://www.windguru.cz/station/1091'},
{name:'Rhodes-Prasonisi',lat:35.8833,lon:27.7333,country:'Greece',windguru:'https://www.windguru.cz/station/339'},
{name:'Kos-Marmari',lat:36.8500,lon:27.0667,country:'Greece',windguru:'https://beta.windguru.cz/station/57'},
{name:'Limnos-Keros Beach',lat:39.8667,lon:25.2333,country:'Greece',windguru:'https://www.windguru.cz/wglive-iframe.php?s=1053&tj=c&wj=knots'},
{name:'Lefkada-Agios Ioannis',lat:38.7167,lon:20.6333,country:'Greece'},
{name:'Crete-Kouremenos',lat:35.2000,lon:26.2500,country:'Greece'},
{name:'Kos-Mastichari',lat:36.8500,lon:26.9833,country:'Greece'},
{name:"Andros-Kavo D'oro",lat:37.8500,lon:24.7500,country:'Greece'},
{name:'Guincho,Portugal',lat:38.7333,lon:-9.4667,country:'Portugal',windguru:'https://www.windguru.cz/station/70',webcam:'https://beachcam.meo.pt/livecams/praia-do-guincho/'},
{name:'Viana do Castelo',lat:41.6942,lon:-8.8350,country:'Portugal',windguru:'https://www.windguru.cz/station/155'},
{name:'Peniche,Portugal',lat:39.3561,lon:-9.3811,country:'Portugal',windguru:'https://www.windguru.cz/station/62'},
{name:'Alvor,Algarve',lat:37.1236,lon:-8.6014,country:'Portugal'},
{name:'Lagos,Algarve',lat:37.1028,lon:-8.6744,country:'Portugal'},
{name:'Bol,Brac Island',lat:43.2625,lon:16.6511,country:'Croatia'},
{name:'Viganj,Croatia',lat:42.9167,lon:17.0833,country:'Croatia'},
{name:'Nin Lagoon,Croatia',lat:44.2333,lon:15.1833,country:'Croatia'},
{name:'Pag Island,Croatia',lat:44.4528,lon:15.0581,country:'Croatia'},
{name:'Zadar,Croatia',lat:44.1194,lon:15.2314,country:'Croatia'},
{name:'Alacati,Turkey',lat:38.2811,lon:26.3764,country:'Turkey'},
{name:'Gokceada,Turkey',lat:40.1833,lon:25.9000,country:'Turkey'},
{name:'Bodrum,Turkey',lat:37.0342,lon:27.4303,country:'Turkey'},
{name:'Akyaka,Turkey',lat:37.0500,lon:28.1500,country:'Turkey'},
{name:'Cesme,Turkey',lat:38.3244,lon:26.3028,country:'Turkey'},
{name:'Klitmoller,Denmark',lat:57.0167,lon:8.5000,country:'Denmark',windguru:'https://www.windguru.cz/station/4',webcam:'https://www.skylinewebcams.com/en/webcam/denmark/north-jutland-region/klitmoller/klitmoller-beach.html'},
{name:'Hvide Sande,Denmark',lat:56.0000,lon:8.1333,country:'Denmark',windguru:'https://www.windguru.cz/station/54',webcam:'https://www.skylinewebcams.com/en/webcam/denmark/north-jutland-region/hvide/lighthouse.html'},
{name:'Romo Island,Denmark',lat:55.1333,lon:8.5500,country:'Denmark'},
{name:'Blokhus,Denmark',lat:57.2500,lon:9.5667,country:'Denmark'},
{name:'Thyboron,Denmark',lat:56.7000,lon:8.2167,country:'Denmark'},
{name:'Poole Harbour,England',lat:50.7167,lon:-1.9833,country:'UK',windguru:'https://www.windguru.cz/station/20'},
{name:'Hayling Island,England',lat:50.8000,lon:-1.0333,country:'UK',windguru:'https://www.windguru.cz/station/26'},
{name:'Rhossili Bay,Wales',lat:51.5667,lon:-4.2833,country:'UK'},
{name:'Tiree,Scotland',lat:56.5167,lon:-6.8833,country:'UK',windguru:'https://www.windguru.cz/station/91'},
{name:'Brandon Bay,Ireland',lat:52.2333,lon:-10.1333,country:'UK'},
{name:'Varberg,Sweden',lat:57.1047,lon:12.2428,country:'Sweden',windguru:'https://www.windguru.cz/station/88'},
{name:'Lomma Beach,Sweden',lat:55.6733,lon:13.0600,country:'Sweden'},
{name:'Tylosand,Sweden',lat:56.6667,lon:12.7333,country:'Sweden'},
{name:'Gotland,Sweden',lat:57.5000,lon:18.5000,country:'Sweden'},
{name:'Hel Peninsula,Poland',lat:54.6036,lon:18.7972,country:'Poland',windguru:'https://www.windguru.cz/station/32'},
{name:'Leba,Poland',lat:54.7617,lon:17.5358,country:'Poland'},
{name:'Jastarnia,Poland',lat:54.6964,lon:18.6778,country:'Poland'},
{name:'Puck Bay,Poland',lat:54.7333,lon:18.4167,country:'Poland'},
{name:'Neusiedler See,Austria',lat:47.8667,lon:16.7667,country:'Austria',windguru:'https://www.windguru.cz/station/59'},
{name:'Lake Constance-Bregenz',lat:47.5031,lon:9.7471,country:'Austria'},
{name:'Lake Silvaplana,Switzerland',lat:46.4500,lon:9.7833,country:'Switzerland'},
{name:'Lake Thun,Switzerland',lat:46.7500,lon:7.6667,country:'Switzerland'},
{name:'Lake Neuchatel,Switzerland',lat:46.9167,lon:6.9167,country:'Switzerland'},
{name:'Anapa,Russia',lat:44.8939,lon:37.3158,country:'Russia'},
{name:'Gelendzhik,Russia',lat:44.5614,lon:38.0789,country:'Russia'},
{name:'Tuapse,Russia',lat:44.1000,lon:39.0833,country:'Russia'},
{name:'Vladivostok,Russia',lat:43.1167,lon:131.9000,country:'Russia'},
{name:'Lake Baikal-Irkutsk',lat:51.8667,lon:104.5000,country:'Russia'},
{name:'Essaouira,Morocco',lat:31.5085,lon:-9.7595,country:'Morocco',windguru:'https://www.windguru.cz/station/44'},
{name:'Dakhla,Morocco',lat:23.7147,lon:-15.9372,country:'Morocco',windguru:'https://www.windguru.cz/station/222'},
{name:'Dahab,Egypt',lat:28.5068,lon:34.5128,country:'Egypt',windguru:'https://www.windguru.cz/station/15693',webcam:'https://www.harry-nass.com/en/webcam-dahab/'},
{name:'El Gouna,Egypt',lat:27.3833,lon:33.6833,country:'Egypt',windguru:'https://www.windguru.cz/station/210'},
{name:'Aqaba,Jordan',lat:29.5269,lon:35.0063,country:'Jordan',windguru:'https://www.windguru.cz/station/327'},
{name:'Hua Hin,Thailand',lat:12.5681,lon:99.9584,country:'Thailand',windguru:'https://www.windguru.cz/station/181'},
{name:'Pranburi,Thailand',lat:12.3833,lon:99.9167,country:'Thailand',windguru:'https://www.windguru.cz/station/451'},
{name:'Koh Samui,Thailand',lat:9.5349,lon:100.0612,country:'Thailand'},
{name:'Phuket-Nai Harn',lat:7.7656,lon:98.3044,country:'Thailand'},
{name:'Chumphon,Thailand',lat:10.4833,lon:99.1667,country:'Thailand'},
{name:'Mui Ne,Vietnam',lat:10.9333,lon:108.2833,country:'Vietnam',windguru:'https://www.windguru.cz/station/231'},
{name:'Ninh Chu Bay,Vietnam',lat:11.5500,lon:108.9833,country:'Vietnam',windguru:'https://www.windguru.cz/station/332'},
{name:'Da Nang,Vietnam',lat:16.0544,lon:108.2022,country:'Vietnam'},
{name:'Phan Rang,Vietnam',lat:11.5649,lon:108.9888,country:'Vietnam',windguru:'https://www.windguru.cz/station/332'},
{name:'Nha Trang,Vietnam',lat:12.2388,lon:109.1967,country:'Vietnam',windguru:'https://www.windguru.cz/station/207'},
{name:'Sri Lanka-Kalpitiya',lat:8.2333,lon:79.7667,country:'Sri Lanka',windguru:'https://www.windguru.cz/station/309'},
{name:'Boracay,Philippines',lat:11.9674,lon:121.9248,country:'Philippines',windguru:'https://www.windguru.cz/station/311'},
{name:'Zanzibar,Tanzania',lat:-6.1659,lon:39.2026,country:'Tanzania',windguru:'https://www.windguru.cz/station/343'},
{name:'Cape Town-Big Bay',lat:-33.7439,lon:18.4803,country:'South Africa',windguru:'https://www.windguru.cz/station/57'},
{name:'Mauritius-Le Morne',lat:-20.4667,lon:57.3167,country:'Mauritius',windguru:'https://www.windguru.cz/station/189'},
{name:'Cabarete,Dominican Rep.',lat:19.7500,lon:-70.4167,country:'Caribbean',windguru:'https://www.windguru.cz/station/106',webcam:'https://www.skylinewebcams.com/en/webcam/dominican-republic/puerto-plata/cabarete/cabarete-dominican-republic.html'},
{name:'Aruba-Hadicurari Beach',lat:12.5667,lon:-70.0333,country:'Caribbean',windguru:'https://www.windguru.cz/station/182'},
{name:'Aruba-Boca Grandi',lat:12.4603,lon:-69.9581,country:'Caribbean',webcam:'https://www.skylinewebcams.com/en/webcam/aruba/aruba/boca-grandi.html'},
{name:'Barbados-Silver Sands',lat:13.0487,lon:-59.5320,country:'Caribbean',webcam:'https://www.skylinewebcams.com/en/webcam/barbados/barbados/silver-sands.html'},
{name:'Barbados-Brandons Beach',lat:13.0976,lon:-59.6223,country:'Caribbean',webcam:'https://www.skylinewebcams.com/en/webcam/barbados/bridgetown/brandons-beach.html'},
{name:'Turks&Caicos-Long Bay',lat:21.7736,lon:-72.1540,country:'Caribbean',webcam:'https://www.skylinewebcams.com/en/webcam/turks-and-caicos-islands/turks-and-caicos-islands/long-bay-webcam.html'},
{name:'St. Martin-Orient Bay',lat:18.0844,lon:-63.0228,country:'Caribbean',webcam:'https://www.skylinewebcams.com/en/webcam/french-west-indies/st-martin/orient-bay-beach.html'},
{name:'Jericoacoara,Brazil',lat:-2.7928,lon:-40.5147,country:'Brazil',windguru:'https://www.windguru.cz/station/165',webcam:'https://www.webcamtaxi.com/en/brazil/ceara/praia-de-jericoacoara-cam.html'},
{name:'Cumbuco,Brazil',lat:-3.6244,lon:-38.6850,country:'Brazil',windguru:'https://www.windguru.cz/station/96',webcam:'https://www.durobeach.com/en/climate-and-wind/'},
{name:'Paracas,Peru',lat:-13.8333,lon:-76.2500,country:'Peru',windguru:'https://www.windguru.cz/station/147'},
{name:'Margaret River,Australia',lat:-33.9550,lon:115.0728,country:'Australia',windguru:'https://www.windguru.cz/station/108'},
{name:'Esperance,Australia',lat:-33.8614,lon:121.8920,country:'Australia'},
{name:'Bat Galim(Haifa)',lat:32.8333,lon:34.9667,country:'Israel'},
{name:'Dor Beach(Hof Dor)',lat:32.6078,lon:34.9233,country:'Israel'},
{name:'Tel Baruch(TLV)',lat:32.1220,lon:34.7900,country:'Israel'},
{name:'Bat Yam Beach',lat:32.0238,lon:34.7519,country:'Israel'},
{name:'Ashdod Beach',lat:31.7921,lon:34.6497,country:'Israel'},
{name:'Ashkelon Beach',lat:31.6650,lon:34.5530,country:'Israel'},
{name:'Migdal(Kinneret)',lat:32.8390,lon:35.4950,country:'Israel'},
{name:'Eilat Beach',lat:29.5134,lon:34.9269,country:'Israel',webcam:'https://surfcenter.co.il/%D7%9E%D7%93-%D7%A8%D7%95%D7%97/'},
];
const COUNTRY_TAB_ORDER=[
'All',
'Australia','Austria',
'Brazil',
'Canada','Caribbean','Croatia',
'Denmark',
'Egypt',
'France',
'Germany','Greece',
'Israel','Italy',
'Jordan',
'Mauritius','Morocco',
'Netherlands',
'Peru','Philippines','Poland','Portugal',
'Russia',
'South Africa','Spain','Sri Lanka','Sweden','Switzerland',
'Tanzania','Thailand','Turkey',
'UK','USA',
'Vietnam',
];
const COUNTRY_STORAGE_KEY='wind_user_country_v1';
const SEEDED_STORAGE_KEY='wind_seeded_v1';
const SEED_SPOTS_BY_COUNTRY={
US:[
{name:'Kanaha Beach,Maui',lat:20.8978,lon:-156.4654},
{name:'Columbia River Gorge,OR',lat:45.7028,lon:-121.5236},
{name:'Cape Hatteras,NC',lat:35.2331,lon:-75.5296},
{name:'Crissy Field,San Francisco',lat:37.8047,lon:-122.4657},
{name:'South Padre Island,TX',lat:26.0697,lon:-97.1664},
],
CA:[
{name:'Squamish,British Columbia',lat:49.7016,lon:-123.1558},
{name:'Goderich,Ontario',lat:43.7453,lon:-81.7167},
{name:'Iles-de-la-Madeleine,QC',lat:47.3833,lon:-61.8667},
{name:'Niagara-on-the-Lake,ON',lat:43.2553,lon:-79.0711},
{name:'Inverness,Nova Scotia',lat:46.2167,lon:-61.0833},
],
TH:[
{name:'Hua Hin,Thailand',lat:12.5681,lon:99.9584},
{name:'Pranburi,Thailand',lat:12.3833,lon:99.9167},
{name:'Koh Samui,Thailand',lat:9.5349,lon:100.0612},
{name:'Phuket-Nai Harn',lat:7.7656,lon:98.3044},
{name:'Chumphon,Thailand',lat:10.4833,lon:99.1667},
],
VN:[
{name:'Mui Ne,Vietnam',lat:10.9333,lon:108.2833},
{name:'Ninh Chu Bay,Vietnam',lat:11.5500,lon:108.9833},
{name:'Da Nang,Vietnam',lat:16.0544,lon:108.2022},
{name:'Phan Rang,Vietnam',lat:11.5649,lon:108.9888},
{name:'Nha Trang,Vietnam',lat:12.2388,lon:109.1967},
],
NL:[
{name:'Brouwersdam,Netherlands',lat:51.7464,lon:3.8872},
{name:'Zandvoort,Netherlands',lat:52.3731,lon:4.5317},
{name:'Grevelingenmeer',lat:51.7333,lon:3.9000},
{name:'Haringvliet,Netherlands',lat:51.7833,lon:4.1333},
{name:'IJsselmeer-Workum',lat:52.9833,lon:5.4500},
],
DE:[
{name:'Fehmarn,Germany',lat:54.4617,lon:11.1900},
{name:'Sylt-Westerland',lat:54.9025,lon:8.3125},
{name:'Kuehlungsborn,Germany',lat:54.1467,lon:11.7439},
{name:'Timmendorfer Strand',lat:53.9986,lon:10.7758},
{name:'Ruegen-Dranske',lat:54.6333,lon:13.2167},
],
RU:[
{name:'Anapa,Russia',lat:44.8939,lon:37.3158},
{name:'Gelendzhik,Russia',lat:44.5614,lon:38.0789},
{name:'Tuapse,Russia',lat:44.1000,lon:39.0833},
{name:'Vladivostok,Russia',lat:43.1167,lon:131.9000},
{name:'Lake Baikal-Irkutsk',lat:51.8667,lon:104.5000},
],
IT:[
{name:'Lake Garda-Torbole',lat:45.8753,lon:10.8739},
{name:'Lake Garda-Malcesine',lat:45.7667,lon:10.8333},
{name:'Porto Pollo,Sardinia',lat:41.1000,lon:9.3000},
{name:'Cagliari-Poetto,Sardinia',lat:39.2100,lon:9.1700},
{name:'Taranto,Italy',lat:40.4644,lon:17.2472},
],
IL:[
{name:'Bat Galim(Haifa)',lat:32.8333,lon:34.9667},
{name:'Dor Beach(Hof Dor)',lat:32.6078,lon:34.9233},
{name:'Tel Baruch(TLV)',lat:32.1220,lon:34.7900},
{name:'Ashdod Beach',lat:31.7921,lon:34.6497},
{name:'Migdal(Kinneret)',lat:32.8390,lon:35.4950},
],
ES:[
{name:'Tarifa,Spain',lat:36.0136,lon:-5.6065},
{name:'El Medano,Tenerife',lat:28.0500,lon:-16.5333},
{name:'Fuerteventura-Sotavento',lat:28.0833,lon:-14.1167},
{name:'Valencia,Spain',lat:39.4542,lon:-0.3256},
{name:'Maresme Coast,Barcelona',lat:41.5000,lon:2.5000},
],
FR:[
{name:'Leucate,France',lat:42.9097,lon:3.0281},
{name:'La Torche,Brittany',lat:47.8500,lon:-4.3333},
{name:'Almanarre,France',lat:43.0833,lon:6.0833},
{name:'Gruissan,France',lat:43.0972,lon:3.0833},
{name:'Hyeres,France',lat:43.1200,lon:6.1200},
],
GR:[
{name:'Karpathos,Greece',lat:35.5074,lon:27.1483},
{name:'Rhodes,Greece',lat:36.1944,lon:27.9694},
{name:'Paros,Greece',lat:37.0853,lon:25.1489},
{name:'Naxos,Greece',lat:37.1036,lon:25.3766},
{name:'Vassiliki,Lefkada',lat:38.6167,lon:20.5833},
{name:'Mykonos-Korfos Bay',lat:37.4500,lon:25.3800},
{name:'Naxos-Mikri Vigla',lat:36.9667,lon:25.4833},
{name:'Paros-Pounda',lat:37.0500,lon:25.1000},
{name:'Rhodes-Prasonisi',lat:35.8833,lon:27.7333},
{name:'Kos-Marmari',lat:36.8500,lon:27.0667},
{name:'Limnos-Keros Beach',lat:39.8667,lon:25.2333},
{name:'Lefkada-Agios Ioannis',lat:38.7167,lon:20.6333},
{name:'Crete-Kouremenos',lat:35.2000,lon:26.2500},
{name:'Kos-Mastichari',lat:36.8500,lon:26.9833},
{name:"Andros-Kavo D'oro",lat:37.8500,lon:24.7500},
],
PT:[
{name:'Guincho,Portugal',lat:38.7333,lon:-9.4667},
{name:'Viana do Castelo',lat:41.6942,lon:-8.8350},
{name:'Peniche,Portugal',lat:39.3561,lon:-9.3811},
{name:'Alvor,Algarve',lat:37.1236,lon:-8.6014},
{name:'Lagos,Algarve',lat:37.1028,lon:-8.6744},
],
HR:[
{name:'Bol,Brac Island',lat:43.2625,lon:16.6511},
{name:'Viganj,Croatia',lat:42.9167,lon:17.0833},
{name:'Nin Lagoon,Croatia',lat:44.2333,lon:15.1833},
{name:'Pag Island,Croatia',lat:44.4528,lon:15.0581},
{name:'Zadar,Croatia',lat:44.1194,lon:15.2314},
],
TR:[
{name:'Alacati,Turkey',lat:38.2811,lon:26.3764},
{name:'Gokceada,Turkey',lat:40.1833,lon:25.9000},
{name:'Bodrum,Turkey',lat:37.0342,lon:27.4303},
{name:'Akyaka,Turkey',lat:37.0500,lon:28.1500},
{name:'Cesme,Turkey',lat:38.3244,lon:26.3028},
],
DK:[
{name:'Klitmoller,Denmark',lat:57.0167,lon:8.5000},
{name:'Hvide Sande,Denmark',lat:56.0000,lon:8.1333},
{name:'Romo Island,Denmark',lat:55.1333,lon:8.5500},
{name:'Blokhus,Denmark',lat:57.2500,lon:9.5667},
{name:'Thyboron,Denmark',lat:56.7000,lon:8.2167},
],
GB:[
{name:'Poole Harbour,England',lat:50.7167,lon:-1.9833},
{name:'Hayling Island,England',lat:50.8000,lon:-1.0333},
{name:'Rhossili Bay,Wales',lat:51.5667,lon:-4.2833},
{name:'Tiree,Scotland',lat:56.5167,lon:-6.8833},
{name:'Brandon Bay,Ireland',lat:52.2333,lon:-10.1333},
],
DEFAULT:[
{name:'Tarifa,Spain',lat:36.0136,lon:-5.6065},
{name:'Dahab,Egypt',lat:28.5068,lon:34.5128},
{name:'Mui Ne,Vietnam',lat:10.9333,lon:108.2833},
{name:'Kanaha Beach,Maui',lat:20.8978,lon:-156.4654},
{name:'Jericoacoara,Brazil',lat:-2.7928,lon:-40.5147},
],
};
async function detectAndSeedCountry(){
if(localStorage.getItem(SEEDED_STORAGE_KEY))return;
let countryCode=localStorage.getItem(COUNTRY_STORAGE_KEY);
if(!countryCode){
try{
const r=await fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(5000)});
const d=await r.json();
countryCode=(d.country_code||'DEFAULT').toUpperCase();
}catch{countryCode='DEFAULT';}
localStorage.setItem(COUNTRY_STORAGE_KEY,countryCode);
}
const spots=SEED_SPOTS_BY_COUNTRY[countryCode]||SEED_SPOTS_BY_COUNTRY.DEFAULT;
const places=getPlaces();
let added=0;
for(const spot of spots){
const exists=places.some(p=>Math.abs(p.lat-spot.lat)<0.01&&Math.abs(p.lon-spot.lon)<0.01);
if(!exists){
places.push({key:'p_'+Date.now().toString(16)+'_'+Math.random().toString(16).slice(2),
name:spot.name.slice(0,28),lat:spot.lat,lon:spot.lon,
sea:guessSeaForPoint(spot.lat,spot.lon),applyBonus:false,group:'My Spots'});
added++;
}
}
if(added>0){savePlaces(places);reloadPlacesKeepSelection();buildFoldersUI();}
localStorage.setItem(SEEDED_STORAGE_KEY,'1');
}
let selectedSpots=new Set();
let activeCountryTab='All';
function renderBestSpotsList(){
const tabBar=document.getElementById('bestSpotsTabBar');
const container=document.getElementById('bestSpotsList');
if(!tabBar||!container)return;
tabBar.innerHTML='';
container.innerHTML='';
const countriesWithSpots=['All',...new Set(BEST_SPOTS.map(s=>s.country))];
const tabsToShow=COUNTRY_TAB_ORDER.filter(c=>countriesWithSpots.includes(c));
for(const country of tabsToShow){
const btn=document.createElement('button');
btn.type='button';
btn.textContent=country;
const isActive=country===activeCountryTab;
btn.style.cssText='padding:4px 10px;border-radius:20px;border:1.5px solid '+
(isActive?'#2c3e50':'#bdc3c7')+';background:'+
(isActive?'#2c3e50':'#f8f9fa')+';color:'+
(isActive?'#fff':'#2c3e50')+
';font-size:0.8em;font-weight:700;cursor:pointer;white-space:nowrap;';
btn.onclick=()=>{activeCountryTab=country;renderBestSpotsList();container.scrollTop=0;};
tabBar.appendChild(btn);
}
const filtered=activeCountryTab==='All'?BEST_SPOTS:BEST_SPOTS.filter(s=>s.country===activeCountryTab);
for(const spot of filtered){
const isSelected=selectedSpots.has(spot.name);
const spotDiv=document.createElement('div');
spotDiv.style.cssText='display:flex;align-items:center;padding:10px;background:'+
(isSelected?'#c8e6c9':'#f8f9fa')+';border-radius:8px;margin-bottom:4px;cursor:pointer;';
spotDiv.onmouseenter=()=>{if(!selectedSpots.has(spot.name))spotDiv.style.background='#e3f2fd';};
spotDiv.onmouseleave=()=>{spotDiv.style.background=selectedSpots.has(spot.name)?'#c8e6c9':'#f8f9fa';};
const cb=document.createElement('input');
cb.type='checkbox';
cb.checked=isSelected;
cb.style.cssText='margin-right:12px;width:18px;height:18px;cursor:pointer;flex-shrink:0;';
cb.onchange=()=>{
if(cb.checked){selectedSpots.add(spot.name);spotDiv.style.background='#c8e6c9';}
else{selectedSpots.delete(spot.name);spotDiv.style.background='#f8f9fa';}
};
const label=document.createElement('label');
label.style.cssText='cursor:pointer;flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;';
label.innerHTML='<span style="font-weight:600;color:#2c3e50;">'+spot.name+'</span>'+
'<span style="color:#6c7a89;font-size:0.82em;flex-shrink:0;">'+spot.lat.toFixed(2)+','+spot.lon.toFixed(2)+'</span>';
label.onclick=(e)=>{e.preventDefault();cb.checked=!cb.checked;cb.onchange();};
spotDiv.appendChild(cb);
spotDiv.appendChild(label);
container.appendChild(spotDiv);
}
}
function doAddSelectedSpots(){
if(selectedSpots.size===0){
showAddStatus('Please select at least one spot first.','#e74c3c');
return;
}
const places=getPlaces();
let addedCount=0;
for(const spotName of selectedSpots){
const spot=BEST_SPOTS.find(s=>s.name===spotName);
if(!spot)continue;
const exists=places.some(p=>Math.abs(p.lat-spot.lat)<0.01&&Math.abs(p.lon-spot.lon)<0.01);
if(!exists){
const newKey='p_'+Date.now().toString(16)+'_'+Math.random().toString(16).slice(2);
places.push({key:newKey,
name:spot.name.slice(0,28),lat:spot.lat,lon:spot.lon,
sea:guessSeaForPoint(spot.lat,spot.lon),applyBonus:false,group:'Best World Spots',
dataUrl:spot.windguru||'',
camUrl:spot.webcam||''});
addedCount++;
}
}
if(addedCount>0){
savePlaces(places);
reloadPlacesKeepSelection();
buildFoldersUI();
showAddStatus('✅ Added '+addedCount+' spot'+(addedCount>1?'s':'')+' to "Best World Spots"!','#27ae60');
}else{
showAddStatus('These spots are already in your list.','#e67e22');
}
selectedSpots.clear();
renderBestSpotsList();
}
function showAddStatus(msg,color){
const el=document.getElementById('addSpotsStatus');
if(!el)return;
el.textContent=msg;
el.style.cssText='display:block;margin-bottom:10px;padding:8px 12px;border-radius:8px;font-weight:700;font-size:0.9em;background:'+color+'22;color:'+color+';border:1px solid '+color+'44;';
setTimeout(()=>{el.style.display='none';},3000);
}
const addSelectedSpotsBtn=document.getElementById('addSelectedSpotsBtn');
if(addSelectedSpotsBtn)addSelectedSpotsBtn.addEventListener('click',doAddSelectedSpots);
window.doAddSelectedSpots=doAddSelectedSpots;
detectAndSeedCountry();
const BEST_MONTHS={
"Kanaha Beach,Maui":{months:"May–Sep",note:"Trade winds strongest May–Sep"},
"Ho'okipa Beach,Maui":{months:"May–Sep",note:"N shore swells&trades peak summer"},
"Crissy Field,San Francisco":{months:"Jun–Sep",note:"Reliable afternoon thermal winds"},
"Sherman Island,CA Delta":{months:"Jun–Sep",note:"Delta thermal winds peak in summer"},
"Columbia River Gorge,OR":{months:"Jun–Aug",note:"Strongest thermal gap winds in summer"},
"Cape Hatteras,NC":{months:"Apr–Jun,Sep–Oct",note:"Spring&fall winds,avoid hurricane season"},
"Nags Head,NC":{months:"Apr–Jun,Sep–Oct",note:"Best shoulder seasons"},
"Key West,Florida":{months:"Nov–Apr",note:"Winter cold fronts bring best wind"},
"South Padre Island,TX":{months:"Mar–Jun",note:"Strong spring Gulf winds"},
"Long Island Sound,NY":{months:"Jun–Aug",note:"Summer sea breeze"},
"Squamish,British Columbia":{months:"Jun–Sep",note:"Strong Squamish outflow winds"},
"Goderich,Ontario":{months:"Jun–Aug",note:"Lake Huron summer thermals"},
"Niagara-on-the-Lake,ON":{months:"May–Sep",note:"Lake Ontario breeze"},
"Iles-de-la-Madeleine,QC":{months:"Jun–Aug",note:"Consistent Gulf of St. Lawrence winds"},
"Inverness,Nova Scotia":{months:"Jul–Sep",note:"Atlantic summer breeze"},
"Tarifa,Spain":{months:"Jun–Aug",note:"Levante&Poniente peak in summer"},
"El Medano,Tenerife":{months:"Jun–Sep",note:"Reliable trade winds year-round,best summer"},
"Fuerteventura-Sotavento":{months:"Jun–Aug",note:"World Cup venue,consistent trades"},
"Valencia,Spain":{months:"Apr–Jun,Sep–Oct",note:"Thermal winds&mistral season"},
"Maresme Coast,Barcelona":{months:"Jun–Aug",note:"Summer thermal sea breeze"},
"Leucate,France":{months:"Apr–Oct",note:"Tramontane wind strongest spring–autumn"},
"La Torche,Brittany":{months:"May–Sep",note:"Atlantic swell&wind all season"},
"Almanarre,France":{months:"Apr–Oct",note:"Mistral wind strongest spring&autumn"},
"Gruissan,France":{months:"Apr–Oct",note:"Tramontane&Marin winds"},
"Hyeres,France":{months:"Apr–Oct",note:"Mistral&thermal winds"},
"Fehmarn,Germany":{months:"May–Sep",note:"Baltic Sea summer sailing season"},
"Sylt-Westerland":{months:"May–Sep",note:"North Sea consistent winds"},
"Kuehlungsborn,Germany":{months:"May–Aug",note:"Baltic summer thermals"},
"Timmendorfer Strand":{months:"May–Aug",note:"Baltic Sea summer"},
"Ruegen-Dranske":{months:"May–Sep",note:"Baltic reliable summer winds"},
"Brouwersdam,Netherlands":{months:"May–Sep",note:"Flat water lagoon,peak summer"},
"Zandvoort,Netherlands":{months:"May–Sep",note:"North Sea coastal winds"},
"Grevelingenmeer":{months:"May–Sep",note:"Inland sea,flat water"},
"Haringvliet,Netherlands":{months:"Apr–Sep",note:"Sheltered estuary winds"},
"IJsselmeer-Workum":{months:"May–Sep",note:"Lake IJssel consistent breeze"},
"Lake Garda-Torbole":{months:"Apr–Oct",note:"Ora thermal&Pelér morning wind"},
"Lake Garda-Malcesine":{months:"Apr–Oct",note:"Ora afternoon thermal"},
"Taranto,Italy":{months:"Jun–Sep",note:"Strong summer Sirocco&thermals"},
"Cagliari-Poetto,Sardinia":{months:"Jun–Sep",note:"Maestrale wind peak in summer"},
"Porto Pollo,Sardinia":{months:"May–Sep",note:"Mistral wind&flat lagoon"},
"Karpathos,Greece":{months:"Jun–Sep",note:"Meltemi wind strongest Jul–Aug"},
"Rhodes,Greece":{months:"Jun–Sep",note:"Meltemi season"},
"Paros,Greece":{months:"Jun–Sep",note:"Meltemi creates ideal conditions"},
"Naxos,Greece":{months:"Jun–Sep",note:"Strong Meltemi Jul–Aug"},
"Vassiliki,Lefkada":{months:"Jun–Sep",note:"Thermal wind in afternoons"},
"Mykonos-Korfos Bay":{months:"Jun–Sep",note:"Meltemi strongest Jul–Aug"},
"Naxos-Mikri Vigla":{months:"Jun–Sep",note:"Meltemi creates perfect flat water"},
"Paros-Pounda":{months:"Jun–Sep",note:"Strong Meltemi,flat water lagoon"},
"Rhodes-Prasonisi":{months:"Jun–Sep",note:"Double beach,Meltemi Jul–Aug"},
"Kos-Marmari":{months:"Jun–Sep",note:"Reliable Meltemi afternoons"},
"Limnos-Keros Beach":{months:"Jun–Sep",note:"Meltemi hits full force"},
"Lefkada-Agios Ioannis":{months:"Jun–Sep",note:"Thermal winds daily"},
"Crete-Kouremenos":{months:"Jun–Sep",note:"Meltemi funnels through eastern Crete"},
"Kos-Mastichari":{months:"Jun–Sep",note:"Reliable summer Meltemi"},
"Andros-Kavo D'oro":{months:"Jun–Sep",note:"One of Aegean's windiest passages"},
"Guincho,Portugal":{months:"Jun–Sep",note:"NW Atlantic wind peak in summer"},
"Viana do Castelo":{months:"Jun–Sep",note:"Consistent NW trade winds"},
"Peniche,Portugal":{months:"May–Sep",note:"Atlantic swell&trade winds"},
"Alvor,Algarve":{months:"Jun–Sep",note:"Reliable Nortada summer wind"},
"Lagos,Algarve":{months:"Jun–Sep",note:"Nortada thermal winds"},
"Bol,Brac Island":{months:"May–Sep",note:"Maestral afternoon breeze"},
"Viganj,Croatia":{months:"May–Sep",note:"Maestral&Bura winds"},
"Nin Lagoon,Croatia":{months:"Jun–Sep",note:"Bura wind&flat lagoon"},
"Pag Island,Croatia":{months:"Apr–Sep",note:"Bura&Maestral"},
"Zadar,Croatia":{months:"May–Sep",note:"Maestral sea breeze"},
"Alacati,Turkey":{months:"Jun–Sep",note:"Imbat thermal wind,very reliable"},
"Gokceada,Turkey":{months:"Jun–Sep",note:"Meltemi wind season"},
"Bodrum,Turkey":{months:"Jun–Sep",note:"Meltemi thermal winds"},
"Akyaka,Turkey":{months:"Jun–Sep",note:"Thermal wind funnelled by mountains"},
"Cesme,Turkey":{months:"Jun–Sep",note:"Strong Imbat wind Jul–Aug"},
"Klitmoller,Denmark":{months:"Sep–Apr",note:"Cold Water Classic:Atlantic winter swells"},
"Hvide Sande,Denmark":{months:"May–Sep",note:"North Sea summer winds"},
"Romo Island,Denmark":{months:"May–Sep",note:"Wadden Sea flat water"},
"Blokhus,Denmark":{months:"May–Aug",note:"Steady North Sea breeze"},
"Thyboron,Denmark":{months:"May–Sep",note:"Exposed North Sea coast"},
"Poole Harbour,England":{months:"May–Sep",note:"Flat water harbour,summer"},
"Hayling Island,England":{months:"Apr–Oct",note:"Solent sea breeze"},
"Rhossili Bay,Wales":{months:"Oct–Mar",note:"Atlantic winter swells"},
"Tiree,Scotland":{months:"May–Sep",note:"Hebrides consistent Atlantic winds"},
"Brandon Bay,Ireland":{months:"Apr–Sep",note:"Atlantic swell&westerlies"},
"Varberg,Sweden":{months:"Jun–Aug",note:"Kattegat sea breeze"},
"Lomma Beach,Sweden":{months:"Jun–Aug",note:"Øresund strait breeze"},
"Tylosand,Sweden":{months:"Jun–Aug",note:"West coast summer winds"},
"Gotland,Sweden":{months:"Jun–Aug",note:"Baltic island,consistent summer"},
"Hel Peninsula,Poland":{months:"May–Aug",note:"Baltic Sea summer"},
"Leba,Poland":{months:"May–Aug",note:"Baltic consistent winds"},
"Jastarnia,Poland":{months:"May–Sep",note:"Flat Baltic lagoon"},
"Puck Bay,Poland":{months:"May–Sep",note:"Sheltered bay,flat water"},
"Neusiedler See,Austria":{months:"May–Sep",note:"Shallow steppe lake,flat water"},
"Lake Constance-Bregenz":{months:"May–Sep",note:"Alpine lake thermal winds"},
"Lake Silvaplana,Switzerland":{months:"Jun–Sep",note:"Maloja wind,legendary in summer"},
"Lake Thun,Switzerland":{months:"Jun–Sep",note:"Alpine thermal winds"},
"Lake Neuchatel,Switzerland":{months:"May–Sep",note:"Lake thermal breeze"},
"Anapa,Russia":{months:"Jun–Sep",note:"Black Sea summer thermals"},
"Gelendzhik,Russia":{months:"Jun–Sep",note:"Black Sea season"},
"Tuapse,Russia":{months:"Jun–Sep",note:"Warm Black Sea summer"},
"Vladivostok,Russia":{months:"Jul–Sep",note:"Sea of Japan summer monsoon"},
"Lake Baikal-Irkutsk":{months:"Jun–Aug",note:"Short but windy Baikal summer"},
"Essaouira,Morocco":{months:"Apr–Oct",note:"Alizé trade wind,very reliable"},
"Dakhla,Morocco":{months:"Nov–Apr",note:"Trade winds peak in winter"},
"Dahab,Egypt":{months:"Mar–May,Oct–Nov",note:"Spring&autumn best,avoid summer heat"},
"El Gouna,Egypt":{months:"Mar–May,Oct–Nov",note:"Red Sea thermal winds spring&autumn"},
"Aqaba,Jordan":{months:"Mar–May,Oct–Nov",note:"Red Sea moderate seasons"},
"Bat Galim(Haifa)":{months:"Apr–Oct",note:"Mediterranean sea breeze spring–autumn"},
"Dor Beach(Hof Dor)":{months:"Apr–Oct",note:"Sea breeze&Sharav conditions"},
"Tel Baruch(TLV)":{months:"Apr–Oct",note:"Reliable afternoon sea breeze"},
"Bat Yam Beach":{months:"Apr–Oct",note:"Mediterranean sea breeze"},
"Ashdod Beach":{months:"Apr–Oct",note:"Open Mediterranean exposure"},
"Ashkelon Beach":{months:"Apr–Oct",note:"Sea breeze,less sheltered"},
"Migdal(Kinneret)":{months:"Apr–Oct",note:"Lake Kinneret afternoon thermal"},
"Eilat Beach":{months:"Mar–May,Oct–Nov",note:"Red Sea thermals,avoid summer heat"},
"Zanzibar,Tanzania":{months:"Jun–Sep",note:"SE monsoon(Kusi)brings reliable wind"},
"Cape Town-Big Bay":{months:"Nov–Mar",note:"Cape Doctor SE wind strongest in summer"},
"Mauritius-Le Morne":{months:"May–Oct",note:"SE trade winds peak in winter"},
"Hua Hin,Thailand":{months:"Nov–Mar",note:"NE monsoon brings consistent wind"},
"Pranburi,Thailand":{months:"Nov–Mar",note:"NE monsoon season"},
"Koh Samui,Thailand":{months:"Dec–Apr",note:"Gulf of Thailand winter winds"},
"Phuket-Nai Harn":{months:"May–Oct",note:"SW monsoon season"},
"Chumphon,Thailand":{months:"Nov–Mar",note:"NE monsoon reliable winds"},
"Mui Ne,Vietnam":{months:"Nov–Apr",note:"NE monsoon — world-famous conditions"},
"Ninh Chu Bay,Vietnam":{months:"Nov–Apr",note:"NE monsoon,flat lagoon"},
"Da Nang,Vietnam":{months:"Sep–Dec",note:"NE monsoon autumn transition"},
"Phan Rang,Vietnam":{months:"Nov–Mar",note:"Strong dry season wind"},
"Nha Trang,Vietnam":{months:"Jan–Mar",note:"Dry season NE wind"},
"Sri Lanka-Kalpitiya":{months:"May–Oct",note:"SW monsoon,kite capital of Asia"},
"Boracay,Philippines":{months:"Nov–Apr",note:"Amihan NE trade wind season"},
"Cabarete,Dominican Rep.":{months:"Jun–Aug",note:"Trade winds peak in summer"},
"Aruba-Boca Grandi":{months:"Nov–Jul",note:"Trade winds reliable almost year-round"},
"Barbados-Silver Sands":{months:"Dec–Jun",note:"Trade winds strongest in winter"},
"Barbados-Brandons Beach":{months:"Dec–Jun",note:"Sheltered bay,consistent trades"},
"Turks&Caicos-Long Bay":{months:"Nov–Apr",note:"Winter trade winds,flat water"},
"St. Martin-Orient Bay":{months:"Dec–May",note:"Trade winds,warm flat water"},
"Aruba-Hadicurari Beach":{months:"Jan–Aug",note:"Trade winds blow almost year-round"},
"Jericoacoara,Brazil":{months:"Jul–Jan",note:"Trade winds strongest Jul–Jan"},
"Cumbuco,Brazil":{months:"Jul–Dec",note:"Reliable NE trade winds"},
"Paracas,Peru":{months:"Oct–Mar",note:"Paracas wind(Viento de Paracas)"},
"Margaret River,Australia":{months:"Nov–Mar",note:"Fremantle Doctor sea breeze"},
"Esperance,Australia":{months:"Oct–Apr",note:"Southern Ocean winds,summer season"},
};
function getBestMonthForSpot(place){
if(BEST_MONTHS[place.name])return BEST_MONTHS[place.name];
const keys=Object.keys(BEST_MONTHS);
for(const k of keys){
if(place.name.toLowerCase().includes(k.toLowerCase().split(',')[0].toLowerCase())||
k.toLowerCase().includes(place.name.toLowerCase().split(',')[0].toLowerCase())){
return BEST_MONTHS[k];
}
}
const match=BEST_SPOTS.find(s=>Math.abs(s.lat-place.lat)<0.02&&Math.abs(s.lon-place.lon)<0.02);
if(match&&BEST_MONTHS[match.name])return BEST_MONTHS[match.name];
return null;
}
window.getBestMonthForSpot=getBestMonthForSpot;