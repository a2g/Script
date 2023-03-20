import { Line } from './Line';

export function ShuffleLineArray(givenArray: Line[]): Line[] {
  const theArray = givenArray.slice();
  let currentIndex: number = theArray.length;
  let temporaryValue;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = theArray[currentIndex];
    theArray[currentIndex] = theArray[randomIndex];
    theArray[randomIndex] = temporaryValue;
  }
  return theArray;
}
