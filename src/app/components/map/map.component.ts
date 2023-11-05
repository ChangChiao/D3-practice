import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { geoMercator } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { HttpClient } from '@angular/common/http';
import { forkJoin, retry } from 'rxjs';
import { CountryData, TownData, VillageData } from '../../model/index';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #chartContainer class="chart-container">
      <svg class="map"></svg>
      <div id="collapse-content"></div>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  state!: { worlddata: any; neighbors: any };
  #api = inject(HttpClient);
  centerPoint = { x: 0, y: 0 };
  width = 2000;
  height = 1000;
  initialScale = 5000;

  isMobile = false;
  map = null;
  // path = null;
  toolTip = null;
  colorScale = null;
  renderData = null;

  x = 480;
  y = 480;

  townData = {};
  villageData = {};
  countryData = {};

  path = d3.geoPath();
  projection = geoMercator().scale(this.initialScale).center([123, 24]);

  collapse = d3.select('#collapse-content').style('opacity', 1);
  dragContainer = d3
    .drag()
    .on('start', () => {
      this.collapse.transition().duration(400).style('opacity', 1);
    })
    .on('drag', (d, i) => {
      // this.x = this.x || 0;
      // this.y = this.y || 0;
      // this.x += d3.event.dx;
      // this.y += d3.event.dy;
      // const k = height / vWidth;
      // d3.select(this).attr(
      //   'transform',
      //   `translate(${this.centerPoint.x},${
      //     this.centerPoint.y
      //   })scale(${k})translate(${-x},${-y})translate(${this.x / k},${
      //     this.y / k
      //   })`
      // );
    });

  drawCountry() {
    console.log('this.xx', this.countryData);
    this.map
      .append('g')
      .selectAll('.county')
      .data(this.countryData)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', this.path)
      .style('fill', function (i) {
        return i.properties.color;
      });

    this.map.attr(
      'transform',
      'translate(' +
        (this.centerPoint.x - 480 * ((this.height / 960) * 0.8)) +
        ',' +
        (this.centerPoint.y - 480 * ((this.height / 960) * 0.8)) +
        ')scale(' +
        (this.height / 960) * 0.8 +
        ')'
    );

    // .on("click", clicked)
    // .on("mouseover", enterCounty);

    // this.map
    //   .selectAll('path')
    //   .data(this.renderData)
    //   .enter()
    //   .append('path')
    //   .attr('d', this.path)
    //   .attr('stroke', '#3f2ab2')
    //   .attr('stroke-width', '0.7');
  }

  getCountryData() {
    return this.#api.get<CountryData>('/assets/data/country-data.json');
  }

  getVillageData() {
    return this.#api.get<VillageData>('/assets/data/village-data.json');
  }

  getTownData() {
    return this.#api.get<TownData>('/assets/data/town-data.json');
  }

  fetchData() {
    return forkJoin([
      this.getCountryData(),
      this.getTownData(),
      this.getVillageData(),
    ]);
  }

  setToolTip() {
    this.toolTip = d3
      .select('.map')
      .append('text')
      .attr('class', 'tip')
      .attr('font-size', '20px')
      .attr('fill', '#f3dc71')
      .attr('x', '400')
      .attr('y', '350');
  }

  ngAfterViewInit() {
    type dataInterdace = [];
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.centerPoint = { x: this.width / 2, y: this.height / 2 };
    this.renderMap();
    this.fetchData().subscribe(([country, town, village]) => {
      this.countryData = feature(country, country.objects.tracts);
      this.townData = town;
      this.villageData = village;
      // this.registerG();
      this.drawCountry();
      // console.log('country, town, village', country, town, village);
    });
    // this.state.worlddata.features.forEach((country: any, index: number) => {
    //   this.countryColors.push(
    //     `rgba(30,80,100,${
    //       ((1 / this.state.worlddata.features.length) * index) / 2 + 0.5
    //     })`
    //   );
    // });

    // this.renderMap();
  }

  registerG() {
    return this.map.append('g').call(this.dragContainer);
  }

  renderMap() {
    this.map = d3
      .select('.map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('position', 'absolute')
      .style('top', '0px')
      .style('left', '0px');
  }

  switchArea() {}

  selectArea() {}
}
