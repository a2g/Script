/*
import { Box } from './Box'
import { DeconstructDoer } from './DeconstructDoer'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { Solution } from './Solution'

export function ValidateSolutionForwards (solution: Solution, _starter: Box, _outputListOfOperations: RawObjectsAndVerb[]): boolean {

  for(const goalStruct of solution.GetRootMap().GetValues()){
       // push the commands
       const deconstructDoer = new DeconstructDoer(
        goalStruct,
        this.currentlyVisibleThings,
        this.GetTalkFiles()
      )
      let rawObjectsAndVerb: RawObjectsAndVerb | null = null
      for (let j = 0; j < 200; j += 1) {
        rawObjectsAndVerb =
          deconstructDoer.GetNextDoableCommandAndDeconstructTree()
        if (rawObjectsAndVerb == null) {
          // all out of moves!
          // for debugging
          rawObjectsAndVerb =
            deconstructDoer.GetNextDoableCommandAndDeconstructTree()
          break
        }

        if (rawObjectsAndVerb.type !== Raw.None) {
          // this is just here for debugging!
          goalStruct.PushCommand(rawObjectsAndVerb)
        }
      }

      // set the goal as completed in the currently visible things
      this.currentlyVisibleThings.Set(goalStruct.goalAchievement, new Set<string>())

      // then write the goal we just completed
      goalStruct.PushCommand(
        new RawObjectsAndVerb(
          Raw.Goal,
          `completed (${goalStruct.goalAchievement})`,
          '',
          goalStruct.goalAchievement,
          [],
          [],
          ''
        )
      )

      // also tell the solution what order the goal was reached
      this.rootPieceKeysInSolvingOrder.push(goalStruct.goalAchievement)

      // Sse if any autos depend on the newly completed goal - if so execute them
      for (const piece of this.GetAutos()) {
        if (
          piece.inputHints.length === 2 &&
          piece.inputHints[0] === goalStruct.goalAchievement
        ) {
          const command = createCommandFromAutoPiece(piece)
          goalStruct.PushCommand(command)
        }
      }
  }

  return true
}
*/
