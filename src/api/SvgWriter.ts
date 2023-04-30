import { Response } from 'express';

export class SvgWriter {

  public static writeSvg(lastVisitedProp: string, command: string, responseSender: Response) {
    responseSender.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Length': this.svgData.length,
    });
    responseSender.end(this.svgData);
  }

  static svgData = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="400" height="400">
  <rect width="100%" height="100%" fill="red"/>
  <text x="50%" y="50%" text-anchor="middle">${String(Math.random())}</text>
</svg>`;

}