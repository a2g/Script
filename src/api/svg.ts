import { NextFunction, Request, Response } from 'express';
import { SvgWriter } from './SvgWriter';
interface RequestParams {
  repo: string;
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
    const repo = req.params.repo;
    const world = req.params.world;
    const area = req.params.area;
    const paramA: string = req.query.paramA ?? '';
    const paramB: string = req.query.paramB ?? '';
    console.log(next.name);
    SvgWriter.writeSvg(repo, world, area, paramA, paramB, responseSender);
  } catch (err) {
    console.error(err);
    responseSender.status(500);
  }
}
