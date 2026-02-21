// Best windsurfing & kitesurfing spots in the world
// Israeli spots are only shown to users from Israel (detected on first run)
const BEST_SPOTS = [

  // USA
  { name: 'Kanaha Beach, Maui', lat: 20.8978, lon: -156.4654, region: 'USA - Hawaii' },
  { name: "Ho'okipa Beach, Maui", lat: 20.9333, lon: -156.3439, region: 'USA - Hawaii' },
  { name: 'Crissy Field, San Francisco', lat: 37.8047, lon: -122.4657, region: 'USA - Pacific' },
  { name: 'Sherman Island, CA Delta', lat: 38.0333, lon: -121.7667, region: 'USA - Pacific' },
  { name: 'Columbia River Gorge, OR', lat: 45.7028, lon: -121.5236, region: 'USA - Pacific' },
  { name: 'Cape Hatteras, NC', lat: 35.2331, lon: -75.5296, region: 'USA - Atlantic' },
  { name: 'Nags Head, NC', lat: 35.9571, lon: -75.6246, region: 'USA - Atlantic' },
  { name: 'Key West, Florida', lat: 24.5551, lon: -81.7800, region: 'USA - Florida' },
  { name: 'South Padre Island, TX', lat: 26.0697, lon: -97.1664, region: 'USA - Gulf' },
  { name: 'Long Island Sound, NY', lat: 40.9176, lon: -73.1282, region: 'USA - Atlantic' },

  // Canada
  { name: 'Squamish, British Columbia', lat: 49.7016, lon: -123.1558, region: 'Canada - Pacific' },
  { name: 'Niagara-on-the-Lake, ON', lat: 43.2553, lon: -79.0711, region: 'Canada - Great Lakes' },
  { name: 'Iles-de-la-Madeleine, QC', lat: 47.3833, lon: -61.8667, region: 'Canada - Atlantic' },
  { name: 'Goderich, Ontario', lat: 43.7453, lon: -81.7167, region: 'Canada - Great Lakes' },
  { name: 'Inverness, Nova Scotia', lat: 46.2167, lon: -61.0833, region: 'Canada - Atlantic' },

  // Thailand
  { name: 'Hua Hin, Thailand', lat: 12.5681, lon: 99.9584, region: 'Asia - Thailand' },
  { name: 'Pranburi, Thailand', lat: 12.3833, lon: 99.9167, region: 'Asia - Thailand' },
  { name: 'Koh Samui, Thailand', lat: 9.5349, lon: 100.0612, region: 'Asia - Thailand' },
  { name: 'Phuket - Nai Harn', lat: 7.7656, lon: 98.3044, region: 'Asia - Thailand' },
  { name: 'Chumphon, Thailand', lat: 10.4833, lon: 99.1667, region: 'Asia - Thailand' },

  // Vietnam
  { name: 'Mui Ne, Vietnam', lat: 10.9333, lon: 108.2833, region: 'Asia - Vietnam' },
  { name: 'Ninh Chu Bay, Vietnam', lat: 11.5500, lon: 108.9833, region: 'Asia - Vietnam' },
  { name: 'Da Nang, Vietnam', lat: 16.0544, lon: 108.2022, region: 'Asia - Vietnam' },
  { name: 'Phan Rang, Vietnam', lat: 11.5649, lon: 108.9888, region: 'Asia - Vietnam' },
  { name: 'Nha Trang, Vietnam', lat: 12.2388, lon: 109.1967, region: 'Asia - Vietnam' },

  // Netherlands
  { name: 'Zandvoort, Netherlands', lat: 52.3731, lon: 4.5317, region: 'Europe - Netherlands' },
  { name: 'Brouwersdam, Netherlands', lat: 51.7464, lon: 3.8872, region: 'Europe - Netherlands' },
  { name: 'Haringvliet, Netherlands', lat: 51.7833, lon: 4.1333, region: 'Europe - Netherlands' },
  { name: 'Grevelingenmeer, Netherlands', lat: 51.7333, lon: 3.9000, region: 'Europe - Netherlands' },
  { name: 'IJsselmeer - Workum', lat: 52.9833, lon: 5.4500, region: 'Europe - Netherlands' },

  // Germany
  { name: 'Fehmarn, Germany', lat: 54.4617, lon: 11.1900, region: 'Europe - Germany' },
  { name: 'Sylt - Westerland, Germany', lat: 54.9025, lon: 8.3125, region: 'Europe - Germany' },
  { name: 'Kuehlungsborn, Germany', lat: 54.1467, lon: 11.7439, region: 'Europe - Germany' },
  { name: 'Timmendorfer Strand', lat: 53.9986, lon: 10.7758, region: 'Europe - Germany' },
  { name: 'Ruegen - Dranske, Germany', lat: 54.6333, lon: 13.2167, region: 'Europe - Germany' },

  // Russia
  { name: 'Anapa, Russia', lat: 44.8939, lon: 37.3158, region: 'Europe - Russia' },
  { name: 'Gelendzhik, Russia', lat: 44.5614, lon: 38.0789, region: 'Europe - Russia' },
  { name: 'Tuapse, Russia', lat: 44.1000, lon: 39.0833, region: 'Europe - Russia' },
  { name: 'Vladivostok, Russia', lat: 43.1167, lon: 131.9000, region: 'Asia - Russia' },
  { name: 'Lake Baikal - Irkutsk', lat: 51.8667, lon: 104.5000, region: 'Asia - Russia' },

  // Italy
  { name: 'Lake Garda - Torbole, Italy', lat: 45.8753, lon: 10.8739, region: 'Europe - Italy' },
  { name: 'Lake Garda - Malcesine', lat: 45.7667, lon: 10.8333, region: 'Europe - Italy' },
  { name: 'Taranto, Italy', lat: 40.4644, lon: 17.2472, region: 'Europe - Italy' },
  { name: 'Cagliari - Poetto, Sardinia', lat: 39.2100, lon: 9.1700, region: 'Europe - Italy' },
  { name: 'Porto Pollo, Sardinia', lat: 41.1000, lon: 9.3000, region: 'Europe - Italy' },

  // Spain
  { name: 'Tarifa, Spain', lat: 36.0136, lon: -5.6065, region: 'Europe - Spain' },
  { name: 'El Medano, Tenerife', lat: 28.0500, lon: -16.5333, region: 'Europe - Spain' },
  { name: 'Fuerteventura - Sotavento', lat: 28.0833, lon: -14.1167, region: 'Europe - Spain' },
  { name: 'Valencia, Spain', lat: 39.4542, lon: -0.3256, region: 'Europe - Spain' },
  { name: 'Maresme Coast, Barcelona', lat: 41.5000, lon: 2.5000, region: 'Europe - Spain' },

  // France
  { name: 'Leucate, France', lat: 42.9097, lon: 3.0281, region: 'Europe - France' },
  { name: 'La Torche, Brittany', lat: 47.8500, lon: -4.3333, region: 'Europe - France' },
  { name: 'Almanarre, France', lat: 43.0833, lon: 6.0833, region: 'Europe - France' },
  { name: 'Gruissan, France', lat: 43.0972, lon: 3.0833, region: 'Europe - France' },
  { name: 'Hyeres, France', lat: 43.1200, lon: 6.1200, region: 'Europe - France' },

  // Greece
  { name: 'Karpathos, Greece', lat: 35.5074, lon: 27.1483, region: 'Europe - Greece' },
  { name: 'Rhodes, Greece', lat: 36.1944, lon: 27.9694, region: 'Europe - Greece' },
  { name: 'Paros, Greece', lat: 37.0853, lon: 25.1489, region: 'Europe - Greece' },
  { name: 'Naxos, Greece', lat: 37.1036, lon: 25.3766, region: 'Europe - Greece' },
  { name: 'Vassiliki, Lefkada', lat: 38.6167, lon: 20.5833, region: 'Europe - Greece' },

  // Portugal
  { name: 'Guincho, Portugal', lat: 38.7333, lon: -9.4667, region: 'Europe - Portugal' },
  { name: 'Viana do Castelo, Portugal', lat: 41.6942, lon: -8.8350, region: 'Europe - Portugal' },
  { name: 'Peniche, Portugal', lat: 39.3561, lon: -9.3811, region: 'Europe - Portugal' },
  { name: 'Alvor, Algarve', lat: 37.1236, lon: -8.6014, region: 'Europe - Portugal' },
  { name: 'Lagos, Algarve', lat: 37.1028, lon: -8.6744, region: 'Europe - Portugal' },

  // Croatia
  { name: 'Bol, Brac Island, Croatia', lat: 43.2625, lon: 16.6511, region: 'Europe - Croatia' },
  { name: 'Viganj, Croatia', lat: 42.9167, lon: 17.0833, region: 'Europe - Croatia' },
  { name: 'Nin Lagoon, Croatia', lat: 44.2333, lon: 15.1833, region: 'Europe - Croatia' },
  { name: 'Pag Island, Croatia', lat: 44.4528, lon: 15.0581, region: 'Europe - Croatia' },
  { name: 'Zadar, Croatia', lat: 44.1194, lon: 15.2314, region: 'Europe - Croatia' },

  // Turkey
  { name: 'Alacati, Turkey', lat: 38.2811, lon: 26.3764, region: 'Europe - Turkey' },
  { name: 'Gokceada, Turkey', lat: 40.1833, lon: 25.9000, region: 'Europe - Turkey' },
  { name: 'Bodrum, Turkey', lat: 37.0342, lon: 27.4303, region: 'Europe - Turkey' },
  { name: 'Akyaka, Turkey', lat: 37.0500, lon: 28.1500, region: 'Europe - Turkey' },
  { name: 'Cesme, Turkey', lat: 38.3244, lon: 26.3028, region: 'Europe - Turkey' },

  // Denmark
  { name: 'Klitmoller, Denmark', lat: 57.0167, lon: 8.5000, region: 'Europe - Denmark' },
  { name: 'Hvide Sande, Denmark', lat: 56.0000, lon: 8.1333, region: 'Europe - Denmark' },
  { name: 'Romo Island, Denmark', lat: 55.1333, lon: 8.5500, region: 'Europe - Denmark' },
  { name: 'Blokhus, Denmark', lat: 57.2500, lon: 9.5667, region: 'Europe - Denmark' },
  { name: 'Thyboron, Denmark', lat: 56.7000, lon: 8.2167, region: 'Europe - Denmark' },

  // UK & Ireland
  { name: 'Poole Harbour, England', lat: 50.7167, lon: -1.9833, region: 'Europe - United Kingdom' },
  { name: 'Hayling Island, England', lat: 50.8000, lon: -1.0333, region: 'Europe - United Kingdom' },
  { name: 'Rhossili Bay, Wales', lat: 51.5667, lon: -4.2833, region: 'Europe - United Kingdom' },
  { name: 'Tiree, Scotland', lat: 56.5167, lon: -6.8833, region: 'Europe - United Kingdom' },
  { name: 'Brandon Bay, Ireland', lat: 52.2333, lon: -10.1333, region: 'Europe - Ireland' },

  // Sweden
  { name: 'Varberg, Sweden', lat: 57.1047, lon: 12.2428, region: 'Europe - Sweden' },
  { name: 'Lomma Beach, Sweden', lat: 55.6733, lon: 13.0600, region: 'Europe - Sweden' },
  { name: 'Tylosand, Sweden', lat: 56.6667, lon: 12.7333, region: 'Europe - Sweden' },
  { name: 'Gotland, Sweden', lat: 57.5000, lon: 18.5000, region: 'Europe - Sweden' },

  // Poland
  { name: 'Hel Peninsula, Poland', lat: 54.6036, lon: 18.7972, region: 'Europe - Poland' },
  { name: 'Leba, Poland', lat: 54.7617, lon: 17.5358, region: 'Europe - Poland' },
  { name: 'Jastarnia, Poland', lat: 54.6964, lon: 18.6778, region: 'Europe - Poland' },
  { name: 'Puck Bay, Poland', lat: 54.7333, lon: 18.4167, region: 'Europe - Poland' },

  // Austria & Switzerland
  { name: 'Neusiedler See, Austria', lat: 47.8667, lon: 16.7667, region: 'Europe - Austria' },
  { name: 'Lake Constance - Bregenz', lat: 47.5031, lon: 9.7471, region: 'Europe - Austria' },
  { name: 'Lake Silvaplana, Switzerland', lat: 46.4500, lon: 9.7833, region: 'Europe - Switzerland' },
  { name: 'Lake Thun, Switzerland', lat: 46.7500, lon: 7.6667, region: 'Europe - Switzerland' },
  { name: 'Lake Neuchatel, Switzerland', lat: 46.9167, lon: 6.9167, region: 'Europe - Switzerland' },

  // Morocco & Africa
  { name: 'Essaouira, Morocco', lat: 31.5085, lon: -9.7595, region: 'Africa - Morocco' },
  { name: 'Dakhla, Morocco', lat: 23.7147, lon: -15.9372, region: 'Africa - Morocco' },
  { name: 'Zanzibar, Tanzania', lat: -6.1659, lon: 39.2026, region: 'Africa - Indian Ocean' },
  { name: 'Cape Town - Big Bay', lat: -33.7439, lon: 18.4803, region: 'Africa - South Africa' },
  { name: 'Mauritius - Le Morne', lat: -20.4667, lon: 57.3167, region: 'Africa - Indian Ocean' },

  // Middle East
  { name: 'Dahab, Egypt', lat: 28.5068, lon: 34.5128, region: 'Middle East - Egypt' },
  { name: 'El Gouna, Egypt', lat: 27.3833, lon: 33.6833, region: 'Middle East - Egypt' },
  { name: 'Aqaba, Jordan', lat: 29.5269, lon: 35.0063, region: 'Middle East - Jordan' },

  // Asia
  { name: 'Sri Lanka - Kalpitiya', lat: 8.2333, lon: 79.7667, region: 'Asia - Sri Lanka' },
  { name: 'Boracay, Philippines', lat: 11.9674, lon: 121.9248, region: 'Asia - Philippines' },

  // Caribbean & Americas
  { name: 'Cabarete, Dominican Rep.', lat: 19.7500, lon: -70.4167, region: 'Caribbean' },
  { name: 'Aruba - Hadicurari Beach', lat: 12.5667, lon: -70.0333, region: 'Caribbean' },
  { name: 'Jericoacoara, Brazil', lat: -2.7928, lon: -40.5147, region: 'South America - Brazil' },
  { name: 'Cumbuco, Brazil', lat: -3.6244, lon: -38.6850, region: 'South America - Brazil' },
  { name: 'Paracas, Peru', lat: -13.8333, lon: -76.2500, region: 'South America - Pacific' },

  // Australia
  { name: 'Margaret River, Australia', lat: -33.9550, lon: 115.0728, region: 'Australia' },
  { name: 'Esperance, Australia', lat: -33.8614, lon: 121.8920, region: 'Australia' },

  // Israel - only shown to IL users
  { name: 'Bat Galim (Haifa)', lat: 32.8333, lon: 34.9667, region: 'Israel', countryOnly: 'IL' },
  { name: 'Dor Beach (Hof Dor)', lat: 32.6078, lon: 34.9233, region: 'Israel', countryOnly: 'IL' },
  { name: 'Tel Baruch (TLV)', lat: 32.1220, lon: 34.7900, region: 'Israel', countryOnly: 'IL' },
  { name: 'Bat Yam Beach', lat: 32.0238, lon: 34.7519, region: 'Israel', countryOnly: 'IL' },
  { name: 'Ashdod Beach', lat: 31.7921, lon: 34.6497, region: 'Israel', countryOnly: 'IL' },
  { name: 'Ashkelon Beach', lat: 31.6650, lon: 34.5530, region: 'Israel', countryOnly: 'IL' },
  { name: 'Migdal (Kinneret)', lat: 32.8390, lon: 35.4950, region: 'Israel', countryOnly: 'IL' },
];

// Default seeded spots per country code (5 spots shown on first visit)
const SEED_SPOTS_BY_COUNTRY = {
  US: [
    { name: 'Kanaha Beach, Maui', lat: 20.8978, lon: -156.4654 },
    { name: 'Columbia River Gorge, OR', lat: 45.7028, lon: -121.5236 },
    { name: 'Cape Hatteras, NC', lat: 35.2331, lon: -75.5296 },
    { name: 'Crissy Field, San Francisco', lat: 37.8047, lon: -122.4657 },
    { name: 'South Padre Island, TX', lat: 26.0697, lon: -97.1664 },
  ],
  CA: [
    { name: 'Squamish, British Columbia', lat: 49.7016, lon: -123.1558 },
    { name: 'Goderich, Ontario', lat: 43.7453, lon: -81.7167 },
    { name: 'Iles-de-la-Madeleine, QC', lat: 47.3833, lon: -61.8667 },
    { name: 'Niagara-on-the-Lake, ON', lat: 43.2553, lon: -79.0711 },
    { name: 'Inverness, Nova Scotia', lat: 46.2167, lon: -61.0833 },
  ],
  TH: [
    { name: 'Hua Hin, Thailand', lat: 12.5681, lon: 99.9584 },
    { name: 'Pranburi, Thailand', lat: 12.3833, lon: 99.9167 },
    { name: 'Koh Samui, Thailand', lat: 9.5349, lon: 100.0612 },
    { name: 'Phuket - Nai Harn', lat: 7.7656, lon: 98.3044 },
    { name: 'Chumphon, Thailand', lat: 10.4833, lon: 99.1667 },
  ],
  VN: [
    { name: 'Mui Ne, Vietnam', lat: 10.9333, lon: 108.2833 },
    { name: 'Ninh Chu Bay, Vietnam', lat: 11.5500, lon: 108.9833 },
    { name: 'Da Nang, Vietnam', lat: 16.0544, lon: 108.2022 },
    { name: 'Phan Rang, Vietnam', lat: 11.5649, lon: 108.9888 },
    { name: 'Nha Trang, Vietnam', lat: 12.2388, lon: 109.1967 },
  ],
  NL: [
    { name: 'Brouwersdam, Netherlands', lat: 51.7464, lon: 3.8872 },
    { name: 'Zandvoort, Netherlands', lat: 52.3731, lon: 4.5317 },
    { name: 'Grevelingenmeer, Netherlands', lat: 51.7333, lon: 3.9000 },
    { name: 'Haringvliet, Netherlands', lat: 51.7833, lon: 4.1333 },
    { name: 'IJsselmeer - Workum', lat: 52.9833, lon: 5.4500 },
  ],
  DE: [
    { name: 'Fehmarn, Germany', lat: 54.4617, lon: 11.1900 },
    { name: 'Sylt - Westerland, Germany', lat: 54.9025, lon: 8.3125 },
    { name: 'Kuehlungsborn, Germany', lat: 54.1467, lon: 11.7439 },
    { name: 'Timmendorfer Strand', lat: 53.9986, lon: 10.7758 },
    { name: 'Ruegen - Dranske, Germany', lat: 54.6333, lon: 13.2167 },
  ],
  RU: [
    { name: 'Anapa, Russia', lat: 44.8939, lon: 37.3158 },
    { name: 'Gelendzhik, Russia', lat: 44.5614, lon: 38.0789 },
    { name: 'Tuapse, Russia', lat: 44.1000, lon: 39.0833 },
    { name: 'Vladivostok, Russia', lat: 43.1167, lon: 131.9000 },
    { name: 'Lake Baikal - Irkutsk', lat: 51.8667, lon: 104.5000 },
  ],
  IT: [
    { name: 'Lake Garda - Torbole, Italy', lat: 45.8753, lon: 10.8739 },
    { name: 'Lake Garda - Malcesine', lat: 45.7667, lon: 10.8333 },
    { name: 'Porto Pollo, Sardinia', lat: 41.1000, lon: 9.3000 },
    { name: 'Cagliari - Poetto, Sardinia', lat: 39.2100, lon: 9.1700 },
    { name: 'Taranto, Italy', lat: 40.4644, lon: 17.2472 },
  ],
  IL: [
    { name: 'Bat Galim (Haifa)', lat: 32.8333, lon: 34.9667 },
    { name: 'Dor Beach (Hof Dor)', lat: 32.6078, lon: 34.9233 },
    { name: 'Tel Baruch (TLV)', lat: 32.1220, lon: 34.7900 },
    { name: 'Ashdod Beach', lat: 31.7921, lon: 34.6497 },
    { name: 'Migdal (Kinneret)', lat: 32.8390, lon: 35.4950 },
  ],
  ES: [
    { name: 'Tarifa, Spain', lat: 36.0136, lon: -5.6065 },
    { name: 'El Medano, Tenerife', lat: 28.0500, lon: -16.5333 },
    { name: 'Fuerteventura - Sotavento', lat: 28.0833, lon: -14.1167 },
    { name: 'Valencia, Spain', lat: 39.4542, lon: -0.3256 },
    { name: 'Maresme Coast, Barcelona', lat: 41.5000, lon: 2.5000 },
  ],
  FR: [
    { name: 'Leucate, France', lat: 42.9097, lon: 3.0281 },
    { name: 'La Torche, Brittany', lat: 47.8500, lon: -4.3333 },
    { name: 'Almanarre, France', lat: 43.0833, lon: 6.0833 },
    { name: 'Gruissan, France', lat: 43.0972, lon: 3.0833 },
    { name: 'Hyeres, France', lat: 43.1200, lon: 6.1200 },
  ],
  GR: [
    { name: 'Karpathos, Greece', lat: 35.5074, lon: 27.1483 },
    { name: 'Rhodes, Greece', lat: 36.1944, lon: 27.9694 },
    { name: 'Paros, Greece', lat: 37.0853, lon: 25.1489 },
    { name: 'Naxos, Greece', lat: 37.1036, lon: 25.3766 },
    { name: 'Vassiliki, Lefkada', lat: 38.6167, lon: 20.5833 },
  ],
  PT: [
    { name: 'Guincho, Portugal', lat: 38.7333, lon: -9.4667 },
    { name: 'Viana do Castelo, Portugal', lat: 41.6942, lon: -8.8350 },
    { name: 'Peniche, Portugal', lat: 39.3561, lon: -9.3811 },
    { name: 'Alvor, Algarve', lat: 37.1236, lon: -8.6014 },
    { name: 'Lagos, Algarve', lat: 37.1028, lon: -8.6744 },
  ],
  HR: [
    { name: 'Bol, Brac Island, Croatia', lat: 43.2625, lon: 16.6511 },
    { name: 'Viganj, Croatia', lat: 42.9167, lon: 17.0833 },
    { name: 'Nin Lagoon, Croatia', lat: 44.2333, lon: 15.1833 },
    { name: 'Pag Island, Croatia', lat: 44.4528, lon: 15.0581 },
    { name: 'Zadar, Croatia', lat: 44.1194, lon: 15.2314 },
  ],
  TR: [
    { name: 'Alacati, Turkey', lat: 38.2811, lon: 26.3764 },
    { name: 'Gokceada, Turkey', lat: 40.1833, lon: 25.9000 },
    { name: 'Bodrum, Turkey', lat: 37.0342, lon: 27.4303 },
    { name: 'Akyaka, Turkey', lat: 37.0500, lon: 28.1500 },
    { name: 'Cesme, Turkey', lat: 38.3244, lon: 26.3028 },
  ],
  DK: [
    { name: 'Klitmoller, Denmark', lat: 57.0167, lon: 8.5000 },
    { name: 'Hvide Sande, Denmark', lat: 56.0000, lon: 8.1333 },
    { name: 'Romo Island, Denmark', lat: 55.1333, lon: 8.5500 },
    { name: 'Blokhus, Denmark', lat: 57.2500, lon: 9.5667 },
    { name: 'Thyboron, Denmark', lat: 56.7000, lon: 8.2167 },
  ],
  GB: [
    { name: 'Poole Harbour, England', lat: 50.7167, lon: -1.9833 },
    { name: 'Hayling Island, England', lat: 50.8000, lon: -1.0333 },
    { name: 'Rhossili Bay, Wales', lat: 51.5667, lon: -4.2833 },
    { name: 'Tiree, Scotland', lat: 56.5167, lon: -6.8833 },
    { name: 'Brandon Bay, Ireland', lat: 52.2333, lon: -10.1333 },
  ],
  SE: [
    { name: 'Varberg, Sweden', lat: 57.1047, lon: 12.2428 },
    { name: 'Lomma Beach, Sweden', lat: 55.6733, lon: 13.0600 },
    { name: 'Tylosand, Sweden', lat: 56.6667, lon: 12.7333 },
    { name: 'Gotland, Sweden', lat: 57.5000, lon: 18.5000 },
    { name: 'Klitmoller, Denmark', lat: 57.0167, lon: 8.5000 },
  ],
  PL: [
    { name: 'Hel Peninsula, Poland', lat: 54.6036, lon: 18.7972 },
    { name: 'Leba, Poland', lat: 54.7617, lon: 17.5358 },
    { name: 'Jastarnia, Poland', lat: 54.6964, lon: 18.6778 },
    { name: 'Puck Bay, Poland', lat: 54.7333, lon: 18.4167 },
    { name: 'Viganj, Croatia', lat: 42.9167, lon: 17.0833 },
  ],
  AT: [
    { name: 'Neusiedler See, Austria', lat: 47.8667, lon: 16.7667 },
    { name: 'Lake Constance - Bregenz', lat: 47.5031, lon: 9.7471 },
    { name: 'Lake Silvaplana, Switzerland', lat: 46.4500, lon: 9.7833 },
    { name: 'Lake Garda - Torbole, Italy', lat: 45.8753, lon: 10.8739 },
    { name: 'Tarifa, Spain', lat: 36.0136, lon: -5.6065 },
  ],
  CH: [
    { name: 'Lake Silvaplana, Switzerland', lat: 46.4500, lon: 9.7833 },
    { name: 'Lake Thun, Switzerland', lat: 46.7500, lon: 7.6667 },
    { name: 'Lake Neuchatel, Switzerland', lat: 46.9167, lon: 6.9167 },
    { name: 'Lake Constance - Bregenz', lat: 47.5031, lon: 9.7471 },
    { name: 'Lake Garda - Torbole, Italy', lat: 45.8753, lon: 10.8739 },
  ],
  DEFAULT: [
    { name: 'Tarifa, Spain', lat: 36.0136, lon: -5.6065 },
    { name: 'Dahab, Egypt', lat: 28.5068, lon: 34.5128 },
    { name: 'Mui Ne, Vietnam', lat: 10.9333, lon: 108.2833 },
    { name: 'Kanaha Beach, Maui', lat: 20.8978, lon: -156.4654 },
    { name: 'Jericoacoara, Brazil', lat: -2.7928, lon: -40.5147 },
  ],
};

// Country detection & first-run seeding
const COUNTRY_STORAGE_KEY = 'wind_user_country_v1';
const SEEDED_STORAGE_KEY  = 'wind_seeded_v1';

async function detectAndSeedCountry() {
  if (localStorage.getItem(SEEDED_STORAGE_KEY)) return;

  let countryCode = localStorage.getItem(COUNTRY_STORAGE_KEY);

  if (!countryCode) {
    try {
      const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
      const d = await r.json();
      countryCode = (d.country_code || 'DEFAULT').toUpperCase();
      localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
    } catch {
      countryCode = 'DEFAULT';
      localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
    }
  }

  const spots = SEED_SPOTS_BY_COUNTRY[countryCode] || SEED_SPOTS_BY_COUNTRY.DEFAULT;
  const places = getPlaces();
  const folderName = 'My Spots';
  let added = 0;

  for (const spot of spots) {
    const exists = places.some(p =>
      Math.abs(p.lat - spot.lat) < 0.01 && Math.abs(p.lon - spot.lon) < 0.01
    );
    if (!exists) {
      places.push({
        key: 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2),
        name: spot.name.slice(0, 28),
        lat: spot.lat,
        lon: spot.lon,
        sea: guessSeaForPoint(spot.lat, spot.lon),
        applyBonus: false,
        group: folderName
      });
      added++;
    }
  }

  if (added > 0) {
    savePlaces(places);
    reloadPlacesKeepSelection();
    buildFoldersUI();
  }

  localStorage.setItem(SEEDED_STORAGE_KEY, '1');
}

// Best Spots UI
const addSelectedSpotsBtn = document.getElementById('addSelectedSpotsBtn');
let selectedSpots = new Set();

function getVisibleSpots() {
  const countryCode = localStorage.getItem(COUNTRY_STORAGE_KEY) || '';
  return BEST_SPOTS.filter(s => !s.countryOnly || s.countryOnly === countryCode);
}

function groupSpotsByRegion() {
  const grouped = {};
  for (const spot of getVisibleSpots()) {
    if (!grouped[spot.region]) grouped[spot.region] = [];
    grouped[spot.region].push(spot);
  }
  return Object.fromEntries(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)));
}

function renderBestSpotsList() {
  const bestSpotsList = document.getElementById('bestSpotsList');
  const grouped = groupSpotsByRegion();
  bestSpotsList.innerHTML = '';
  selectedSpots.clear();

  for (const [region, spots] of Object.entries(grouped)) {
    const regionHeader = document.createElement('div');
    regionHeader.style.cssText = 'font-weight: bold; color: #2c3e50; margin-top: 16px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #3498db;';
    regionHeader.textContent = region;
    bestSpotsList.appendChild(regionHeader);

    for (const spot of spots) {
      const spotDiv = document.createElement('div');
      spotDiv.style.cssText = 'display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer; transition: background 0.2s; margin-bottom: 4px;';
      spotDiv.onmouseenter = () => spotDiv.style.background = '#e3f2fd';
      spotDiv.onmouseleave = () => {
        spotDiv.style.background = selectedSpots.has(spot.name) ? '#c8e6c9' : '#f8f9fa';
      };

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'spot_' + spot.name.replace(/[^a-z0-9]/gi, '_');
      checkbox.style.cssText = 'margin-right: 12px; width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;';
      checkbox.checked = selectedSpots.has(spot.name);
      checkbox.onchange = () => {
        if (checkbox.checked) {
          selectedSpots.add(spot.name);
          spotDiv.style.background = '#c8e6c9';
        } else {
          selectedSpots.delete(spot.name);
          spotDiv.style.background = '#f8f9fa';
        }
        addSelectedSpotsBtn.disabled = selectedSpots.size === 0;
      };

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.style.cssText = 'cursor: pointer; flex: 1; display: flex; justify-content: space-between; align-items: center;';
      label.innerHTML = '<span style="font-weight: 600; color: #2c3e50;">' + spot.name + '</span>' +
        '<span style="color: #6c7a89; font-size: 0.85em;">' + spot.lat.toFixed(2) + ', ' + spot.lon.toFixed(2) + '</span>';

      spotDiv.appendChild(checkbox);
      spotDiv.appendChild(label);
      bestSpotsList.appendChild(spotDiv);

      if (selectedSpots.has(spot.name)) spotDiv.style.background = '#c8e6c9';
    }
  }

  addSelectedSpotsBtn.disabled = true;
}

addSelectedSpotsBtn.addEventListener('click', () => {
  if (selectedSpots.size === 0) return;

  const places = getPlaces();
  const folderName = 'Best World Spots';
  let addedCount = 0;

  for (const spotName of selectedSpots) {
    const spot = BEST_SPOTS.find(s => s.name === spotName);
    if (!spot) continue;

    const exists = places.some(p =>
      Math.abs(p.lat - spot.lat) < 0.01 && Math.abs(p.lon - spot.lon) < 0.01
    );

    if (!exists) {
      places.push({
        key: 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2),
        name: spot.name.slice(0, 28),
        lat: spot.lat,
        lon: spot.lon,
        sea: guessSeaForPoint(spot.lat, spot.lon),
        applyBonus: false,
        group: folderName
      });
      addedCount++;
    }
  }

  if (addedCount > 0) {
    savePlaces(places);
    reloadPlacesKeepSelection();
    buildFoldersUI();
    renderBestSpotsList();
  }
});

// Run on load - only seeds on first ever visit
detectAndSeedCountry();
