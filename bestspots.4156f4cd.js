// Best windsurfing & kitesurfing spots — no Israel in public list
const BEST_SPOTS = [

  // USA
  { name: 'Kanaha Beach, Maui',         lat: 20.8978,  lon: -156.4654, country: 'USA' },
  { name: "Ho'okipa Beach, Maui",        lat: 20.9333,  lon: -156.3439, country: 'USA' },
  { name: 'Crissy Field, San Francisco', lat: 37.8047,  lon: -122.4657, country: 'USA' },
  { name: 'Sherman Island, CA Delta',    lat: 38.0333,  lon: -121.7667, country: 'USA' },
  { name: 'Columbia River Gorge, OR',    lat: 45.7028,  lon: -121.5236, country: 'USA' },
  { name: 'Cape Hatteras, NC',           lat: 35.2331,  lon:  -75.5296, country: 'USA' },
  { name: 'Nags Head, NC',              lat: 35.9571,  lon:  -75.6246, country: 'USA' },
  { name: 'Key West, Florida',           lat: 24.5551,  lon:  -81.7800, country: 'USA' },
  { name: 'South Padre Island, TX',      lat: 26.0697,  lon:  -97.1664, country: 'USA' },
  { name: 'Long Island Sound, NY',       lat: 40.9176,  lon:  -73.1282, country: 'USA' },

  // Canada
  { name: 'Squamish, British Columbia',  lat: 49.7016,  lon: -123.1558, country: 'Canada' },
  { name: 'Goderich, Ontario',           lat: 43.7453,  lon:  -81.7167, country: 'Canada' },
  { name: 'Niagara-on-the-Lake, ON',     lat: 43.2553,  lon:  -79.0711, country: 'Canada' },
  { name: 'Iles-de-la-Madeleine, QC',    lat: 47.3833,  lon:  -61.8667, country: 'Canada' },
  { name: 'Inverness, Nova Scotia',      lat: 46.2167,  lon:  -61.0833, country: 'Canada' },

  // Spain
  { name: 'Tarifa, Spain',              lat: 36.0136,  lon:   -5.6065, country: 'Spain' },
  { name: 'El Medano, Tenerife',         lat: 28.0500,  lon:  -16.5333, country: 'Spain' },
  { name: 'Fuerteventura - Sotavento',   lat: 28.0833,  lon:  -14.1167, country: 'Spain' },
  { name: 'Valencia, Spain',             lat: 39.4542,  lon:   -0.3256, country: 'Spain' },
  { name: 'Maresme Coast, Barcelona',    lat: 41.5000,  lon:    2.5000, country: 'Spain' },

  // France
  { name: 'Leucate, France',            lat: 42.9097,  lon:    3.0281, country: 'France' },
  { name: 'La Torche, Brittany',         lat: 47.8500,  lon:   -4.3333, country: 'France' },
  { name: 'Almanarre, France',           lat: 43.0833,  lon:    6.0833, country: 'France' },
  { name: 'Gruissan, France',            lat: 43.0972,  lon:    3.0833, country: 'France' },
  { name: 'Hyeres, France',              lat: 43.1200,  lon:    6.1200, country: 'France' },

  // Germany
  { name: 'Fehmarn, Germany',            lat: 54.4617,  lon:   11.1900, country: 'Germany' },
  { name: 'Sylt - Westerland',           lat: 54.9025,  lon:    8.3125, country: 'Germany' },
  { name: 'Kuehlungsborn, Germany',      lat: 54.1467,  lon:   11.7439, country: 'Germany' },
  { name: 'Timmendorfer Strand',         lat: 53.9986,  lon:   10.7758, country: 'Germany' },
  { name: 'Ruegen - Dranske',            lat: 54.6333,  lon:   13.2167, country: 'Germany' },

  // Netherlands
  { name: 'Brouwersdam, Netherlands',    lat: 51.7464,  lon:    3.8872, country: 'Netherlands' },
  { name: 'Zandvoort, Netherlands',      lat: 52.3731,  lon:    4.5317, country: 'Netherlands' },
  { name: 'Grevelingenmeer',             lat: 51.7333,  lon:    3.9000, country: 'Netherlands' },
  { name: 'Haringvliet, Netherlands',    lat: 51.7833,  lon:    4.1333, country: 'Netherlands' },
  { name: 'IJsselmeer - Workum',         lat: 52.9833,  lon:    5.4500, country: 'Netherlands' },

  // Italy
  { name: 'Lake Garda - Torbole',        lat: 45.8753,  lon:   10.8739, country: 'Italy' },
  { name: 'Lake Garda - Malcesine',      lat: 45.7667,  lon:   10.8333, country: 'Italy' },
  { name: 'Taranto, Italy',              lat: 40.4644,  lon:   17.2472, country: 'Italy' },
  { name: 'Cagliari - Poetto, Sardinia', lat: 39.2100,  lon:    9.1700, country: 'Italy' },
  { name: 'Porto Pollo, Sardinia',       lat: 41.1000,  lon:    9.3000, country: 'Italy' },

  // Greece
  { name: 'Karpathos, Greece',           lat: 35.5074,  lon:   27.1483, country: 'Greece' },
  { name: 'Rhodes, Greece',              lat: 36.1944,  lon:   27.9694, country: 'Greece' },
  { name: 'Paros, Greece',               lat: 37.0853,  lon:   25.1489, country: 'Greece' },
  { name: 'Naxos, Greece',               lat: 37.1036,  lon:   25.3766, country: 'Greece' },
  { name: 'Vassiliki, Lefkada',          lat: 38.6167,  lon:   20.5833, country: 'Greece' },

  // Portugal
  { name: 'Guincho, Portugal',           lat: 38.7333,  lon:   -9.4667, country: 'Portugal' },
  { name: 'Viana do Castelo',            lat: 41.6942,  lon:   -8.8350, country: 'Portugal' },
  { name: 'Peniche, Portugal',           lat: 39.3561,  lon:   -9.3811, country: 'Portugal' },
  { name: 'Alvor, Algarve',              lat: 37.1236,  lon:   -8.6014, country: 'Portugal' },
  { name: 'Lagos, Algarve',              lat: 37.1028,  lon:   -8.6744, country: 'Portugal' },

  // Croatia
  { name: 'Bol, Brac Island',            lat: 43.2625,  lon:   16.6511, country: 'Croatia' },
  { name: 'Viganj, Croatia',             lat: 42.9167,  lon:   17.0833, country: 'Croatia' },
  { name: 'Nin Lagoon, Croatia',         lat: 44.2333,  lon:   15.1833, country: 'Croatia' },
  { name: 'Pag Island, Croatia',         lat: 44.4528,  lon:   15.0581, country: 'Croatia' },
  { name: 'Zadar, Croatia',              lat: 44.1194,  lon:   15.2314, country: 'Croatia' },

  // Turkey
  { name: 'Alacati, Turkey',             lat: 38.2811,  lon:   26.3764, country: 'Turkey' },
  { name: 'Gokceada, Turkey',            lat: 40.1833,  lon:   25.9000, country: 'Turkey' },
  { name: 'Bodrum, Turkey',              lat: 37.0342,  lon:   27.4303, country: 'Turkey' },
  { name: 'Akyaka, Turkey',              lat: 37.0500,  lon:   28.1500, country: 'Turkey' },
  { name: 'Cesme, Turkey',               lat: 38.3244,  lon:   26.3028, country: 'Turkey' },

  // Denmark
  { name: 'Klitmoller, Denmark',         lat: 57.0167,  lon:    8.5000, country: 'Denmark' },
  { name: 'Hvide Sande, Denmark',        lat: 56.0000,  lon:    8.1333, country: 'Denmark' },
  { name: 'Romo Island, Denmark',        lat: 55.1333,  lon:    8.5500, country: 'Denmark' },
  { name: 'Blokhus, Denmark',            lat: 57.2500,  lon:    9.5667, country: 'Denmark' },
  { name: 'Thyboron, Denmark',           lat: 56.7000,  lon:    8.2167, country: 'Denmark' },

  // United Kingdom
  { name: 'Poole Harbour, England',      lat: 50.7167,  lon:   -1.9833, country: 'UK' },
  { name: 'Hayling Island, England',     lat: 50.8000,  lon:   -1.0333, country: 'UK' },
  { name: 'Rhossili Bay, Wales',         lat: 51.5667,  lon:   -4.2833, country: 'UK' },
  { name: 'Tiree, Scotland',             lat: 56.5167,  lon:   -6.8833, country: 'UK' },
  { name: 'Brandon Bay, Ireland',        lat: 52.2333,  lon:  -10.1333, country: 'UK' },

  // Sweden
  { name: 'Varberg, Sweden',             lat: 57.1047,  lon:   12.2428, country: 'Sweden' },
  { name: 'Lomma Beach, Sweden',         lat: 55.6733,  lon:   13.0600, country: 'Sweden' },
  { name: 'Tylosand, Sweden',            lat: 56.6667,  lon:   12.7333, country: 'Sweden' },
  { name: 'Gotland, Sweden',             lat: 57.5000,  lon:   18.5000, country: 'Sweden' },

  // Poland
  { name: 'Hel Peninsula, Poland',       lat: 54.6036,  lon:   18.7972, country: 'Poland' },
  { name: 'Leba, Poland',                lat: 54.7617,  lon:   17.5358, country: 'Poland' },
  { name: 'Jastarnia, Poland',           lat: 54.6964,  lon:   18.6778, country: 'Poland' },
  { name: 'Puck Bay, Poland',            lat: 54.7333,  lon:   18.4167, country: 'Poland' },

  // Austria & Switzerland
  { name: 'Neusiedler See, Austria',     lat: 47.8667,  lon:   16.7667, country: 'Austria' },
  { name: 'Lake Constance - Bregenz',    lat: 47.5031,  lon:    9.7471, country: 'Austria' },
  { name: 'Lake Silvaplana, Switzerland',lat: 46.4500,  lon:    9.7833, country: 'Switzerland' },
  { name: 'Lake Thun, Switzerland',      lat: 46.7500,  lon:    7.6667, country: 'Switzerland' },
  { name: 'Lake Neuchatel, Switzerland', lat: 46.9167,  lon:    6.9167, country: 'Switzerland' },

  // Russia
  { name: 'Anapa, Russia',               lat: 44.8939,  lon:   37.3158, country: 'Russia' },
  { name: 'Gelendzhik, Russia',          lat: 44.5614,  lon:   38.0789, country: 'Russia' },
  { name: 'Tuapse, Russia',              lat: 44.1000,  lon:   39.0833, country: 'Russia' },
  { name: 'Vladivostok, Russia',         lat: 43.1167,  lon:  131.9000, country: 'Russia' },
  { name: 'Lake Baikal - Irkutsk',       lat: 51.8667,  lon:  104.5000, country: 'Russia' },

  // Morocco
  { name: 'Essaouira, Morocco',          lat: 31.5085,  lon:   -9.7595, country: 'Morocco' },
  { name: 'Dakhla, Morocco',             lat: 23.7147,  lon:  -15.9372, country: 'Morocco' },

  // Egypt
  { name: 'Dahab, Egypt',                lat: 28.5068,  lon:   34.5128, country: 'Egypt' },
  { name: 'El Gouna, Egypt',             lat: 27.3833,  lon:   33.6833, country: 'Egypt' },

  // Jordan
  { name: 'Aqaba, Jordan',               lat: 29.5269,  lon:   35.0063, country: 'Jordan' },

  // Thailand
  { name: 'Hua Hin, Thailand',           lat: 12.5681,  lon:   99.9584, country: 'Thailand' },
  { name: 'Pranburi, Thailand',          lat: 12.3833,  lon:   99.9167, country: 'Thailand' },
  { name: 'Koh Samui, Thailand',         lat:  9.5349,  lon:  100.0612, country: 'Thailand' },
  { name: 'Phuket - Nai Harn',           lat:  7.7656,  lon:   98.3044, country: 'Thailand' },
  { name: 'Chumphon, Thailand',          lat: 10.4833,  lon:   99.1667, country: 'Thailand' },

  // Vietnam
  { name: 'Mui Ne, Vietnam',             lat: 10.9333,  lon:  108.2833, country: 'Vietnam' },
  { name: 'Ninh Chu Bay, Vietnam',       lat: 11.5500,  lon:  108.9833, country: 'Vietnam' },
  { name: 'Da Nang, Vietnam',            lat: 16.0544,  lon:  108.2022, country: 'Vietnam' },
  { name: 'Phan Rang, Vietnam',          lat: 11.5649,  lon:  108.9888, country: 'Vietnam' },
  { name: 'Nha Trang, Vietnam',          lat: 12.2388,  lon:  109.1967, country: 'Vietnam' },

  // Asia other
  { name: 'Sri Lanka - Kalpitiya',       lat:  8.2333,  lon:   79.7667, country: 'Sri Lanka' },
  { name: 'Boracay, Philippines',        lat: 11.9674,  lon:  121.9248, country: 'Philippines' },

  // Africa
  { name: 'Zanzibar, Tanzania',          lat: -6.1659,  lon:   39.2026, country: 'Tanzania' },
  { name: 'Cape Town - Big Bay',         lat:-33.7439,  lon:   18.4803, country: 'South Africa' },
  { name: 'Mauritius - Le Morne',        lat:-20.4667,  lon:   57.3167, country: 'Mauritius' },

  // Caribbean
  { name: 'Cabarete, Dominican Rep.',    lat: 19.7500,  lon:  -70.4167, country: 'Caribbean' },
  { name: 'Aruba - Hadicurari Beach',    lat: 12.5667,  lon:  -70.0333, country: 'Caribbean' },

  // South America
  { name: 'Jericoacoara, Brazil',        lat: -2.7928,  lon:  -40.5147, country: 'Brazil' },
  { name: 'Cumbuco, Brazil',             lat: -3.6244,  lon:  -38.6850, country: 'Brazil' },
  { name: 'Paracas, Peru',               lat:-13.8333,  lon:  -76.2500, country: 'Peru' },

  // Australia
  { name: 'Margaret River, Australia',   lat:-33.9550,  lon:  115.0728, country: 'Australia' },
  { name: 'Esperance, Australia',        lat:-33.8614,  lon:  121.8920, country: 'Australia' },

  // Israel
  { name: 'Bat Galim (Haifa)',          lat: 32.8333, lon:  34.9667, country: 'Israel' },
  { name: 'Dor Beach (Hof Dor)',        lat: 32.6078, lon:  34.9233, country: 'Israel' },
  { name: 'Tel Baruch (TLV)',           lat: 32.1220, lon:  34.7900, country: 'Israel' },
  { name: 'Bat Yam Beach',              lat: 32.0238, lon:  34.7519, country: 'Israel' },
  { name: 'Ashdod Beach',              lat: 31.7921, lon:  34.6497, country: 'Israel' },
  { name: 'Ashkelon Beach',            lat: 31.6650, lon:  34.5530, country: 'Israel' },
  { name: 'Migdal (Kinneret)',          lat: 32.8390, lon:  35.4950, country: 'Israel' },
];

// Country tabs order — grouped logically
const COUNTRY_TAB_ORDER = [
  'All',
  'USA', 'Canada',
  'Spain', 'France', 'Germany', 'Netherlands', 'Italy', 'Greece', 'Portugal',
  'Croatia', 'Turkey', 'Denmark', 'UK', 'Sweden', 'Poland', 'Austria', 'Switzerland', 'Russia',
  'Morocco', 'Egypt', 'Jordan', 'Israel', 'Tanzania', 'South Africa', 'Mauritius',
  'Thailand', 'Vietnam', 'Sri Lanka', 'Philippines',
  'Caribbean', 'Brazil', 'Peru',
  'Australia',
];

// Country detection & first-run seeding
const COUNTRY_STORAGE_KEY = 'wind_user_country_v1';
const SEEDED_STORAGE_KEY  = 'wind_seeded_v1';

const SEED_SPOTS_BY_COUNTRY = {
  US: [
    { name: 'Kanaha Beach, Maui',         lat: 20.8978, lon: -156.4654 },
    { name: 'Columbia River Gorge, OR',   lat: 45.7028, lon: -121.5236 },
    { name: 'Cape Hatteras, NC',          lat: 35.2331, lon:  -75.5296 },
    { name: 'Crissy Field, San Francisco',lat: 37.8047, lon: -122.4657 },
    { name: 'South Padre Island, TX',     lat: 26.0697, lon:  -97.1664 },
  ],
  CA: [
    { name: 'Squamish, British Columbia', lat: 49.7016, lon: -123.1558 },
    { name: 'Goderich, Ontario',          lat: 43.7453, lon:  -81.7167 },
    { name: 'Iles-de-la-Madeleine, QC',  lat: 47.3833, lon:  -61.8667 },
    { name: 'Niagara-on-the-Lake, ON',   lat: 43.2553, lon:  -79.0711 },
    { name: 'Inverness, Nova Scotia',     lat: 46.2167, lon:  -61.0833 },
  ],
  TH: [
    { name: 'Hua Hin, Thailand',          lat: 12.5681, lon:  99.9584 },
    { name: 'Pranburi, Thailand',         lat: 12.3833, lon:  99.9167 },
    { name: 'Koh Samui, Thailand',        lat:  9.5349, lon: 100.0612 },
    { name: 'Phuket - Nai Harn',          lat:  7.7656, lon:  98.3044 },
    { name: 'Chumphon, Thailand',         lat: 10.4833, lon:  99.1667 },
  ],
  VN: [
    { name: 'Mui Ne, Vietnam',            lat: 10.9333, lon: 108.2833 },
    { name: 'Ninh Chu Bay, Vietnam',      lat: 11.5500, lon: 108.9833 },
    { name: 'Da Nang, Vietnam',           lat: 16.0544, lon: 108.2022 },
    { name: 'Phan Rang, Vietnam',         lat: 11.5649, lon: 108.9888 },
    { name: 'Nha Trang, Vietnam',         lat: 12.2388, lon: 109.1967 },
  ],
  NL: [
    { name: 'Brouwersdam, Netherlands',   lat: 51.7464, lon:   3.8872 },
    { name: 'Zandvoort, Netherlands',     lat: 52.3731, lon:   4.5317 },
    { name: 'Grevelingenmeer',            lat: 51.7333, lon:   3.9000 },
    { name: 'Haringvliet, Netherlands',   lat: 51.7833, lon:   4.1333 },
    { name: 'IJsselmeer - Workum',        lat: 52.9833, lon:   5.4500 },
  ],
  DE: [
    { name: 'Fehmarn, Germany',           lat: 54.4617, lon:  11.1900 },
    { name: 'Sylt - Westerland',          lat: 54.9025, lon:   8.3125 },
    { name: 'Kuehlungsborn, Germany',     lat: 54.1467, lon:  11.7439 },
    { name: 'Timmendorfer Strand',        lat: 53.9986, lon:  10.7758 },
    { name: 'Ruegen - Dranske',           lat: 54.6333, lon:  13.2167 },
  ],
  RU: [
    { name: 'Anapa, Russia',              lat: 44.8939, lon:  37.3158 },
    { name: 'Gelendzhik, Russia',         lat: 44.5614, lon:  38.0789 },
    { name: 'Tuapse, Russia',             lat: 44.1000, lon:  39.0833 },
    { name: 'Vladivostok, Russia',        lat: 43.1167, lon: 131.9000 },
    { name: 'Lake Baikal - Irkutsk',      lat: 51.8667, lon: 104.5000 },
  ],
  IT: [
    { name: 'Lake Garda - Torbole',       lat: 45.8753, lon:  10.8739 },
    { name: 'Lake Garda - Malcesine',     lat: 45.7667, lon:  10.8333 },
    { name: 'Porto Pollo, Sardinia',      lat: 41.1000, lon:   9.3000 },
    { name: 'Cagliari - Poetto, Sardinia',lat: 39.2100, lon:   9.1700 },
    { name: 'Taranto, Italy',             lat: 40.4644, lon:  17.2472 },
  ],
  IL: [
    { name: 'Bat Galim (Haifa)',          lat: 32.8333, lon:  34.9667 },
    { name: 'Dor Beach (Hof Dor)',        lat: 32.6078, lon:  34.9233 },
    { name: 'Tel Baruch (TLV)',           lat: 32.1220, lon:  34.7900 },
    { name: 'Ashdod Beach',              lat: 31.7921, lon:  34.6497 },
    { name: 'Migdal (Kinneret)',          lat: 32.8390, lon:  35.4950 },
  ],
  ES: [
    { name: 'Tarifa, Spain',              lat: 36.0136, lon:  -5.6065 },
    { name: 'El Medano, Tenerife',        lat: 28.0500, lon: -16.5333 },
    { name: 'Fuerteventura - Sotavento',  lat: 28.0833, lon: -14.1167 },
    { name: 'Valencia, Spain',            lat: 39.4542, lon:  -0.3256 },
    { name: 'Maresme Coast, Barcelona',   lat: 41.5000, lon:   2.5000 },
  ],
  FR: [
    { name: 'Leucate, France',            lat: 42.9097, lon:   3.0281 },
    { name: 'La Torche, Brittany',        lat: 47.8500, lon:  -4.3333 },
    { name: 'Almanarre, France',          lat: 43.0833, lon:   6.0833 },
    { name: 'Gruissan, France',           lat: 43.0972, lon:   3.0833 },
    { name: 'Hyeres, France',             lat: 43.1200, lon:   6.1200 },
  ],
  GR: [
    { name: 'Karpathos, Greece',          lat: 35.5074, lon:  27.1483 },
    { name: 'Rhodes, Greece',             lat: 36.1944, lon:  27.9694 },
    { name: 'Paros, Greece',              lat: 37.0853, lon:  25.1489 },
    { name: 'Naxos, Greece',              lat: 37.1036, lon:  25.3766 },
    { name: 'Vassiliki, Lefkada',         lat: 38.6167, lon:  20.5833 },
  ],
  PT: [
    { name: 'Guincho, Portugal',          lat: 38.7333, lon:  -9.4667 },
    { name: 'Viana do Castelo',           lat: 41.6942, lon:  -8.8350 },
    { name: 'Peniche, Portugal',          lat: 39.3561, lon:  -9.3811 },
    { name: 'Alvor, Algarve',             lat: 37.1236, lon:  -8.6014 },
    { name: 'Lagos, Algarve',             lat: 37.1028, lon:  -8.6744 },
  ],
  HR: [
    { name: 'Bol, Brac Island',           lat: 43.2625, lon:  16.6511 },
    { name: 'Viganj, Croatia',            lat: 42.9167, lon:  17.0833 },
    { name: 'Nin Lagoon, Croatia',        lat: 44.2333, lon:  15.1833 },
    { name: 'Pag Island, Croatia',        lat: 44.4528, lon:  15.0581 },
    { name: 'Zadar, Croatia',             lat: 44.1194, lon:  15.2314 },
  ],
  TR: [
    { name: 'Alacati, Turkey',            lat: 38.2811, lon:  26.3764 },
    { name: 'Gokceada, Turkey',           lat: 40.1833, lon:  25.9000 },
    { name: 'Bodrum, Turkey',             lat: 37.0342, lon:  27.4303 },
    { name: 'Akyaka, Turkey',             lat: 37.0500, lon:  28.1500 },
    { name: 'Cesme, Turkey',              lat: 38.3244, lon:  26.3028 },
  ],
  DK: [
    { name: 'Klitmoller, Denmark',        lat: 57.0167, lon:   8.5000 },
    { name: 'Hvide Sande, Denmark',       lat: 56.0000, lon:   8.1333 },
    { name: 'Romo Island, Denmark',       lat: 55.1333, lon:   8.5500 },
    { name: 'Blokhus, Denmark',           lat: 57.2500, lon:   9.5667 },
    { name: 'Thyboron, Denmark',          lat: 56.7000, lon:   8.2167 },
  ],
  GB: [
    { name: 'Poole Harbour, England',     lat: 50.7167, lon:  -1.9833 },
    { name: 'Hayling Island, England',    lat: 50.8000, lon:  -1.0333 },
    { name: 'Rhossili Bay, Wales',        lat: 51.5667, lon:  -4.2833 },
    { name: 'Tiree, Scotland',            lat: 56.5167, lon:  -6.8833 },
    { name: 'Brandon Bay, Ireland',       lat: 52.2333, lon: -10.1333 },
  ],
  DEFAULT: [
    { name: 'Tarifa, Spain',              lat: 36.0136, lon:  -5.6065 },
    { name: 'Dahab, Egypt',               lat: 28.5068, lon:  34.5128 },
    { name: 'Mui Ne, Vietnam',            lat: 10.9333, lon: 108.2833 },
    { name: 'Kanaha Beach, Maui',         lat: 20.8978, lon: -156.4654 },
    { name: 'Jericoacoara, Brazil',       lat: -2.7928, lon: -40.5147 },
  ],
};

async function detectAndSeedCountry() {
  if (localStorage.getItem(SEEDED_STORAGE_KEY)) return;
  let countryCode = localStorage.getItem(COUNTRY_STORAGE_KEY);
  if (!countryCode) {
    try {
      const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
      const d = await r.json();
      countryCode = (d.country_code || 'DEFAULT').toUpperCase();
    } catch { countryCode = 'DEFAULT'; }
    localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
  }
  const spots = SEED_SPOTS_BY_COUNTRY[countryCode] || SEED_SPOTS_BY_COUNTRY.DEFAULT;
  const places = getPlaces();
  let added = 0;
  for (const spot of spots) {
    const exists = places.some(p => Math.abs(p.lat - spot.lat) < 0.01 && Math.abs(p.lon - spot.lon) < 0.01);
    if (!exists) {
      places.push({ key: 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2),
        name: spot.name.slice(0, 28), lat: spot.lat, lon: spot.lon,
        sea: guessSeaForPoint(spot.lat, spot.lon), applyBonus: false, group: 'My Spots' });
      added++;
    }
  }
  if (added > 0) { savePlaces(places); reloadPlacesKeepSelection(); buildFoldersUI(); }
  localStorage.setItem(SEEDED_STORAGE_KEY, '1');
}

// ── Best Spots UI ─────────────────────────────────────────────────────────────
const addSelectedSpotsBtn = document.getElementById('addSelectedSpotsBtn');
let selectedSpots = new Set();
let activeCountryTab = 'All';

function renderBestSpotsList() {
  const container = document.getElementById('bestSpotsList');
  container.innerHTML = '';

  // ── Country tab bar ────────────────────────────────────────────────────────
  const tabBar = document.createElement('div');
  tabBar.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; padding-bottom:10px; border-bottom:2px solid #ecf0f1; position:sticky; top:0; background:white; z-index:2; padding-top:4px;';

  // Only show tabs that have spots
  const countriesWithSpots = ['All', ...new Set(BEST_SPOTS.map(s => s.country))];
  const tabsToShow = COUNTRY_TAB_ORDER.filter(c => countriesWithSpots.includes(c));

  for (const country of tabsToShow) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = country;
    btn.style.cssText = 'padding:4px 10px; border-radius:20px; border:1.5px solid #bdc3c7; background:' +
      (country === activeCountryTab ? '#2c3e50' : '#f8f9fa') +
      '; color:' + (country === activeCountryTab ? '#fff' : '#2c3e50') +
      '; font-size:0.8em; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.15s;';
    btn.onclick = () => {
      activeCountryTab = country;
      renderBestSpotsList();
      // Scroll the spots list to top
      container.scrollTop = 0;
    };
    tabBar.appendChild(btn);
  }
  container.appendChild(tabBar);

  // ── Spots list ─────────────────────────────────────────────────────────────
  const filtered = activeCountryTab === 'All'
    ? BEST_SPOTS
    : BEST_SPOTS.filter(s => s.country === activeCountryTab);

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.style.cssText = 'color:#6c7a89; text-align:center; padding:20px;';
    empty.textContent = 'No spots for this country yet.';
    container.appendChild(empty);
    return;
  }

  for (const spot of filtered) {
    const spotDiv = document.createElement('div');
    const isSelected = selectedSpots.has(spot.name);
    spotDiv.style.cssText = 'display:flex; align-items:center; padding:10px; background:' +
      (isSelected ? '#c8e6c9' : '#f8f9fa') +
      '; border-radius:8px; cursor:pointer; transition:background 0.2s; margin-bottom:4px;';
    spotDiv.onmouseenter = () => { if (!selectedSpots.has(spot.name)) spotDiv.style.background = '#e3f2fd'; };
    spotDiv.onmouseleave = () => { spotDiv.style.background = selectedSpots.has(spot.name) ? '#c8e6c9' : '#f8f9fa'; };

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'spot_' + spot.name.replace(/[^a-z0-9]/gi, '_');
    checkbox.style.cssText = 'margin-right:12px; width:18px; height:18px; cursor:pointer; flex-shrink:0;';
    checkbox.checked = isSelected;
    checkbox.onchange = () => {
      if (checkbox.checked) { selectedSpots.add(spot.name); spotDiv.style.background = '#c8e6c9'; }
      else { selectedSpots.delete(spot.name); spotDiv.style.background = '#f8f9fa'; }
      addSelectedSpotsBtn.disabled = selectedSpots.size === 0;
    };

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.style.cssText = 'cursor:pointer; flex:1; display:flex; justify-content:space-between; align-items:center; gap:8px;';
    label.innerHTML = '<span style="font-weight:600; color:#2c3e50;">' + spot.name + '</span>' +
      '<span style="color:#6c7a89; font-size:0.82em; flex-shrink:0;">' + spot.lat.toFixed(2) + ', ' + spot.lon.toFixed(2) + '</span>';

    spotDiv.appendChild(checkbox);
    spotDiv.appendChild(label);
    container.appendChild(spotDiv);
  }

  addSelectedSpotsBtn.disabled = selectedSpots.size === 0;
}

addSelectedSpotsBtn.addEventListener('click', () => {
  if (selectedSpots.size === 0) return;
  const places = getPlaces();
  let addedCount = 0;
  for (const spotName of selectedSpots) {
    const spot = BEST_SPOTS.find(s => s.name === spotName);
    if (!spot) continue;
    const exists = places.some(p => Math.abs(p.lat - spot.lat) < 0.01 && Math.abs(p.lon - spot.lon) < 0.01);
    if (!exists) {
      places.push({ key: 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2),
        name: spot.name.slice(0, 28), lat: spot.lat, lon: spot.lon,
        sea: guessSeaForPoint(spot.lat, spot.lon), applyBonus: false, group: 'Best World Spots' });
      addedCount++;
    }
  }
  if (addedCount > 0) { savePlaces(places); reloadPlacesKeepSelection(); buildFoldersUI(); }
  selectedSpots.clear();
  renderBestSpotsList();
});

detectAndSeedCountry();
