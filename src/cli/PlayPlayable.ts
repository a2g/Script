import { GetAnyErrorsFromObjectAvailability } from '../puzzle/GetAnyErrorsFromObjectAvailability'
import { ProcessAutos } from '../puzzle/ProcessAutos'
import { Stringify } from '../puzzle/Stringify'
import { GameReporter } from './GameReporter'
import { ParseTokenizedCommandLineFromFromThreeStrings } from './GetMixedObjectsAndVerbFromThreeStrings'
import { Playable } from './Playable'
import { Sleep } from './Sleep'

export function PlayPlayable (playable: Playable): void {
  for (; ;) {
    // report current situation to cmd output
    const reporter = GameReporter.GetInstance()
    const goals = playable.GetHappener().GetCurrentlyTrueGoals()
    const invs = playable.GetHappener().GetCurrentVisibleInventory()
    const props = playable.GetHappener().GetCurrentVisibleProps()
    reporter.ReportGoals(goals)
    reporter.ReportInventory(invs)
    reporter.ReportScene(props)

    // Process all the autos
    ProcessAutos(playable.GetHappener(), playable.GetSolution())

    // check have we won?
    if (playable.GetHappener().GetGoalValue('x_win') > 0) {
      // btw this is the only x_win outside of Solution.ts, so if we can get rid of it, then great
      playable.SetCompleted()
      break
    }

    Sleep(500)

    // take input & handle null and escape character
    let input: string[] = playable.GetPlayer().GetNextCommand()
    if (input.length <= 1) {
      if (input.length === 1 && input[0] === 'b') {
        return
      } // GetNextCommand returns ['b'] if the user chooses 'b'

      // this next line is only here to easily debug
      input = playable.GetPlayer().GetNextCommand()
      break
    }

    // parse & handle parsing errors
    const commandLine = ParseTokenizedCommandLineFromFromThreeStrings(
      input,
      playable.GetHappener()
    )

    if (commandLine.error.length > 0) {
      console.warn(
        `${Stringify(
          input.toString()
        )} <-- Couldn't tokenize input, specifically ${commandLine.error}`
      )
    } else {
      // if all objects are available then execute
      const errors = GetAnyErrorsFromObjectAvailability(
        commandLine,
        playable.GetHappener().GetCurrentVisibleProps(),
        playable.GetHappener().GetCurrentVisibleInventory()
      )
      if (errors.length === 0) {
        GameReporter.GetInstance().ReportCommand(input)
        playable.GetHappener().ExecuteCommand(commandLine)
      } else {
        console.warn(errors)
      }
    }
  } // end while (true) of playing game

  // a break in the above loop will get here, but a return will not.
  playable.SetCompleted()
  console.warn('Success')
}
