/*
import { Box } from './Box'
import { DeconstructDoer } from './DeconstructDoer'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { Solution } from './Solution'

export function ValidateSolutionForwards (solution: Solution, _starter: Box, _outputListOfOperations: RawObjectsAndVerb[]): boolean {

  for(const achievementStruct of solution.GetRootMap().GetValues()){
       // push the commands
       const deconstructDoer = new DeconstructDoer(
        achievementStruct,
        this.currentlyVisibleThings,
        this.GetChatFiles()
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
          achievementStruct.PushCommand(rawObjectsAndVerb)
        }
      }

      // set the achievement as completed in the currently visible things
      this.currentlyVisibleThings.Set(achievementStruct.achievementAchievement, new Set<string>())

      // then write the achievement we just completed
      achievementStruct.PushCommand(
        new RawObjectsAndVerb(
          Raw.Achievement,
          `completed (${achievementStruct.achievementAchievement})`,
          '',
          achievementStruct.achievementAchievement,
          [],
          [],
          ''
        )
      )

      // also tell the solution what order the achievement was reached
      this.rootPieceKeysInSolvingOrder.push(achievementStruct.achievementAchievement)

      // Sse if any autos depend on the newly completed achievement - if so execute them
      for (const piece of this.GetAutos()) {
        if (
          piece.inputHints.length === 2 &&
          piece.inputHints[0] === achievementStruct.achievementAchievement
        ) {
          const command = createCommandFromAutoPiece(piece)
          achievementStruct.PushCommand(command)
        }
      }
  }

  return true
}
*/
