import { Solution } from './Solution'
import { Solutions } from './Solutions'

export function CloneShared (
  solution: Solution,
  solutions: Solutions,
  importHintToFind: string,
  k: number,
  thePieceId: string,
  isPiece: boolean): boolean {
  const setOfMatchingPieces = solution.GetPiecesThatOutputString(importHintToFind)

  if (setOfMatchingPieces.size > 0) {
    const matchingPieces = Array.from(setOfMatchingPieces)
    // In our array the currentSolution, is at index zero
    // so we start at the highest index in the list
    // we when we finish the loop, we are with
    for (let i = matchingPieces.length - 1; i >= 0; i--) {
      // need reverse iterator
      const theMatchingPiece = matchingPieces[i]

      // Clone - if needed!
      const isCloneBeingUsed = i > 0
      const theSolution = isCloneBeingUsed ? solution.Clone() : solution

      // remove all the pieces straight after cloning
      for (const theMatchingPiece of setOfMatchingPieces) {
        theSolution.RemovePiece(theMatchingPiece)
      }

      if (isCloneBeingUsed) {
        solutions.GetSolutions().push(theSolution)
      }


      // rediscover the current piece in theSolution - again because we might be cloned
      const thePiece = isPiece ? theSolution.FindAnyPieceMatchingIdRecursively(thePieceId)
        : theSolution.GetAchievementStubMap().GetAchievementStubByNameNoThrow(importHintToFind)
      if (thePiece != null) {
        if (matchingPieces.length > 1) {
          const firstInput = theMatchingPiece.inputHints.length > 0 ? theMatchingPiece.inputHints[0] : 'no-hint'
          theSolution.PushSolvingPathSegment(`${firstInput}`)
        }

        theMatchingPiece.parent = thePiece
        thePiece.inputs[k] = theMatchingPiece

        // all pieces are incomplete when they are *just* added
        theSolution.AddToListOfEssentials(theMatchingPiece.getRestrictions())
      } else {
        console.warn('piece is null - so we are cloning wrong')
        throw new Error('piece is null - so we are cloning wrong')
      }
    }

    const hasACloneJustBeenCreated = matchingPieces.length > 1
    if (hasACloneJustBeenCreated) {
      return true
    } // yes is incomplete
  }
  return false
}
