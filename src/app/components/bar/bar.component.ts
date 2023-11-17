import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="chart">
      <div id="toolTip"></div>
    </div>
  `,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Input() filterResult;
  toolTip;
  maxValue: number = 100;
  svg;
  margin = 100;
  width = 750 - this.margin * 2;
  height = 600 - this.margin * 2;
  // width = 500;
  // height = 500;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  createSvg(): void {
    this.svg = d3
      .select('div#chart')
      .append('svg')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2}`
      )
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  transName() {
    const { type } = this.filterResult;
    if (type === 'taiwan') return 'countryName';
    if (type === 'country') return 'townName';
    if (type === 'town') return 'villageName';
    return 'countryName';
  }

  drawBars(data: any[]): void {
    const self = this;
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d[this.transName()]))
      .padding(0.5);

    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x).tickSize(5))
      .selectAll('text')
      .style('font-size', '14px');

    const y = d3
      .scaleLinear()
      .domain([0, this.maxValue])
      .range([this.height, 0]);

    this.svg
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .tickValues([0, 20, 40, 60, 80, 100])
          .tickSize(0)
          .tickPadding(10)
      )
      .selectAll('text')
      .style('font-size', '14px');

    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d[this.transName()]))
      .attr('y', (d) => y(d.winnerRate))
      .attr('width', x.bandwidth())
      .attr('height', (d) =>
        y(d.winnerRate) < this.height
          ? this.height - y(d.winnerRate)
          : this.height
      ) // this.height
      .attr('fill', (d) => (d.color ? 'green' : 'blue'))
      .on('mouseover', (event, d) => {
        // 在滑鼠移入時顯示 tooltip
        d3.select('#toolTip')
          .style('opacity', 1)
          .html('Value: ' + `${d[this.transName()]}:${d.winnerRate}`)
          .style('left', event.pageX + 30 + 'px')
          .style('top', event.pageY - 550 + 'px');
      })
      .on('mouseout', () => {
        // 在滑鼠移出時隱藏 tooltip
        d3.select('#toolTip').style('opacity', 0);
      });

    // this.svg
    //   .selectAll('text.bar')
    //   .data(data)
    //   .enter()
    //   .append('text')
    //   .attr('text-anchor', 'middle')
    //   .attr('fill', '#70747a')
    //   .attr('x', (d) => x(d.name) + 18)
    //   .attr('y', (d) => y(d.value) - 5)
    //   .text((d) => Math.round(d.value * 100) / 100);
  }
}
