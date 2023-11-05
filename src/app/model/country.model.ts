export interface CountryData {
  type: string;
  objects: CountryObjects;
  arcs: number[][][];
  bbox: number[];
}

export interface CountryObjects {
  counties: CountryCounties;
}

export interface CountryCounties {
  type: string;
  geometries: CountryGeometry[];
}

export interface CountryGeometry {
  type: string;
  arcs: number[][][];
  id: string;
  properties: CountryProperties;
}

export interface CountryProperties {
  name: string;
  kmt: number;
  ddp: number;
  pfp: number;
  color: string;
  winner_2020: string;
  winning_rate_2020: number;
}
