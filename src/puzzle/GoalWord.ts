import { Piece } from './Piece'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { Solution } from './Solution'
import { SolverViaRootPiece } from './SolverViaRootPiece'

export class GoalWord {
  public goalHint: string
  public piece: Piece | null
  private isTreeOfPiecesSolved: boolean
  private readonly commandsCompletedInOrder: RawObjectsAndVerb[]

  constructor (goalHint: string, commandsCompletedInOrder: RawObjectsAndVerb[], isSolved = false) {
    this.goalHint = goalHint
    this.isTreeOfPiecesSolved = isSolved
    this.piece = null

    this.commandsCompletedInOrder = []
    if (commandsCompletedInOrder != null) {
      for (const command of commandsCompletedInOrder) {
        this.commandsCompletedInOrder.push(command)
      }
    }
  }

  public CloneIncludingLeaves (): GoalWord {
    const newGoalWord = new GoalWord(this.goalHint, this.commandsCompletedInOrder)
    if (this.piece != null) {
      newGoalWord.piece = this.piece.ClonePieceAndEntireTree()
    }
    return newGoalWord
  }

  public IsSolved (): boolean {
    return this.isTreeOfPiecesSolved
  }

  public SetSolved (): void {
    this.isTreeOfPiecesSolved = true
  }

  public GetCommandsCompletedInOrder (): RawObjectsAndVerb[] {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The best way to clone in is using 'map'
    return this.commandsCompletedInOrder.map((x) => x)
  }

  public PushCommand (rawObjectsAndVerb: RawObjectsAndVerb): void {
    this.commandsCompletedInOrder.push(rawObjectsAndVerb)
  }

  public ProcessUntilCloning (solution: Solution, solutions: SolverViaRootPiece, path: string): boolean {
    // if the goalword piece is already found, we recurse
    if (this.piece != null) {
      return this.piece.ProcessUntilCloning(solution, solutions, path + this.goalHint + '/')
    }
    // else we find the goal word piece

    const setOfMatchingPieces = solution
      .GetMainBox()
      .GetPiecesThatOutputString(this.goalHint)

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

        // remove all the pieces after cloning
        for (const theMatchingPiece of setOfMatchingPieces) {
          theSolution.GetMainBox().RemovePiece(theMatchingPiece)
        }

        if (matchingPieces.length > 1) {
          // }[${i > 0 ? matchingPieces.length - i : 0}]
          const firstInput = theMatchingPiece.inputHints.length > 0 ? theMatchingPiece.inputHints[0] : 'no-hint'
          theSolution.PushDisplayNameSegment(`${this.goalHint}=${firstInput}`)
        }
        // this is only here to make the unit tests make sense
        // something like to fix a bug where cloning doesn't mark piece as complete
        // theSolution.MarkPieceAsCompleted(theSolution.GetWinGoal())
        // ^^ this might need to recursively ask for parent, since there are no
        // many root pieces
        if (isCloneBeingUsed) {
          solutions.GetSolutions().push(theSolution)
        }

        // rediscover the current GoalWord in theSolution - again because we might be cloned
        const theGoalWord = theSolution.GetRootMap().GetGoalWordByNameNoThrow(this.goalHint)
        console.assert(theGoalWord != null)
        if (theGoalWord != null) {
          theGoalWord.piece = theMatchingPiece

          // all pieces are incomplete when they are *just* added
          theSolution.AddRestrictions(theMatchingPiece.getRestrictions())
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
}
