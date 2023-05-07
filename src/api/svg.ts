import { NextFunction, Request, Response } from 'express';
import { SvgWriter } from './SvgWriter';
interface RequestParams {
  world: string;
  area: string;
}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {
  paramA: string;
  paramB: string;
}

export async function svg(
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  responseSender: Response,
  next: NextFunction
) {
  try {
    const world = req.params.world;
    const area = req.params.area;
    const paramA = req.query.paramA;
    const paramB = req.query.paramB;
    console.log(next.name);
    SvgWriter.writeSvg(world, area, paramA, paramB, responseSender);
  } catch (err) {
    console.error(err);
    responseSender.status(500);
  }
}
