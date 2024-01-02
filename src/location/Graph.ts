import { Point } from './Point'
import { PriorityQueue } from './PriorityQueue'
import { QueueItem } from './QueueItem'
import { Result } from './Result'

export class Graph {
  public nodes: Point[]

  public adjacencyList: Map<Point, Array<QueueItem<Point, number>>>

  constructor () {
    this.nodes = []
    this.adjacencyList = new Map<Point, Array<QueueItem<Point, number>>>()
  }

  public addPoint (point: Point): void {
    this.nodes.push(point)
    this.adjacencyList.set(point, [])
  }

  public addEdge (point1: Point, point2: Point, weight: number): void {
    const itemInAdjacencyListForPoint1 = this.adjacencyList.get(point1)
    if (itemInAdjacencyListForPoint1 !== undefined) {
      itemInAdjacencyListForPoint1.push(new QueueItem(point2, weight))
    }

    const itemInAdjacencyListForPoint2 = this.adjacencyList.get(point2)
    if (itemInAdjacencyListForPoint2 !== undefined) {
      itemInAdjacencyListForPoint2.push(new QueueItem(point1, weight))
    }
  }

  public findShortestPath (startPoint: Point, endPoint: Point): Result {
    const priorities: Map<Point, number> = new Map<Point, number>()
    const backtrace: Map<Point, Point> = new Map<Point, Point>()

    const itemInAdjacencyListForStartPoint = this.adjacencyList.get(startPoint)
    const itemInAdjacencyListForEndPoint = this.adjacencyList.get(endPoint)

    if (
      itemInAdjacencyListForStartPoint !== undefined &&
      itemInAdjacencyListForEndPoint !== undefined
    ) {
      if (
        itemInAdjacencyListForStartPoint.length === 0 ||
        itemInAdjacencyListForEndPoint.length === 0
      ) {
        return new Result(Infinity, [])
      }
    }

    const pq = new PriorityQueue<Point, number>()
    priorities.set(startPoint, 0)

    for (const point of this.nodes) {
      if (point !== startPoint) {
        priorities.set(point, Infinity)
      }
    }

    pq.enqueue(new QueueItem<Point, number>(startPoint, 0))
    while (!pq.isEmpty()) {
      const shortestStepOrUndefined: QueueItem<Point, number> | undefined =
        pq.dequeue()
      if (shortestStepOrUndefined !== undefined) {
        const shortestStep: QueueItem<Point, number> = shortestStepOrUndefined
        const currentPoint = shortestStep.getPrimitive()
        const list: Array<QueueItem<Point, number>> | undefined =
          this.adjacencyList.get(currentPoint)
        if (list !== undefined) {
          for (const neighbor of list) {
            const currentPointPriority = priorities.get(currentPoint)
            if (currentPointPriority !== undefined) {
              const weight = currentPointPriority + neighbor.getPriority()
              const priorityOfNeighborPoint = priorities.get(
                neighbor.getPrimitive()
              )
              if (priorityOfNeighborPoint !== undefined) {
                if (weight < priorityOfNeighborPoint) {
                  priorities.set(neighbor.getPrimitive(), weight)
                  backtrace.set(neighbor.getPrimitive(), currentPoint)
                  pq.enqueue(new QueueItem(neighbor.getPrimitive(), weight))
                }
              }
            }
          }
        }
      }
    }
    const path = [endPoint]
    let lastStep = endPoint
    while (lastStep !== startPoint) {
      const backTraceLastStep = backtrace.get(lastStep)
      if (backTraceLastStep !== undefined) {
        path.unshift(backTraceLastStep)
        lastStep = backTraceLastStep
      }
    }

    // console.warn("result:",result)
    return new Result(priorities.get(endPoint), path)
  }
}
