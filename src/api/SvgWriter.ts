import { Response } from 'express';
import { SVG, Container, registerWindow } from '@svgdotjs/svg.js';
//@ts-ignore
import * as svgdom from 'svgdom';

export class SvgWriter {
  public static writeSvg(
    lastVisitedProp: string,
    command: string,
    responseSender: Response
  ) {
    console.log(command);
    console.log(lastVisitedProp);
    let window = svgdom.createSVGWindow();
    // register window and document
    registerWindow(window, window.document);

    // create canvas
    const canvas = SVG(window.document.documentElement) as Container;
    canvas
      .rect(50, 50)
      .attr({ fill: '#f03' })
      .animate({
        duration: 2000,
        delay: 1000,
        when: 'now',
        swing: true,
        times: 5,
        wait: 200,
      })


    // use svg.js as normal
    // canvas.rect(100, 100).fill('yellow').move(50,50)
    const svg = canvas.svg();
    // get your svg as string
    console.log(svg);
    // or
    console.log(canvas.node.outerHTML);

    responseSender.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Length': svg.length,
    });
    responseSender.end(svg);
  }
}
