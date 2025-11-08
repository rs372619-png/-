import { NasaCategory } from './types';

export const MAP_LAYERS = {
  VINTAGE: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  SATELLITE: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  DARK: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

export const NASA_API_KEY = 'YtkeDL75bvnVS4jVnvU4fIL20i1L15lcSsddoM4N';

export const NASA_CATEGORIES: NasaCategory[] = [
  { id: 'wildfires', title: 'Wildfires' },
  { id: 'severeStorms', title: 'Severe Storms' },
  { id: 'volcanoes', title: 'Volcanoes' },
  { id: 'icebergs', title: 'Icebergs' }
];
