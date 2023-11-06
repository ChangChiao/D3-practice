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
      <button (click)="goBackArea()" class="map-back">go Back</button>
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

  scaleRecord = [0.8];
  translateRecord = [{ x: 30, y: 200 }];

  isMobile = false;
  map = null;
  g = null;
  // path = null;
  toolTip = null;
  colorScale = null;
  renderData = null;
  // zoom = null;
  clickedTarget = null;

  activeLineColor = 'orange';
  normalLineColor = 'black';
  activeLineWidth = 0.3;
  normalLineWidth = 0.1;

  x = 480;
  y = 480;
  scale = 900;

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
      // const k = height / scale;
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
    const self = this;
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
        self.clearBoundary();
        self.clickedTarget = d3.select(this);
        self.drawBoundary();

        self.showInfo(data);
        self.switchArea(data);
      })
      .on('mouseover', function (event, data) {
        d3.select(this).attr('opacity', 0.8);
        self.showInfo(data);
      })
      .on('mouseout', function () {
        // 鼠标移出时的事件处理
        d3.select(this).attr('opacity', 1);

        // 清空信息框
        d3.select('#info-box').text('');
      });

    const [{ x, y }] = this.translateRecord;
    const [scale] = this.scaleRecord;
    this.g.attr('transform', `translate(${x},${y})scale(${scale})`);

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

  createTown(data) {
    const self = this;
    const countyTowns = this.townData.features.filter(
      (item) => item.id.slice(0, 5) == data.id
    );
    console.log('countyTowns', countyTowns);
    const townPaths = this.g
      .selectAll('.town')
      .data(countyTowns, (item) => item.id);
    const enterTownPaths = townPaths
      .enter()
      .append('path')
      .attr('class', 'town')
      .attr('d', this.path)
      .style('opacity', 0)
      .style('stroke-width', this.normalLineWidth)
      .style('stroke', this.normalLineColor)
      .style('fill', function (i) {
        return i.properties.color;
      })
      .on('click', function (event, data) {
        self.clearBoundary();
        self.clickedTarget = d3.select(this);
        self.drawBoundary();
        self.switchArea(data);
      })
      .on('mouseover', (event, data) => this.showInfo(data));

    return { townPaths, enterTownPaths };
  }

  createVillage(data) {
    const townVillages = this.villageData.features.filter(
      (i) => i.id.slice(0, 7) == data.id
    );
    console.log('townVillages', townVillages);
    const villagePaths = this.g.selectAll('.village').data(townVillages);
    const enterVillagePaths = villagePaths
      .enter()
      .append('path')
      .attr('class', 'village')
      .attr('d', this.path)
      .style('stroke-width', this.normalLineWidth)
      .style('stroke', this.normalLineColor)
      .style('fill', function (i) {
        return i.properties.color;
      })
      .on('mouseover', (event, data) => this.showInfo(data));
    return { villagePaths, enterVillagePaths };
  }

  drawBoundary() {
    if (!this.clickedTarget) return;
    this.clickedTarget.style('stroke-width', this.activeLineWidth);
    this.clickedTarget.style('stroke', this.activeLineColor);
    this.clickedTarget.raise();
  }

  clearBoundary() {
    if (!this.clickedTarget) return;
    this.clickedTarget.style('stroke-width', this.normalLineWidth);
    this.clickedTarget.style('stroke', this.normalLineColor);
    this.clickedTarget.lower();
  }

  removeLine(type) {
    this.g
      .selectAll(`.${type}`)
      .data([])
      .exit()
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();
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

  getDataType(num) {
    if (num === 5) {
      return 'country';
    }
    if (num === 7) {
      return 'town';
    }

    return 'village';
  }

  goBackArea() {
    console.log('goBackArea');
    console.log('scale', this.scaleRecord);
    console.log('trans', this.translateRecord);
    if (this.translateRecord.length === 2) {
      this.removeLine('village');
    } else {
      this.removeLine('town');
    }

    const scale = this.scaleRecord.pop();
    const { x, y } = this.translateRecord.pop();
    this.g
      .transition()
      .duration(500)
      .attr('transform', `translate(${x},${y})scale(${scale})`);
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

  switchArea(data) {
    const type = this.getDataType(data.id?.length);
    console.log('type', type);
    console.log('data.id', data.id);

    switch (type) {
      case 'country': {
        const bounds = this.path.bounds(data);
        this.toTown(data);
        this.zoom(bounds, null, 'country');
        break;
      }
      case 'town': {
        const bounds = this.path.bounds(data);
        this.toVillage(data);
        this.zoom(bounds, null, 'town');
        break;
      }
      case 'village':
        break;
    }
  }

  toTown(data) {
    const { townPaths, enterTownPaths } = this.createTown(data);
    // const countyTowns = this.townData.features.filter(
    //   (item) => item.id.slice(0, 5) == data.id
    // );
    // console.log('countyTowns', countyTowns);
    // const townPaths = this.g
    //   .selectAll('.town')
    //   .data(countyTowns, (item) => item.id);
    // const enterTownPaths = townPaths
    //   .enter()
    //   .append('path')
    //   .attr('class', 'town')
    //   .attr('d', this.path)
    //   .style('opacity', 0)
    //   .on('click', this.switchArea)
    //   .style('fill', function (i) {
    //     return i.properties.color;
    //   })
    //   .on('mouseover', (event, data) => this.showInfo(data));
    this.toOtherArea('county', townPaths, enterTownPaths);
  }

  toVillage(data) {
    const { villagePaths, enterVillagePaths } = this.createVillage(data);
    // const townVillages = this.villageData.features.filter(
    //   (i) => i.id.slice(0, 7) == data.id
    // );
    // const villagePaths = this.g.selectAll('.village').data(townVillages);
    // const enterVillagePaths = enterVillage(villagePaths);
    this.toOtherArea('town', villagePaths, enterVillagePaths);
  }

  toOtherArea(areaType, fromPath, toPath) {
    fromPath.exit().transition().duration(500).style('opacity', 0).remove();
    toPath
      .style('opacity', 0)
      .transition()
      .delay(100)
      .duration(500)
      .style('opacity', 1);
    if (areaType === 'county') {
      this.map
        .selectAll('.village')
        .data([])
        .exit()
        .transition()
        .duration(100)
        .style('opacity', 0)
        .remove();
    }
    // this.map
    //   .selectAll('.active')
    //   .style('stroke-width', strokeWidth)
    //   .style('stroke', '#ffcc00');
    // this.map.selectAll('.' + areaType).sort(function (a, b) {
    //   if (a.id != d.id) return -1;
    //   return 1;
    // });
  }

  calcDistance(bounds) {
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    return { dx, dy, x, y };
  }

  zoom(bounds, bounds2, type) {
    const { dx, dy, x, y } = this.calcDistance(bounds);
    this.x = x;
    this.y = y;
    this.scale = 0.9 / Math.max(dx / this.width, dy / this.height);
    // if (type == 'country') {
    //   this.scale = 0.9 / Math.max(dx / this.width, dy / this.height);
    // } else if (type == 'town') {
    //   if (this.isDesktopDevice) {
    //     this.scale = Math.max(dy, dx);
    //   } else {
    //     this.scale = Math.max(dx, dy) * 2;
    //   }
    // } else {
    //   const { dx, dy } = this.calcDistance(bounds2);
    //   if (this.isDesktopDevice) {
    //     this.scale = Math.max(dy, dx) * 2;
    //   } else {
    //     this.scale = Math.max(dy, dx);
    //   }
    // }

    const translate = {
      x: this.width / 2 - this.scale * x,
      y: this.height / 2 - this.scale * y,
    };
    this.g
      .transition()
      .duration(500)
      .attr(
        'transform',
        `translate(${translate.x},${translate.y})scale(${this.scale})`
      );
    if (this.translateRecord.length < 2) {
      this.translateRecord.push(translate);
    }
    if (this.scaleRecord.length < 2) {
      this.scaleRecord.push(this.scale);
    }
    //@ts-ignore
    // const fn = d3.interpolateZoom(fromObj, toObj);
    // this.g
    //   .transition()
    //   .duration(500)
    //   .attrTween('transform', function () {
    //     return function (t) {
    //       return self.transform(fn(t));
    //     };
    //   });
  }

  // transform(p) {
  //   console.log('p', p);
  //   const k = (this.height / p[2]) * 0.8;
  //   return `translate(${this.centerPoint[0] - p[0] * k}, ${
  //     this.centerPoint[1] - p[1] * k
  //   }) scale(${k})`;
  // }

  goPrevArea() {}
}
