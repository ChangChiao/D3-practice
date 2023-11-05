export interface TownData {
  type: string;
  objects: TownObjects;
  arcs: number[][][];
  bbox: number[];
}

export interface TownObjects {
  town: Town;
}

export interface Town {
  type: string;
  geometries: TownGeometry[];
}

export interface TownGeometry {
  type: string;
  arcs: number[][][];
  id: string;
  properties: TownProperties;
}

export interface TownProperties {
  name: string;
  kmt: number;
  ddp: number;
  pfp: number;
  color: string;
  winner_2020: string;
  winning_rate_2020: number;
}
