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
  template: `<div id="chart"></div>`,
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnInit, AfterViewInit {
  @Input() data;
  maxValue: number;
  svg;
  margin = 100;
  width = 750 - this.margin * 2;
  height = 600 - this.margin * 2;

  ngOnInit(): void {
    this.findHighest();
  }

  findHighest() {
    const dataCollect = this.data.reduce((prev, cur) => {
      return [...prev, cur.ddp, cur.kmt, cur.pfp];
    }, []);
    this.maxValue = Math.max(...dataCollect);
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  private createSvg(): void {
    this.svg = this.d3.d3
      .select('div#chart')
      .append('svg')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2}`
      )

      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: any[]): void {
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.name))
      .padding(0.2);

    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '14px');

    const y = d3
      .scaleLinear()
      .domain([0, Number(this.maxValue) + 50])
      .range([this.height, 0]);

    this.svg
      .append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '14px');

    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) =>
        y(d.value) < this.height ? this.height - y(d.value) : this.height
      ) // this.height
      .attr('fill', (d) => d.color);

    this.svg
      .selectAll('text.bar')
      .data(data)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#70747a')
      .attr('x', (d) => x(d.name) + 18)
      .attr('y', (d) => y(d.value) - 5)
      .text((d) => Math.round(d.value * 100) / 100);
  }
}
