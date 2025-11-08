export interface EonetEvent {
  id: string;
  title: string;
  link: string;
  categories: { id: string; title: string }[];
  geometries: EonetGeometry[];
}

export interface EonetGeometry {
  date: string;
  type: 'Point' | 'Polygon';
  coordinates: [number, number] | [number, number][][];
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface NasaCategory {
  id: string;
  title: string;
}
