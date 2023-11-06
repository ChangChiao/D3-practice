import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { DeviceDetectorService } from 'ngx-device-detector';
import { feature, mesh } from 'topojson-client';
import { HttpClient } from '@angular/common/http';
import { forkJoin, retry } from 'rxjs';
import {
  CountryData,
  TownData,
  TransferData,
  VillageData,
} from '../../model/index';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <svg class="map"></svg>
      <div id="collapse-content"></div>
      <div class="map-info-box">
        <h3 class="map-info-box__title">{{ infoSelected().name }}</h3>
        <ul class="map-info-box__list">
          <li>{{ infoSelected().ddp }}%</li>
          <li>{{ infoSelected().kmt }}%</li>
          <li>{{ infoSelected().pfp }}%</li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  #api = inject(HttpClient);
  #deviceDetectorService = inject(DeviceDetectorService);
  centerPoint = { x: 0, y: 0 };
  width = 700;
  height = 1000;
  initialScale = 1;
  isDesktopDevice = false;

  infoSelected = signal({
    name: '',
    ddp: 0,
    kmt: 0,
    pfp: 0,
  });

  isMobile = false;
  map = null;
  g = null;
  // path = null;
  toolTip = null;
  colorScale = null;
  renderData = null;
  zoom = null;

  x = 480;
  y = 480;

  townData: TransferData = null;
  villageData: TransferData = null;
  countryData: TransferData = null;

  path = d3.geoPath();
  // projection = d3.geoMercator().scale(this.initialScale).center([123, 24]);
  // path = d3.geoPath().projection(this.projection);
  constructor() {
    this.isDesktopDevice = this.#deviceDetectorService.isDesktop();
  }

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

  // zoomed(event) {
  //   console.log('event.transform', event.transform);
  //   this.g.attr('transform', event.transform);
  // }
  showInfo(data) {
    const { name, ddp, kmt, pfp } = data.properties;
    this.infoSelected.set({ name, ddp, kmt, pfp });
  }

  createCountry() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    console.log('this.xx', this.countryData);
    this.g
      .selectAll('.country')
      .data(this.countryData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', this.path)
      .style('fill', function (i) {
        return i.properties.color;
      })
      .on('click', function (event, data) {
        self.showInfo(data);
      })
      .on('mouseover', function (event, data) {
        d3.select(this).attr('opacity', 0.8);
        console.log('data', data);
        self.showInfo(data);
      })
      .on('mouseout', function () {
        // 鼠标移出时的事件处理
        d3.select(this).attr('opacity', 1);

        // 清空信息框
        d3.select('#info-box').text('');
      });

    this.g.attr('transform', 'translate(30,200)scale(0.8)');

    // this.map.attr(
    //   'transform',
    //   'translate(' +
    //     (this.centerPoint.x - 480 * ((this.height / 960) * 0.8)) +
    //     ',' +
    //     (this.centerPoint.y - 480 * ((this.height / 960) * 0.8)) +
    //     ')scale(' +
    //     (this.height / 960) * 0.8 +
    //     ')'
    // );
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
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.centerPoint = { x: this.width / 2, y: this.height / 2 };
    this.renderMap();
    this.fetchData().subscribe(([country, town, village]) => {
      // @ts-ignore
      this.countryData = feature(country, country.objects.counties);
      // @ts-ignore
      this.townData = feature(town, town.objects.town);
      // @ts-ignore
      this.villageData = feature(village, village.objects.tracts);

      this.createCountry();
      // console.log('country, town, village', country, town, village);
    });
  }

  createSVGg() {
    this.g = this.map.append('g');
  }

  renderMap() {
    this.map = d3
      .select('.map')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('svg');

    this.createSVGg();
    // this.initZoom();
    // this.map.call(this.zoom);
    // this.map.call(
    //   this.zoom.transform,
    //   d3.zoomIdentity.scale(0.8),
    //   d3.zoomIdentity.translate(0, 200)
    // );
  }

  async sleep(sec) {
    return new Promise<void>((resolve) => {
      return setTimeout(() => resolve(), sec);
    });
  }

  // initZoom() {
  //   this.zoom = d3
  //     .zoom()
  //     .scaleExtent([1, 8])
  //     .translateExtent([
  //       [0, 0],
  //       [this.width, this.height],
  //     ])
  //     .on('zoom', this.zoomed.bind(this));
  // }

  switchArea() {}

  selectArea() {}

  goPrevArea() {}
}
