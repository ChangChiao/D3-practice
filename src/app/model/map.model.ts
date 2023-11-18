import { CountryGeometry } from './country.model';
import { TownGeometry } from './town.model';
import { VillageGeometry } from './village.model';
import * as d3Selection from 'd3-selection';

export type MapGeometryData = CountryGeometry | TownGeometry | VillageGeometry;

export type MapBounds = [[number, number], [number, number]];

export type D3Selection = d3Selection.Selection<
  d3Selection.BaseType,
  any,
  HTMLElement,
  any
>;
