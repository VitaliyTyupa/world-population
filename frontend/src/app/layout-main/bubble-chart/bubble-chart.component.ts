import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {CountriesDataService, Country} from '../../shared/core-services/countries-data.service';

@Component({
  selector: 'wp-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit {

  private data: Array<Country> = [];

  constructor(
    private countriesDataService: CountriesDataService
  ) {
  }

  private initNodes(data) {
    return data.length;
  }


  ngOnInit() {
    this.countriesDataService.$countries.subscribe(countries => {
      this.data.length = 0;
      this.data.push(...countries);
      d3.select('svg').selectAll('circle').remove();
      this.drawChart(this.data, this.countriesDataService.regions);
    });

  }

  private initCluster(region) {
    switch (region) {
      case 'Asia':
        return 1;
      case 'Europe':
        return 2;
      case 'Africa':
        return 3;
      case 'Oceania':
        return 4;
      case 'Americas':
        return 5;
      case 'Polar':
        return 6;
      case '':
        return 7;
    }
  }

  private drawChart(data, regions) {
    const width = 1500;
    const height = 900;
    const padding = 1.5; // separation between same-color nodes
    const clusterPadding = 6; // separation between different-color nodes
    const maxRadius = 12;

    const n = data.length; // total number of nodes
    const m = regions.length; // number of distinct clusters

    const color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(d3.range(m));

    // The largest node for each cluster.
    const clusters = new Array(m);

    const nodes = d3.range(n).map((index) => {
      const i = this.initCluster(data[index].region);
      const r = data[index].population / 10000000;
      const d = {cluster: i, radius: r};
      if (!clusters[i] || (r > clusters[i].radius)) { clusters[i] = d; }
      return d;
    });

    const root = d3.hierarchy({
      values: d3.nest()
        .key((d) => d.cluster)
        .entries(nodes)
    }, (d) => d.values)
      .sum((d) => d.radius * d.radius);

    // Use the pack layout to initialize node positions.
    d3.pack(root)
      .size([width, height]);

    const force = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter().x(width / 2).y(height / 2))
      .force('collide', d3.forceCollide().radius(d => d.radius + 10))
      .on('tick', tick);

    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height);

    const node = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .style('fill', (d) => color(d.cluster))
      .on('mouseenter', (country) => {
        const i = country.index;
        console.log(data[i].name);
      })
    ;
    //     .call(force.drag);

    node.transition()
      .duration(750)
      .delay((d, i) => i * 5)
      .attrTween('r', (d) => {
        const i = d3.interpolate(0, d.radius);
        return (t) => d.radius = i(t);
      });

    function tick() {
      node
        .each(cluster(.2))
        .each(collide(.5))
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return (d) => {
        const cluster = clusters[d.cluster];
        if (cluster === d) { return; }
        let x = d.x - cluster.x;
        let y = d.y - cluster.y;
        let l = Math.sqrt(x * x + y * y);
        const r = d.radius + cluster.radius;
        if (l !== r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      const quadtree = d3.quadtree()
        .x((d) => d.x)
        .y((d) => d.y)
        .extent([[0, 0], [width, height]])
        .addAll(nodes);

      return (d) => {
        const r = d.radius + maxRadius + Math.max(padding, clusterPadding);
        const nx1 = d.x - r;
        const nx2 = d.x + r;
        const ny1 = d.y - r;
        const ny2 = d.y + r;
        quadtree.visit((quad, x1, y1, x2, y2) => {
          if (quad.point && (quad.point !== d)) {
            let x = d.x - quad.point.x;
            let y = d.y - quad.point.y;
            let l = Math.sqrt(x * x + y * y);
            const r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    // function called once promise is resolved and data is loaded from csv
    // calls bubble chart function to display inside #vis div
    function initData(data) {
      const newData = data.map(item => {
        return {name: item.name, population: item.population, region: item.region};
      });
      console.log(newData);
    }
  }
}
