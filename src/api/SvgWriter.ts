import { Response } from 'express';

export class SvgWriter {

  
  public static writeSvg(lastVisitedProp: string, command: string, responseSender: Response) {
    const svg = '<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
const text = `<text x="10" y="20" fill="gray">${lastVisitedProp} ${command}</text>`
const rect = '<rect x="0" y="30" width="300" height="100" stroke="red" stroke-width="1" />'
const circle = '<circle cx="0" cy="50" r="15" fill="blue" stroke="cyan" stroke-width="1">'
const animate = '<animate attributeName="cx" from="0" to="500" dur="5s" repeatCount="indefinite" />'
const circleEnd = '</circle>'
const svgEnd = '</svg>'

    let fullSvg = svg + text + rect + circle + animate + circleEnd + svgEnd
    
    responseSender.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Length': fullSvg.length,
    });
    responseSender.end(fullSvg);
  }
}