import { SolverViaRootPiece } from './SolverViaRootPiece'
import { SpecialTypes } from './SpecialTypes'
import { Solution } from './Solution'
import { Happenings } from './Happenings'
import { Happen } from './Happen'

export class Piece {
  id: number
  type: string
  output: string
  inputs: Array<Piece | null>
  inputHints: string[]
  parent: Piece | null// this is not needed for leaf finding - but *is* needed for command finding.
  count: number
  characterRestrictions: string[]
  happenings: Happenings | null

  constructor (
    id: number,
    output: string,
    type = 'undefined',
    count = 1, // put it here so all the tests don't need to specify it.
    happenings: Happenings | null = null,
    restrictions: Array<{ character: string }> | null | undefined = null, // put it here so all the tests don't need to specify it.
    inputA = 'undefined',
    inputB = 'undefined',
    inputC = 'undefined',
    inputD = 'undefined',
    inputE = 'undefined',
    inputF = 'undefined' // no statics in typescript, so this seemed preferable than global let Null = "Null";
  ) {
    this.id = id
    this.parent = null
    this.count = count
    this.output = output
    this.type = type
    this.happenings = happenings
    this.characterRestrictions = new Array<string>()
    if (typeof restrictions !== 'undefined' && restrictions !== null) {
      for (const restriction of restrictions) {
        this.characterRestrictions.push(restriction.character)
      }
    }
    this.inputs = new Array<Piece>()
    this.inputHints = new Array<string>()
    if (inputA !== 'undefined' && inputA !== undefined && inputA.length > 0) {
      this.inputHints.push(inputA)
      this.inputs.push(null)
    }
    if (inputB !== 'undefined' && inputB !== undefined && inputB.length > 0) {
      this.inputHints.push(inputB)
      this.inputs.push(null)
    }
    if (inputC !== 'undefined' && inputC !== undefined && inputC.length > 0) {
      this.inputHints.push(inputC)
      this.inputs.push(null)
    }
    if (inputD !== 'undefined' && inputD !== undefined && inputD.length > 0) {
      this.inputHints.push(inputD)
      this.inputs.push(null)
    }
    if (inputE !== 'undefined' && inputE !== undefined && inputE.length > 0) {
      this.inputHints.push(inputE)
      this.inputs.push(null)
    }
    if (inputF !== 'undefined' && inputF !== undefined && inputF.length > 0) {
      this.inputHints.push(inputF)
      this.inputs.push(null)
    }
  }

  ClonePieceAndEntireTree (incompletePieceSet: Set<Piece>): Piece {
    const clone = new Piece(0, this.output, '')
    clone.id = this.id
    clone.type = this.type
    clone.count = this.count
    clone.output = this.output

    // the hints
    for (const inputHint of this.inputHints) {
      clone.inputHints.push(inputHint)
    }

    // the pieces
    let isIncomplete = false
    for (const input of this.inputs) {
      if (input != null) {
        const child = input.ClonePieceAndEntireTree(incompletePieceSet)
        child.SetParent(clone)
        clone.inputs.push(child)
      } else {
        isIncomplete = true
        clone.inputs.push(null)
      }
    }

    if (isIncomplete) { incompletePieceSet.add(this) }

    for (const restriction of this.characterRestrictions) {
      clone.characterRestrictions.push(restriction)
    }

    return clone
  }

  FindAnyPieceMatchingIdRecursively (id: number): Piece | null {
    if (this.id === id) {
      return this
    }
    for (const input of this.inputs) {
      const result = (input != null) ? input.FindAnyPieceMatchingIdRecursively(id) : null
      if (result != null) { return result }
    };
    return null
  }

  private InternalLoopOfProcessUntilCloning (solution: Solution, solutions: SolverViaRootPiece): boolean {
    for (let k = 0; k < this.inputs.length; k++) { // classic forloop useful because shared index on cloned piece
      // without this following line, any clones will attempt to reclone themselves
      // and Solution.ProcessUntilCompletion will continue forever
      if (this.inputs[k] != null) { continue }

      // we check our starting set first!
      // otherwise Toggle pieces will toggle until the count is zero.
      const objectToObtain = this.inputHints[k]
      if (solution.GetStartingThings().has(objectToObtain)) {
        this.StubOutInputK(k, SpecialTypes.StartingThings)
        // solution.AddLeafForReverseTraversal(path + this.inputHints[k] + "/", newLeaf);
        continue
      }

      // check whether we've found the goal earlier,
      // then we will eventually come to process the other entry in goals
      // so we can skip on to the next one..I think...
      //
      if (solution.GetRootMap().Has(objectToObtain)) {
        continue
      }

      // This is where we get all the pieces that fit
      // and if there is more than one, then we clone
      const matchingPieces = solution.GetPile().GetPiecesThatOutputObject(objectToObtain)
      if ((matchingPieces === undefined) || matchingPieces.length === 0) {
        this.StubOutInputK(k, SpecialTypes.ZeroMatches)
        // solution.AddLeafForReverseTraversal(path + this.inputHints[k] + "/", newLeaf);
      } else if (objectToObtain.startsWith('goal_') && matchingPieces.length === 1) {
        // add the piece with the goal output to the goal map
        // since matchingPieces[0] has output of "goal_..." (it must be equal to input)
        // and since AddToMap uses output as the key in the map
        // then the goals map will now have another entry with a key equal to "goal_..."
        // which is what we want.
        //
        // we don't do this anymore, since all pieces are put in root piece map
        // solution.GetRootMap().AddRootPiece(matchingPieces[0])
        const root = solution.GetRootMap().GetRootPieceByNameNoThrow(objectToObtain)
        if (root != null) {
          if (root.isCompleted) {
            this.StubOutInputK(k, SpecialTypes.GoalExistsAndCompleted)
          } else {
            solution.SetPieceIncompleteIfBlank(matchingPieces[0])
          }
        } else {
          solution.SetPieceIncompleteIfBlank(matchingPieces[0])
        }
      } else if (matchingPieces.length > 0) {
        // In our array the currentSolution, is at index zero
        // so we start at the highest index in the list
        // we when we finish the loop, we are with
        for (let i = matchingPieces.length - 1; i >= 0; i--) { // need reverse iterator
          const theMatchingPiece = matchingPieces[i]

          // Clone - if needed!
          const isCloneBeingUsed = i > 0
          const theSolution = isCloneBeingUsed ? solution.Clone() : solution

          // This is the earliest possible point we can remove the
          // matching piece: i.e. after the cloning has occurred
          theSolution.GetPile().RemovePiece(theMatchingPiece)

          // this is only here to make the unit tests make sense
          // something like to fix a bug where cloning doesn't mark piece as complete
          theSolution.MarkPieceAsCompleted(theSolution.GetGoalWin())
          // ^^ this might need to recursively ask for parent, since there are no
          // many root pieces

          if (isCloneBeingUsed) {
            solutions.GetSolutions().push(theSolution)
          }

          // rediscover the current piece in theSolution - again because we might be cloned
          let thePiece = null
          for (const rootPiece of theSolution.GetRootMap().GetValues()) {
            thePiece = rootPiece.piece.FindAnyPieceMatchingIdRecursively(this.id)
            if (thePiece != null) {
              break
            }
          }

          if (thePiece != null) {
            theMatchingPiece.parent = thePiece
            thePiece.inputs[k] = theMatchingPiece

            // all gates are incomplete when they are *just* added
            theSolution.SetPieceIncompleteIfBlank(theMatchingPiece)
            theSolution.AddRestrictions(theMatchingPiece.getRestrictions())
          } else {
            console.log('piece is null - so we are cloning wrong')
          }
        }

        const hasACloneJustBeenCreated = matchingPieces.length > 1
        if (hasACloneJustBeenCreated) { return true }// yes is incomplete
      }
    }
    return false
  }

  StubOutInputK (k: number, type: SpecialTypes): void {
    const objectToObtain = this.inputHints[k]
    const newLeaf = new Piece(0, `${type}(${objectToObtain})`, type)
    newLeaf.parent = this
    this.inputs[k] = newLeaf
  }

  ProcessUntilCloning (solution: Solution, solutions: SolverViaRootPiece, path: string): boolean {
    path += this.output + '/'
    if (this.type === SpecialTypes.VerifiedLeaf) { return false }// false just means keep processing.

    // this is the point we set it as completed
    solution.MarkPieceAsCompleted(this)

    if (this.InternalLoopOfProcessUntilCloning(solution, solutions)) {
      return true
    }

    // now to process each of those pieces that have been filled out
    for (const inputPiece of this.inputs) {
      if (inputPiece != null) {
        if (inputPiece.type === SpecialTypes.VerifiedLeaf) { continue }// this means its already been searched for in the map, without success.
        const hasACloneJustBeenCreated = inputPiece.ProcessUntilCloning(solution, solutions, path)
        if (hasACloneJustBeenCreated) { return true }
      } else {

        // this case used to indicate something wrong with InternalLoopOfProcessUntilCloning
        // because in the old days a solution just had one tree in it that was traversed in order
        // With the multi-tree setup, the order can jump from one tree to another
        // to another, so the order isn't clear. So instead we iterate multiple times
        // to solve it.
        //
        // In the old days it said process until cloning. But it really meant
        // process until cloning or finished - and we used some metric to determine
        // whether the traversing was complete - if it wasn't, then we knew it was
        // cloned.
        //
        // With this way, I think we need to choose something else....

        // assert(inputPiece && "Input piece=" + inputPiece + " <-If this fails there is something wrong with InternalLoopOfProcessUntilCloning");
        // console.log('Input piece= null <-If this fails there is something wrong with InternalLoopOfProcessUntilCloning')
      }
    }

    return false
  }

  SetParent (parent: Piece | null): void {
    this.parent = parent
  }

  GetParent (): Piece | null {
    return this.parent
  }

  getRestrictions (): string[] {
    return this.characterRestrictions
  }

  public GetOutput (): string {
    return this.output
  }

  UpdateMapWithOutcomes (visiblePieces: Map<string, Set<string>>): void {
    if (this.happenings != null) {
      for (const happening of this.happenings.array) {
        switch (happening.happen) {
          case Happen.GoalIsSet:
          case Happen.InvAppears:
          case Happen.PropAppears:
            visiblePieces.set(happening.item, new Set<string>())
            break
          case Happen.InvGoes:
          case Happen.PropGoes:
          default:
            visiblePieces.delete(happening.item)
            break
        }
      }
    }
  }
}
