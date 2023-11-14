import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { DeviceDetectorService } from 'ngx-device-detector';
import { feature } from 'topojson-client';
import { HttpClient } from '@angular/common/http';
import { finalize, forkJoin, skip, tap } from 'rxjs';
import {
  CountryData,
  TownData,
  TransferData,
  VillageData,
} from '../../model/index';
import { AppService } from '../../service/app.service';
import { AppComponentStore } from '../../store/app.state';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, LetDirective],
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
      <button *ngIf="isPrevShow" (click)="goBackArea()" class="map-back">
        go Back
      </button>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  @Input() voteData;
  @Input() selectedOption;
  #api = inject(HttpClient);
  #service = inject(AppService);
  #store = inject(AppComponentStore);
  #deviceDetectorService = inject(DeviceDetectorService);
  #destroyRef = inject(DestroyRef);
  selectedData = signal({});

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

  isPrevShow = false;

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
    console.log('testing===');
    this.isDesktopDevice = this.#deviceDetectorService.isDesktop();
  }

  collapse = d3.select('#collapse-content').style('opacity', 1);

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
      .classed('country', true)
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
        d3.select(this).attr('opacity', 1);
      });

    const [{ x, y }] = this.translateRecord;
    const [scale] = this.scaleRecord;
    this.g.attr('transform', `translate(${x},${y})scale(${scale})`);
  }

  createTown(data) {
    const self = this;
    const countryTowns = this.townData.features.filter(
      (item) => item.id.slice(0, 5) == data.id
    );
    const townPaths = this.g
      .selectAll('.town')
      .data(countryTowns, (item) => item.id)
      .enter()
      .append('path')
      .classed('town', true)
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
      .on('mouseover', function (event, data) {
        d3.select(this).attr('opacity', 0.8);
        self.showInfo(data);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });

    return { townPaths };
  }

  createVillage(data) {
    const self = this;
    const villages = this.villageData.features.filter(
      (i) => i.id.slice(0, 7) == data.id
    );
    console.log('townVillages', villages);
    const villagePaths = this.g
      .selectAll('.village')
      .data(villages)
      .enter()
      .append('path')
      .classed('village', true)
      .attr('d', this.path)
      .style('stroke-width', this.normalLineWidth)
      .style('stroke', this.normalLineColor)
      .style('fill', function (i) {
        return i.properties.color;
      })
      .on('mouseover', function (event, data) {
        d3.select(this).attr('opacity', 0.8);
        self.showInfo(data);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });
    return { villagePaths };
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

  clearArea(type) {
    this.g
      .selectAll(`.${type}`)
      .data([])
      .exit()
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();
  }

  // getCountryData() {
  //   return this.#api.get<CountryData>('/assets/data/country-data.json');
  // }

  // getVillageData() {
  //   return this.#api.get<VillageData>('/assets/data/village-data.json');
  // }

  // getTownData() {
  //   return this.#api.get<TownData>('/assets/data/town-data.json');
  // }

  // fetchData() {
  //   this.#store.setLoading(true);
  //   return forkJoin([
  //     this.getCountryData(),
  //     this.getTownData(),
  //     this.getVillageData(),
  //   ]).pipe(
  //     takeUntilDestroyed(this.#destroyRef),
  //     finalize(() => this.#store.setLoading(true))
  //   );
  // }

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
    console.log('init');
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.centerPoint = { x: this.width / 2, y: this.height / 2 };
    this.renderMap();
    this.#store.vm$
      .pipe(
        tap(({ voteData, selectedOption }) => {
          console.log('voteData', voteData);
          if (!voteData.country) return;
          const { country, town, village } = voteData;
          // @ts-ignore
          this.countryData = feature(country, country.objects.counties);
          // @ts-ignore
          this.townData = feature(town, town.objects.town);
          // @ts-ignore
          this.villageData = feature(village, village.objects.tracts);

          this.createCountry();
        })
      )
      .subscribe();
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
    let scale = 0;
    let x = 0;
    let y = 0;
    if (this.translateRecord.length > 1) {
      this.clearArea('village');
      const tempScale = this.scaleRecord.pop();
      const tempTranslate = this.translateRecord.pop();
      scale = tempScale;
      x = tempTranslate.x;
      y = tempTranslate.y;
      this.clearBoundary();
    } else {
      this.clearArea('town');
      const [targetScale] = this.scaleRecord;
      const [targetTranslate] = this.translateRecord;
      scale = targetScale;
      x = targetTranslate.x;
      y = targetTranslate.y;
      this.isPrevShow = false;
    }
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
    switch (type) {
      case 'country': {
        const bounds = this.path.bounds(data);
        this.toTown(data);
        this.zoom(bounds);
        break;
      }
      case 'town': {
        const bounds = this.path.bounds(data);
        this.toVillage(data);
        this.zoom(bounds);
        break;
      }
      default:
        break;
    }
  }

  toTown(data) {
    const { townPaths } = this.createTown(data);
    this.toOtherArea(townPaths);
  }

  toVillage(data) {
    const { villagePaths } = this.createVillage(data);
    this.toOtherArea(villagePaths);
  }

  toOtherArea(toPath) {
    this.isPrevShow = true;
    toPath
      .style('opacity', 0)
      .transition()
      .delay(100)
      .duration(500)
      .style('opacity', 1);
  }

  calcDistance(bounds) {
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    return { dx, dy, x, y };
  }

  zoom(bounds) {
    const { dx, dy, x, y } = this.calcDistance(bounds);
    this.x = x;
    this.y = y;
    this.scale = 0.7 / Math.max(dx / this.width, dy / this.height);
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
      this.scaleRecord.push(this.scale);
    }
  }
}
