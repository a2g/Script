/**
 * QueueItem is what the PriorityQueue uses to store its data.
 * The priority that each item in the priority queue uses is
 * stored alongside a primitive. For example, that could be a
 *  point2, or a point3 or some other data type
 */
export class QueueItem<PrimitiveType, PriorityType> {
  private readonly priority: PriorityType

  private readonly primitive: PrimitiveType

  constructor (primitive: PrimitiveType, priority: PriorityType) {
    this.priority = priority
    this.primitive = primitive
  }

  public getPriority (): PriorityType {
    return this.priority
  }

  public getPrimitive (): PrimitiveType {
    return this.primitive
  }
}
