import { PieceBase } from './PieceBase'
import { Solution } from './Solution'
import { Solutions } from './Solutions'

/**
 * Tries to find a piece to connect to the kth input of thePiece.
 *
 * Now the complicated bit:
 * If it finds multiple pieces that match the hint, it clones the solution so we have extra
 * solutions to connect those extra pieces to - and adds the new solutions to the solution list.
 * @param thePiece - the piece whose kth input we are trying to connect
 * @param k - the input we are trying to connect
 * @param thePieceId - the id of thePiece, passed separately since its not a member of pieceBase
 * @param solution - the solution to which the piece belongs.
 * @param solutions - used if we have multiple, and need to clone this solution, and take a bet each way.
 *
 * @returns true if a clone has occurred
 */
export function ProcessAndReturnTrueIfCloneOccurs (
  thePiece: PieceBase,
  k: number,
  thePieceId: string,
  solution: Solution,
  solutions: Solutions
): boolean {
  const hintToFind = thePiece.inputHints[k]
  const setOfMatchingPieces = solution.GetPiecesThatOutputString(hintToFind)

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

      // any new clones need to be added to the solution collection
      if (isCloneBeingUsed) {
        solutions.GetSolutions().push(theSolution)
      }

      // Rediscover the current piece in theSolution - because we might be cloned!
      // if id is not passed in, then we have a stub port on our hands, in which case we search
      // in the achievement stubs for our stub.
      const thePiece = thePieceId.length > 0
        ? theSolution.FindAnyPieceMatchingIdRecursively(thePieceId)
        : theSolution.GetAchievementStubMap().GetAchievementStubByNameNoThrow(hintToFind)

      if (thePiece != null) {
        if (matchingPieces.length > 1) {
          // this is interesting.... ok, so why use index zero here? .. the answer is that
          // we need something to id the piece with, and its not the output, because multiple pieces
          // output that same output, right?
          // so we need something else.
          // Could have added some EXTRA field on the piece - which complicates the piece constructor
          // But instead I designate the FIRST INPUT as the one that characterizes the piece
          // and sometimes it doesn't work, so I go through the SingleFile and change the first input
          // into whatever suits what I'm working on at the time.
          const firstInput = theMatchingPiece.inputHints.length > 0 ? theMatchingPiece.inputHints[0] : 'no-hint'
          theSolution.PushSolvingPathSegment(`${firstInput}`)
        }

        theMatchingPiece.parent = thePiece
        thePiece.inputs[k] = theMatchingPiece

        // this basically adds the requirements to the solutions prerequisites
        theSolution.AddToListOfPrerequisites(theMatchingPiece.getPrerequisites())
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
