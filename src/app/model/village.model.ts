export interface VillageData {
  type: string;
  bbox: number[];
  transform: VillageTransform;
  objects: VillageObjects;
  arcs: number[][][];
}

export interface VillageTransform {
  scale: number[];
  translate: number[];
}

export interface VillageObjects {
  tracts: VillageTracts;
  town: VillageTown;
  counties: VillageCounties;
}

export interface VillageTracts {
  type: string;
  geometries: VillageGeometry[];
}

export interface VillageGeometry {
  type: string;
  arcs: any[][];
  id: string;
  properties: VillageProperties;
}

export interface VillageProperties {
  name: string;
  kmt: number;
  ddp: number;
  pfp: number;
  color: string;
  winner_2020: string;
  winning_rate_2020: number;
}

export interface VillageTown {
  type: string;
  geometries: VillageGeometry2[];
}

export interface VillageGeometry2 {
  type: string;
  arcs: number[][][];
  id: string;
  properties?: VillageProperties2;
}

export interface VillageProperties2 {
  winner_2020?: string;
  color?: string;
  kmt?: number;
  ddp?: number;
  pfp?: number;
  winning_rate_2020?: number;
}

export interface VillageCounties {
  type: string;
  geometries: VillageGeometry3[];
}

export interface VillageGeometry3 {
  type: string;
  arcs: number[][][];
  id: string;
  properties?: VillageProperties3;
}

export interface VillageProperties3 {
  color?: string;
  winner_2020?: string;
}
