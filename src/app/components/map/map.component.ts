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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #chartContainer class="chart-container">
      <svg class="map"></svg>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  state!: { worlddata: any; neighbors: any };
  #api = inject(HttpClient);
  width = 1000;
  height = 600;
  initialScale = 5000;
  map = null;
  path = null;
  toolTip = null;
  colorScale = null;
  renderData = null;

  lastScale = 0;
  centerX = 0;
  centerY = 0;
  lastCenterX = 0;
  lastCenterY = 0;

  countryColors = [];

  projection = geoMercator().scale(this.initialScale).center([123, 24]);

  draw() {
    this.path = d3.geoPath(this.projection);

    this.map
      .selectAll('path')
      .data(this.renderData)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('stroke', '#3f2ab2')
      .attr('stroke-width', '0.7');
    // .attr("fill", (d) => colorScale(d.vote) || "#d6d6d6")
    // .on("mouseover", function (d) {
    //   const target = d3.select(this).data()[0];
    //   const rev = target.vote ?? 0;
    //   this.toolTip
    //     .style("visibility", "visible")
    //     .text(`${target.properties.COUNTYNAME},${rev}`);
    // })
    // .on("mouseleave", function () {
    //   this.toolTip.style("visibility", "hidden");
    // });
  }

  getMapData() {
    return this.#api.get('/assets/data/map-data.json');
  }

  getVoteData() {
    return this.#api.get('/assets/data/vote-data.json');
  }

  toNumber(str) {
    return parseFloat(str.replace(/,/g, ''));
  }

  combineData = (map, revenue) => {
    const { data } = revenue[0];
    for (const vo of map) {
      const { COUNTYNAME } = vo.properties;
      const target = data.find((ele) => ele.city === COUNTYNAME);
      // console.log("target", target)
      if (target) {
        vo.revenue = this.toNumber(target.revenue);
      }
    }
  };

  fetchData() {
    forkJoin([this.getMapData(), this.getVoteData()]).subscribe(
      ([map, vote]) => {
        this.renderData = feature(
          //@ts-ignore
          map,
          //@ts-ignore
          map.objects['COUNTY_MOI_1090820']
          //@ts-ignore
        ).features;
        this.combineData(this.renderData, vote);
        const voteData = vote[0].data;
        //顏色範圍
        this.colorScale = d3
          .scaleLinear()
          .domain([
            //@ts-ignore
            d3.min(voteData, (d) => this.toNumber(d.revenue)),
            //@ts-ignore
            d3.max(voteData, (d) => this.toNumber(d.revenue)),
          ])
          //@ts-ignore
          .range([
            '#bcafb0', // <= the lightest shade we want
            '#ec595c', // <= the darkest shade we want
          ]);
        this.draw();
      }
    );
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
    this.renderMap();
    this.fetchData();
    // this.state.worlddata.features.forEach((country: any, index: number) => {
    //   this.countryColors.push(
    //     `rgba(30,80,100,${
    //       ((1 / this.state.worlddata.features.length) * index) / 2 + 0.5
    //     })`
    //   );
    // });

    // this.renderMap();
  }

  renderMap() {
    this.map = d3.select('.map');

    this.map.attr('width', this.width).attr('height', this.height).append('g');
    // this.map.call(this.zoom);
    // this.redraw();
  }

  // redraw() {
  //   const svg = d3.select('#mapCanvas');
  //   const path = d3.geoPath().projection(this.projection);

  //   svg
  //     .selectAll('path.country')
  //     .data(this.state.worlddata.features)
  //     .enter()
  //     .append('path')
  //     .attr('d', path)
  //     .attr('class', 'country')
  //     .attr('fill', (d: any, index: number) => {
  //       return this.countryColors[index];
  //     })
  //     .attr('stroke', '#ffffff')
  //     .attr('stroke-width', 0.2)
  //     .on('mouseover', (event: MouseEvent, d: any) => {
  //       this.hoverHandler(event);
  //     })
  //     .on('mouseout', (event: MouseEvent, d: any) => {
  //       this.hoverHandler(event, d);
  //     });
  // }

  // hoverHandler(event: MouseEvent, d?: any) {
  //   const node = d3.select(event.currentTarget as unknown as string);
  //   if (d) {
  //     node.attr(
  //       'fill',
  //       this.countryColors[this.state.worlddata.features.indexOf(d)]
  //     );
  //   } else {
  //     node.attr('fill', 'rgba(255, 255, 0, 0.25)');
  //   }
  // }
}
