import { NextFunction, Request, Response } from 'express'
import { getJsonOfAllSolutions } from './getJsonOfAllSolutions'
import { getJsonOfStarters } from './getJsonOfStarters'
import { getSvg } from './getSvg'

interface RequestParams {
  repo: string
  world: string
  area: string
}
interface ResponseBody {
  paramA: string
}
interface RequestBody {
  paramA: string
}
interface RequestQuery {
  paramA: string
  paramB: string
}

export function getSvgApi (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  responseSender: Response,
  next: NextFunction
): void {
  try {
    const repo = req.params.repo
    const world = req.params.world
    const area = req.params.area
    const paramA: string = req.query.paramA ?? ''
    const paramB: string = req.query.paramB ?? ''
    console.log(next.name)
    const svgAsString = getSvg(repo, world, area, paramA, paramB)
    responseSender.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Length': svgAsString.length
    })
    responseSender.end(svgAsString)
  } catch (err) {
    console.error(err)
    responseSender.status(500)
  }
}

export function getJsonOfAllSolutionsApi (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  responseSender: Response,
  _next: NextFunction
): void {
  try {
    const repo = req.params.repo
    const world = req.params.world
    const area = req.params.area

    const json = getJsonOfAllSolutions(repo, world, area)

    responseSender.json(json)
  } catch (err) {
    console.error(err)
    responseSender.status(500)
  }
}

export function getJsonOfStartersApi (
  _req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  responseSender: Response,
  _next: NextFunction
): void {
  try {
    const json = getJsonOfStarters()

    responseSender.json(json)
  } catch (err) {
    console.error(err)
    responseSender.status(500)
  }
}
