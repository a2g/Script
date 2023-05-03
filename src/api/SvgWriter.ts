import { Response } from 'express';

//@ts-ignore
import { create } from 'xmlbuilder2';

export class SvgWriter {
  public static writeSvg(
    lastVisitedProp: string,
    command: string,
    responseSender: Response
  ) {
    console.log(command);
    console.log(lastVisitedProp);

    //const svgNs = 'http://www.w3.org/2000/svg';
    //const xlinkNs = 'http://www.w3.org/1999/xlink';

    const svgDoc = create({
      defaultNamespace: { ele: 'http://www.w3.org/2000/svg', att: null },
    });
    // all svg elements below will be created in the 'http://www.w3.org/2000/svg' namespace
    // all attributes will be created with the null namespace
    svgDoc
      .ele('svg')
      .att('viewBox', '0 0 100 100')
      .ele('circle')
      .att({ cx: 50, cy: 50, r: 48, fill: 'none', stroke: '#000' })
      .up()
      .ele('path')
      .att('d', 'M50,2a48,48 0 1 1 0,96a24 24 0 1 1 0-48a24 24 0 1 0 0-48')
      .up()
      .ele('circle')
      .att({ cx: 50, cy: 26, r: 6 })
      .up()
      .ele('circle')
      .att({ cx: 50, cy: 74, r: 6, fill: '#FFF' })
      .up();
    const result = svgDoc.end({ prettyPrint: true });

    responseSender.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Length': result.length,
    });
    responseSender.end(result);
  }
}
