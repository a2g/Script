import { Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import { create } from 'xmlbuilder2';
import { Suffix } from './../../Suffix';
import { Graph } from '../location/Graph';
import { Point } from '../location/Point';

declare interface $Square {
  col: string;
  row: string;
  location: string;
}
declare interface $Connection {
  start: string;
  end: string;
  access: string;
}

const DELAY = 1;

export class SvgWriter {
  public static writeSvg(
    repo: string,
    world: string,
    area: string,
    paramA: string,
    paramB: string,
    responseSender: Response
  ): void {
    const path = `../${repo}/${world}/`;
    const areaMapFilename = `${area}${Suffix.AreaMap}.jsonc`;
    const connectionsFilename = `${area}${Suffix.Connections}.jsonc`;
    if (!existsSync(path + areaMapFilename)) {
      console.log(
        `file doesn't exist ${path}${areaMapFilename} ${process.cwd()}`
      );
      return;
    }
    const text = readFileSync(path + areaMapFilename, 'utf8');
    const areaMap = JSON.parse(text);

    let maxCol = 1;
    let maxRow = 1;
    if (Array.isArray(areaMap.squares)) {
      const squares = areaMap.squares as $Square[];
      for (const square of squares) {
        const colAsString = square.col;
        const col = colAsString.length > 0 ? colAsString.charCodeAt(0) - 65 : 0;
        if (col > maxCol) {
          maxCol = col;
        }
        const row = parseInt(square.row);
        if (row > maxRow) {
          maxRow = row;
        }
      }

      const length = 1000;
      const height = 500;
      const squareSizeX = Math.floor(length / (maxCol + 1));
      const squareSizeY = Math.floor(height / (maxRow + 1));
      const squareSize = Math.min(squareSizeX, squareSizeY);
      const svgNs = 'http://www.w3.org/2000/svg';

      const svgDoc = create({
        defaultNamespace: { ele: svgNs, att: null },
      });

      // all svg elements below will be created in the 'http://www.w3.org/2000/svg' namespace
      // all attributes will be created with the null namespace
      let lastNode = svgDoc
        .ele('svg')
        .att('viewBox', `0 0 ${length} ${height}`);

      const centres = new Map<string, Point>();
      for (const square of squares) {
        const colAsString = square.col;
        const col = colAsString.length > 0 ? colAsString.charCodeAt(0) - 65 : 0;
        const row = parseInt(square.row);

        const k = squareSize * 0.5;
        const x = k + col * squareSize;
        const y = row * squareSize;
        const point = new Point(x + k, y + k);
        centres.set(square.location, point);

        lastNode = lastNode
          .ele('rect')
          .att({
            x: x,
            y: y,
            width: squareSize,
            height: squareSize,
            fill: 'none',
            stroke: '#f00',
          })
          .up();
        // we need to go up, otherwise any subsequent
        // lastNode will be
      }

      const connectionsPath = path + connectionsFilename;

      // connections are optional - but need for animations
      if (existsSync(connectionsPath)) {
        const text = readFileSync(connectionsPath, 'utf8');
        const json = JSON.parse(text);

        if (Array.isArray(json.connections)) {
          const connections = json.connections as $Connection[];
          for (const connection of connections) {
            if (centres.has(connection.start) && centres.has(connection.end)) {
              const p1 = centres.get(connection.start);
              const p2 = centres.get(connection.end);

              if (p1 && p2) {
                lastNode = lastNode
                  .ele('line')
                  .att({
                    x1: p1.getX(),
                    y1: p1.getY(),
                    x2: p2.getX(),
                    y2: p2.getY(),
                    fill: 'none',
                    stroke: '#f00',
                  })
                  .up();
              }
            }
          }

          const graph = new Graph();

          for (const point of centres.values()) {
            graph.addPoint(point);
          }
          for (const connection of connections) {
            const a = centres.get(connection.start);
            const b = centres.get(connection.end);
            if (a != null && b != null) {
              graph.addEdge(a, b, 8);
            }
          }
          const props = new Map<string, string>(Object.entries(areaMap.props));

          if (areaMap.props != null && Boolean(props)) {
            const locationA =
              paramA.length > 0 ? props.get(paramA) : areaMap.startingLocation;

            const locationB =
              paramB.length > 0 ? props.get(paramB) : areaMap.startingLocation;

            if (locationA != null && locationB != null) {
              const start = centres.get(locationA);
              const end = centres.get(locationB);
              if (start != null && end != null) {
                const solution = graph.findShortestPath(start, end);
                for (let i = 0; i < solution.path.length; i++) {
                  const a = solution.path[i];
                  if (i < solution.path.length - 1) {
                    const b = solution.path[i + 1];
                    lastNode
                      .ele('circle')
                      .att({
                        opacity: 0,
                        cx: 50,
                        cy: 500,
                        r: 15,
                        fill: 'blue',
                        stroke: 'cyan',
                      })
                      .ele('animate')
                      .att({
                        attributeName: 'opacity',
                        begin: `${i * DELAY}s`,
                        dur: `${DELAY}s`,
                        fill: 'remove',
                        from: '100',
                        to: '100',
                        repeatCount: '0',
                      })
                      .up()
                      .ele('animate')
                      .att({
                        attributeName: 'cx',
                        begin: `${i * DELAY}s`,
                        dur: `${DELAY}s`,
                        fill: 'remove',
                        from: a.getX(),
                        to: b.getX(),
                        repeatCount: '0',
                      })
                      .up()

                      .ele('animate')
                      .att({
                        attributeName: 'cy',
                        begin: `${i * DELAY}s`,
                        dur: `${DELAY}s`,
                        fill: 'remove',
                        from: a.getY(),
                        to: b.getY(),
                        repeatCount: '0',
                      })
                      .up()
                      .up();
                  } else {
                    lastNode
                      .ele('circle')
                      .att({
                        opacity: 0,
                        cx: a.getX(),
                        cy: a.getY(),
                        r: 15,
                        fill: 'blue',
                        stroke: 'cyan',
                      })
                      .ele('animate')
                      .att({
                        attributeName: 'opacity',
                        begin: `${i * DELAY}s`,
                        dur: `2h`,
                        fill: 'remove',
                        from: 1,
                        to: 1,
                        repeatCount: '0',
                      });
                  }
                }
              }
            }
          }
        }
      }

      const resultantSvg = svgDoc.end({ prettyPrint: true });
      responseSender.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Content-Length': resultantSvg.length,
      });
      responseSender.end(resultantSvg);
    }
  }
}
