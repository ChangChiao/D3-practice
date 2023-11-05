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
  #taiwanCountry = [];
  map = null;
  path = null;
  toolTip = null;

  lastScale = 0;
  centerX = 0;
  centerY = 0;
  lastCenterX = 0;
  lastCenterY = 0;

  countryColors = [];

  projection = geoMercator().scale(this.initialScale).center([123, 24]);

  // zoom = d3
  //   .zoom()
  //   .scaleExtent([1, 8])
  //   .on('zoom', (event: any) => {
  //     const features = d3.selectAll('.country');
  //     const t = event.transform;

  //     const scale = t.k * this.initialScale;
  //     const centerY = t.y;
  //     const centerX = t.x;
  //     let updated = false;

  //     if (scale !== this.lastScale) {
  //       this.projection.scale(scale);
  //       this.lastScale = scale;
  //       updated = true;
  //     }
  //     if (centerX !== this.lastCenterX || centerY !== this.lastCenterY) {
  //       // this.projection.center([centerY, centerX]);
  //       updated = true;
  //       console.log(this.projection.scale(), scale, t.k, t.y);
  //     }

  //     if (updated) {
  //       const path = d3.geoPath().projection(this.projection);
  //       features.attr('d', path);
  //     }
  //   });

  draw() {
    this.path = this.map.geoPath().projection(this.projection);

    this.map
      .selectAll('path')
      .data(renderData)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('stroke', '#3f2ab2')
      .attr('stroke-width', '0.7');
    // .attr("fill", (d) => colorScale(d.revenue) || "#d6d6d6")
    // .on("mouseover", function (d) {
    //   const target = d3.select(this).data()[0];
    //   const rev = target.revenue ?? 0;
    //   this.toolTip
    //     .style("visibility", "visible")
    //     .text(`${target.properties.COUNTYNAME},${rev}`);
    // })
    // .on("mouseleave", function () {
    //   this.toolTip.style("visibility", "hidden");
    // });
  }

  async getMapData() {
    return this.#api.get('../../data/map-data.json').subscribe((res) => res);
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
    this.draw();
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
    this.map.call(this.zoom);
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
