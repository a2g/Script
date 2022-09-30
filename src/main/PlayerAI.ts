import { LogicGrid } from '../main/LogicGrid.js'
import { Happener } from '../main/Happener.js'
import { HappenerCallbacksInterface } from '../main/HappenerCallbacksInterface.js'
import { GetThreeStringsFromInput } from '../main/GetThreeStringsFromInput.js'

const prompt = require('prompt-sync')();

// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs props table, and inv vs inv table, and a verb vs props table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs props ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 4. Check the verbs vs props ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 5. Ensure there is no PROPS VS PROPS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a logic grid per location...which is easy - and doable.hmmn.
//
// May 2021, regarding point number 4... Some puzzles are just like that, eg use hanging cable in powerpoint.
// // even in maniac mansion it was like use radtion suit with meteot etc.
//

export class PlayerAI implements HappenerCallbacksInterface {
  invVsInv: LogicGrid

  invVsVerb: LogicGrid

  invVsProp: LogicGrid

  propVsVerb: LogicGrid

  propVsProp: LogicGrid

  game: Happener

  autoCount: number

  constructor(game: Happener, numberOfAutopilotTurns: number) {
    this.game = game
    this.autoCount = numberOfAutopilotTurns
    const verbs = game.GetVerbsExcludingUse()
    const invs = game.GetEntireInvSuite()
    const props = game.GetEntirePropSuite()

    this.invVsInv = new LogicGrid(invs, invs)
    this.invVsVerb = new LogicGrid(invs, verbs)
    this.invVsProp = new LogicGrid(invs, props)
    this.propVsVerb = new LogicGrid(props, verbs)
    this.propVsProp = new LogicGrid(props, props)
    this.game.SubscribeToCallbacks(this)

    // since use same with same is illegal move, we block these out
    for (let i = 0; i < invs.length; i += 1) { // classic forloop useful because shared index
      this.invVsInv.SetColumnRow(i, i)
    }
    // since use same with same is illegal move, we block these out
    for (let i = 0; i < props.length; i += 1) { // classic forloop useful because shared index
      this.propVsProp.SetColumnRow(i, i)
    }
  }

  GetNextCommand(): string[] {
    for (; ;) {
      if (this.autoCount > 0) {
        this.autoCount -= 1

        // 1. Check the invs vs invs ? this is the lowest hanging fruit
        const useInvOnInv = this.invVsInv.GetNextGuess()
        if (useInvOnInv[0] !== -1) {
          this.invVsInv.SetColumnRow(useInvOnInv[0], useInvOnInv[1])
          this.invVsInv.SetColumnRow(useInvOnInv[1], useInvOnInv[0])
          return ['use', this.game.GetInv(useInvOnInv[0]), this.game.GetInv(useInvOnInv[1])]
        }
        // 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
        const invVsVerb = this.invVsVerb.GetNextGuess()
        if (invVsVerb[0] !== -1) {
          this.invVsVerb.SetColumnRow(invVsVerb[0], invVsVerb[1])
          return [this.game.GetVerb(invVsVerb[1]), this.game.GetInv(invVsVerb[0]), '']
        }
        // 3. Check the invs vs props ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
        const useInvOnProp = this.invVsInv.GetNextGuess()
        if (useInvOnProp[0] !== -1) {
          this.invVsInv.SetColumnRow(useInvOnProp[0], useInvOnProp[1])
          this.invVsInv.SetColumnRow(useInvOnProp[1], useInvOnProp[0])
          return ['use', this.game.GetInv(useInvOnProp[0]), this.game.GetProp(useInvOnProp[1])]
        }
        // 4. Check the verbs vs props ? this is the fourth lowest hanging truit - if find something, then go to 1.
        const propVsVerb = this.propVsVerb.GetNextGuess()
        if (propVsVerb[0] !== -1) {
          this.propVsVerb.SetColumnRow(propVsVerb[0], propVsVerb[1])
          return [this.game.GetVerb(propVsVerb[1]), this.game.GetProp(propVsVerb[0]), '']
        }
        // 5. Ensure there is no PROPS VS PROPS because:
        const usePropOnProp = this.propVsProp.GetNextGuess()
        if (usePropOnProp[0] !== -1) {
          this.propVsProp.SetColumnRow(usePropOnProp[0], usePropOnProp[1])
          this.propVsProp.SetColumnRow(usePropOnProp[1], usePropOnProp[0])
          return ['use', this.game.GetProp(usePropOnProp[0]), this.game.GetProp(usePropOnProp[1])]
        }

      } else {

        const input = prompt('Enter a command with two or three terms (b)ack: ')
        if (input !== null) {
          if (input === 'b') { return ['b'] }
          const items: string[] = GetThreeStringsFromInput(input)

          if (items.length === 2 && items[0].toUpperCase() === 'DO' && Number(items[1]) > 0) {
            this.autoCount = Number(items[1])
            console.log(`Autocount has been given ${this.autoCount} operations.`)
          }
          else if (items.length !== 3) {
            console.log(`Please enter 3 words (not ${items.length} )`)
          } else {
            return items
          }
        } else {
          console.log('At least enter something')
        }
      }
    }
  }

  OnInvVisbilityChange(number: number, newValue: boolean, nameForDebugging: string): void {
    // the convention for the array is x then y, or column then row.
    // so Set..Column sets the first t
    this.invVsVerb.SetVisibilityOfColumn(number, newValue, nameForDebugging)
    this.invVsProp.SetVisibilityOfColumn(number, newValue, nameForDebugging)
    this.invVsInv.SetVisibilityOfRow(number, newValue, nameForDebugging)
    this.invVsInv.SetVisibilityOfColumn(number, newValue, nameForDebugging)
  }

  OnPropVisbilityChange(number: number, newValue: boolean, nameForDebugging: string): void {
    // the convention for the array is x then y, or column then row.
    // so Set..Column sets the first t
    this.propVsVerb.SetVisibilityOfColumn(number, newValue, nameForDebugging)
    this.invVsProp.SetVisibilityOfRow(number, newValue, nameForDebugging)
    this.propVsProp.SetVisibilityOfRow(number, newValue, nameForDebugging)
    this.propVsProp.SetVisibilityOfColumn(number, newValue, nameForDebugging)
  }

  OnFlagValueChange(number: number, newValue: number, nameForDebugging: string): void {
    // the convention for the array is x then y, or column then row.
    // so Set..Column sets the first t
    this.propVsVerb.SetVisibilityOfColumn(number, newValue > 0, nameForDebugging);
    this.invVsProp.SetVisibilityOfRow(number, newValue > 0, nameForDebugging);
    this.propVsProp.SetVisibilityOfRow(number, newValue > 0, nameForDebugging);
    this.propVsProp.SetVisibilityOfColumn(number, newValue > 0, nameForDebugging);
  }
}
