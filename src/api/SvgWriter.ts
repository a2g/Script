import { Response } from 'express';
import { existsSync, readFileSync } from 'fs';

//@ts-ignore
import { create } from 'xmlbuilder2';

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

export class SvgWriter {
  public static writeSvg(
    world: string,
    area: string,
    lastVisitedProp: string,
    command: string,
    responseSender: Response
  ) {
    console.log(command);
    console.log(lastVisitedProp);

    const path = `./src/worlds/${world}/`;
    const areaMapFilename = `${area}AreaMap.json`;
    const connectionsFilename = `${area}Connections.json`;
    if (!existsSync(path + areaMapFilename)) {
      throw new Error(`file doesn't exist ${path}${areaMapFilename} ${process.cwd()}`);
    }
    const text = readFileSync(path + areaMapFilename, 'utf8');
    const scenario = JSON.parse(text);

    let maxCol = 1;
    let maxRow = 1;
    let resultantSvg = ''
    if (Array.isArray(scenario.squares)) {

      let squares = scenario.squares as $Square[];
      for (let square of squares) {
        const colAsString = square.col;
        let col = colAsString.length > 0 ? colAsString.charCodeAt(0) - 65 : 0;
        if (col > maxCol) {
          maxCol = col;
        }
        let row = parseInt(square.row);
        if (row > maxRow) {
          maxRow = row;
        }
      }

      const length = 1000;
      const height = 500;
      const squareSizeX = Math.floor(length / (maxCol+1));
      const squareSizeY = Math.floor(height / (maxRow+1));
      const squareSize = Math.min(squareSizeX, squareSizeY);
      const svgNs = 'http://www.w3.org/2000/svg';

      const svgDoc = create({
        defaultNamespace: { ele: svgNs, att: null },
      });
      // all svg elements below will be created in the 'http://www.w3.org/2000/svg' namespace
      // all attributes will be created with the null namespace
      let lastNode = svgDoc.ele('svg').att('viewBox', `0 0 ${length} ${height}`);

      const centres = new Map<string, number[]>()
      for (let square of squares) {
        const colAsString = square.col;
        let col = colAsString.length > 0 ? colAsString.charCodeAt(0) - 65 : 0;
        let row = parseInt(square.row);

 
        let k = squareSize * .5
        const x = k + col * squareSize
        const y = row * squareSize
        let point = [x + k, y + k]
        centres.set(square.location, point)

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

      // connections are optional
      if (existsSync(path + connectionsFilename)) {
        const text = readFileSync(path + connectionsFilename, 'utf8');
        const json = JSON.parse(text);

        if (Array.isArray(json.connections)) {

          let connections = json.connections as $Connection[];
          for (let connection of connections) {
            if (centres.has(connection.start) &&
              centres.has(connection.end)) {
              let p1 = centres.get(connection.start)
              let p2 = centres.get(connection.end)

              if (p1 && p2) {
                lastNode = lastNode.ele('line')
                  .att({
                    x1: p1[0],
                    y1: p1[1],
                    x2: p2[0],
                    y2: p2[1],
                    width: squareSize,
                    height: squareSize,
                    fill: 'none',
                    stroke: '#f00'
                  })
                  .up();
              }
            }
          }
        }
      }
      resultantSvg = svgDoc.end({ prettyPrint: true });
      responseSender.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Content-Length': resultantSvg.length,
      });
      responseSender.end(resultantSvg);
    }
  }
}
