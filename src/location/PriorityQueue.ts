import { QueueItem } from './QueueItem.js';

/**
 * PriorityQueue class repurposes an array to simulate a priority queue.
 */
export class PriorityQueue<PrimitiveType, PriorityType> {
  private sortedDictionary: Array<QueueItem<PrimitiveType, PriorityType>>;

  constructor() {
    this.sortedDictionary = [];
  }

  /**
   * A normal queue would be added to the end. A priority queue
   * squeezes people in depending on their priority.
   */
  public enqueue(item: QueueItem<PrimitiveType, PriorityType>): void {
    if (this.isEmpty()) {
      this.sortedDictionary.push(item);
    } else {
      let added = false;
      for (let i = 1; i <= this.sortedDictionary.length; i += 1) {
        // the priority type must work with the lessThan operator
        if (item.getPriority() < this.sortedDictionary[i - 1].getPriority()) {
          this.sortedDictionary.splice(i - 1, 0, item);
          added = true;
          break;
        }
      }
      if (!added) {
        this.sortedDictionary.push(item);
      }
    }
  }

  /**
   * Just like a normal queue, we only take from the front of the queue.
   */
  public dequeue(): QueueItem<PrimitiveType, PriorityType> | undefined {
    const value = this.sortedDictionary.shift();
    return value;
  }

  public isEmpty(): boolean {
    return this.sortedDictionary.length === 0;
  }
}
