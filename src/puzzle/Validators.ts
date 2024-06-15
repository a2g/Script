import { Validator } from './Validator'
import { Solutions } from './Solutions'

/**
 * Does only a few things:
 * 1. A simple collection of Solutions
 * 2. Methods that call the same thing on all solutions
 * 3. Generating solution names - which is why it needs mapOfStartingThings...
 */
export class Validators {
  private readonly validators: Validator[]

  constructor (solutions: Solutions) {
    this.validators = []
    for (const solution of solutions.GetSolutions()) {
      const validator = new Validator(
        solution.GetSolvingPath(),
        solutions.GetStartingPieces(),
        solutions.GetStartingTalkFiles(),
        solution.GetAchievementStubMap(),
        solutions.GetStartersMapOfAllStartingThings())
      this.validators.push(validator)
    }
  }

  public GetValidators (): Validator[] {
    return this.validators
  }

  public DeconstructAllGoalsOfAllValidatorsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const validator of this.validators) {
      if (validator.DeconstructAllGoalsAndRecordSteps()) {
        wasThereAtLeastSomeProgress = true
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public FindEssentialIngredientsPerSolution (startingThingsPerCharacter: Map<string, Set<string>>): void {
    for (const item of startingThingsPerCharacter) {
      const character = item[0]
      const charactersSet = item[1]
      for (const validator of this.validators) {
        const arrayOfCommands = validator.GetOrderOfCommands()
        for (const command of arrayOfCommands) {
          const hasObjectA: boolean = charactersSet.has(command.objectA)
          const hasObjectB: boolean = charactersSet.has(command.objectB)
          if (hasObjectA || hasObjectB) {
            validator.AddToListOfEssentials([character])
          }
        }
      }
    }
  }
}
