import { NextFunction, Request, Response } from 'express';
import { SvgWriter } from './SvgWriter';
interface RequestParams {
  world: string;
  area: string;
}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {
  lastVisitedProp: string;
  command: string;
}

export async function svg(
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  responseSender: Response,
  next: NextFunction
) {
  try {
    const world = req.params.world;
    const area = req.params.area;
    const command = req.query.command;
    const lastVisitedProp = req.query.lastVisitedProp;
    console.log(next.name);
    SvgWriter.writeSvg(world, area, lastVisitedProp, command, responseSender);
  } catch (err) {
    console.error(err);
    responseSender.status(500);
  }
}
