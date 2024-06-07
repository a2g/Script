import { readFileSync } from 'fs'
import _ from '../../puzzle-piece-enums.json'
import { Box } from './Box'
import { Happen } from './Happen'
import { Happening } from './Happening'
import { Happenings } from './Happenings'
import { Command } from './Command'
import { Piece } from './Piece'
import { Stringify } from './Stringify'
import { parse } from 'jsonc-parser'
import { Mix } from './Mix'
import { Verb } from './Verb'
import { AlleviateBrackets } from './AlleviateBrackets'
import { GetNextId } from './talk/GetNextId'
import { TalkFile } from './talk/TalkFile'
import { Aggregates } from './Aggregates'
import { AddPiece } from './AddPiece'

function makeGoalNameDeterministically (partA: string, partB: string): string {
  return `x_gen_${partA}_${partB}_goal`
}
/**
 * Yup, this is the one location of these
 * And when the pieces are cloned, these ids get cloned too
 */

export class SingleFile {
  text: string
  scenario: any
  path: string
  file: string
  aggregates: Aggregates

  public constructor (path: string, filename: string, aggregates: Aggregates) {
    this.text = readFileSync(path + filename, 'utf-8')
    this.scenario = parse(this.text)
    this.path = path
    this.file = filename
    this.aggregates = aggregates
  }

  public copyAllPiecesToContainers (
    box: Box
  ): void {
    this.copyPiecesToContainer(box)
  }

  private copyPiecesToContainer (
    box: Box
  ): void {
    const isCopyRootPiecesOnly = false
    for (const piece of this.scenario.pieces) {
      const pieceType: string = piece.piece
      let count = 1
      if (piece.count !== undefined) {
        count = piece.count
      }
      const talk1 = Stringify(piece.talk1)
      const goal1 = Stringify(piece.goal1)
      const goal2 = Stringify(piece.goal2)
      const goal3 = Stringify(piece.goal3)
      const goal4 = Stringify(piece.goal4)
      const goal5 = Stringify(piece.goal5)
      // const goal6 = Stringify(piece.goal6)
      const inv1 = Stringify(piece.inv1)
      const inv2 = Stringify(piece.inv2)
      const inv3 = Stringify(piece.inv3)
      const inv4 = Stringify(piece.inv4)
      const prop1 = Stringify(piece.prop1)
      const prop2 = Stringify(piece.prop2)
      const prop3 = Stringify(piece.prop3)
      const prop4 = Stringify(piece.prop4)
      const prop5 = Stringify(piece.prop5)
      const prop6 = Stringify(piece.prop6)
      const prop7 = Stringify(piece.prop7)

      const isNoFile = piece.isNoFile === undefined ? false : piece.isNoFile as boolean
      const { restrictions } = piece
      let output = 'undefined'
      let inputA = 'undefined'
      let inputB = 'undefined'
      let inputC = 'undefined'
      let inputD = 'undefined'
      let inputE = 'undefined'
      let inputF = 'undefined'
      const happs = new Happenings()
      const boxToMerge: Box | null = null
      let command = null
      switch (pieceType) {
        case _.AUTO_GOAL1_MET_BY_GOALS:
          output = goal1
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_GOAL1_MET_BY_INVS:
          output = goal1
          inputA = inv1
          inputB = inv2
          inputC = inv3
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_GOAL1_MET_BY_PROPS:
          output = goal1
          inputA = prop1
          inputB = prop2
          inputC = prop3
          inputD = prop4
          inputE = prop5
          inputF = prop6
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_INV1_BECOMES_INV2_VIA_GOAL1:
          inputA = goal1
          inputB = inv1
          output = inv2
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_INV1_OBTAINED_VIA_GOAL1:
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = goal1
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_PROP1_APPEARS_VIA_GOAL1:
          output = prop1
          inputA = goal1
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_PROP1_BECOMES_PROP2_BY_PROPS:
          inputA = prop1
          output = prop2
          inputB = prop3
          inputC = prop4
          inputD = prop5
          inputE = prop6
          inputF = prop7
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_PROP1_BECOMES_PROP2_VIA_GOAL1:
          inputA = goal1
          inputB = prop1
          output = prop2
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.TALK1_GENERATED_PIECE_PLACEHOLDER:
          {
            const talkFile = new TalkFile(talk1 + '.jsonc', this.path, this.aggregates)
            box.GetTalkFiles().set(talkFile.GetName(), talkFile)
            const blankMap = new Map<string, string>()
            // talk1 is a subclass of a prop: it represents the character that
            // you interact with and can be visible and invisible - just like a prop
            // To talk to a prop it needs to be visible, so we add talk1 as a requisite
            talkFile.FindAndAddPiecesRecursively('starter', '', [talk1], blankMap, box)
          }
          break
        case _.EXAMINE_PROP1_YIELDS_INV1:
          happs.text = `You examine the ${prop1} and find a ${inv1}`
          // ly don't mention what happen to the prop you clicked on.  '\n You now have a' + inv1
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = prop1
          command = new Command(Verb.Examine, Mix.Prop, prop1)
          break
        case _.GIVE_INV1_TO_PROP1_GETS_INV2:
          happs.text = `You give the ${inv1} to the ${prop1} and you get the ${inv2} in return`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          // keeping prop1
          inputA = inv1
          inputB = prop1
          output = inv2
          command = new Command(Verb.Give, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_KEEPING_INV1_WHEN_USED_WITH_PROP1:
          happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          output = goal1
          inputA = prop1
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_LOSING_BOTH_INV1_AND_PROP1_WHEN_USED:
          happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          output = goal1
          inputA = inv1
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_LOSING_INV1_WHEN_USED_WITH_PROP1:
          happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          output = goal1
          inputA = inv1
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_LOSING_INV1_USED_WITH_PROP1_AND_PROPS:
          happs.text = `With everything set up correctly, you use the ${inv1} with the ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          if (prop2.length > 0) {
            happs.array.push(new Happening(Happen.PropStays, prop2))
          }
          if (prop3.length > 0) {
            happs.array.push(new Happening(Happen.PropStays, prop3))
          }
          output = goal1
          inputA = inv1
          inputB = prop1
          inputC = prop2
          inputD = prop3
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_USING_INV1_WITH_INV2:
          happs.text = `You use the ${inv1} with the ${inv2} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          inputA = inv1
          inputB = inv2
          output = goal1
          command = new Command(Verb.Use, Mix.InvVsInv, inv1, inv2)
          break
        case _.GOAL1_MET_BY_USING_INV1_WITH_PROP1:
          happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          inputA = inv1
          inputB = prop1
          output = goal1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_USING_INV1_WITH_PROP1_LOSE_PROPS:
          happs.text = `You use the ${inv1} with the  ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          inputA = inv1
          inputB = prop1
          output = goal1
          break
        case _.GOAL1_MET_BY_USING_INV1_WITH_PROP1_NEED_GOALS:
          happs.text = `You use the ${inv1} with the  ${prop1} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          output = goal1
          inputA = inv1
          inputB = prop1
          inputC = goal2
          inputD = goal3
          inputE = goal4
          inputF = goal5
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.GOAL1_MET_BY_USING_PROP1_WITH_PROP2:
          happs.text = `You use the ${prop1} with the ${prop2} and something good happens...`
          happs.array.push(new Happening(Happen.PropStays, prop1))
          happs.array.push(new Happening(Happen.PropStays, prop2))
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          inputA = prop1
          inputB = prop2
          output = goal1
          command = new Command(Verb.Use, Mix.PropVsProp, prop1, prop2)
          break
        case _.GOAL1_MET_BY_GIVING_INV1_TO_PROP1:
          happs.text = `Goal is set ${goal1}`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          happs.array.push(new Happening(Happen.GoalIsSet, goal1))
          inputA = inv1
          inputB = prop1
          output = goal1
          command = new Command(Verb.Give, Mix.InvVsProp, inv1, prop1)
          break
        case _.INV1_BECOMES_INV2_AS_PROP1_BECOMES_PROP2_GEN:
          {
            const newGoal = makeGoalNameDeterministically(inv1, prop1)
            const happs1 = new Happenings()
            happs1.array.push(new Happening(Happen.GoalIsSet, newGoal))
            const inputA1 = inv1
            const inputB1 = prop1
            const output1 = newGoal
            AddPiece(
              new Piece(
                GetNextId() + 'a',
                null,
                output1,
                _.GOAL1_MET_BY_USING_INV1_WITH_PROP1,
                count,
                new Command(Verb.Use, Mix.InvVsProp, inv1, prop1),
                happs1,
                restrictions,
                inputA1,
                inputB1
              ),
              this.path,
              true, // there's no file, its dynamic,
              box,
              this.aggregates
            )

            if (!isCopyRootPiecesOnly) {
              const happs2 = new Happenings()
              happs2.array.push(
                new Happening(Happen.InvTransitions, inv1, inv2)
              )
              const inputA2 = newGoal
              const output2 = inv2
              AddPiece(
                new Piece(
                  GetNextId() + 'b',
                  null,
                  output2,
                  _.AUTO_INV1_BECOMES_INV2_VIA_GOAL1,
                  count,
                  new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                  happs2,
                  restrictions,
                  inputA2
                ),
                this.path,
                true, // there's no file, its dynamic
                box,
                this.aggregates
              )
              const happs3 = new Happenings()
              happs3.array.push(
                new Happening(Happen.PropTransitions, prop1, prop2)
              )
              const inputA3 = newGoal
              const inputB3 = prop1
              const output3 = prop2
              AddPiece(
                new Piece(
                  GetNextId() + 'c',
                  null,
                  output3,
                  _.AUTO_PROP1_BECOMES_PROP2_VIA_GOAL1,
                  count,
                  new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                  happs3,
                  restrictions,
                  inputA3,
                  inputB3
                ),
                this.path,
                true, // there's no file, its dynamic,
                box,
                this.aggregates
              )
            }
          }
          continue // since it does its own calls to AddPiece
        case _.INV1_BECOMES_INV2_BY_KEEPING_INV3:
          happs.text = `Your ${inv1} has become a ${inv2}`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          happs.array.push(new Happening(Happen.InvStays, inv3))
          // losing inv
          output = inv2
          inputA = inv3
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsInv, inv1, inv2)
          break
        case _.INV1_BECOMES_INV2_BY_KEEPING_PROP1:
          happs.text = `Your ${inv1} has become a ${inv2}`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          // keeping prop1
          inputA = inv1
          output = inv2
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.INV1_BECOMES_INV2_BY_LOSING_INV3:
          happs.text = `The ${inv1} has become a  ${inv2}`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          happs.array.push(new Happening(Happen.InvGoes, inv3))
          // losing inv
          inputA = inv1
          output = inv2
          inputB = inv3
          command = new Command(Verb.Use, Mix.InvVsInv, inv1, inv3)
          break
        case _.INV1_OBTAINED_AS_GRABBED_PROP1_BECOMES_PROP2:
          happs.text = `Grabbing the ${prop1} allows you to obtain the ${inv1} ( and it becomes ${prop2}) `
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          output = inv1
          inputA = prop1
          command = new Command(Verb.Grab, Mix.Prop, prop1)
          break
        case _.INV1_OBTAINED_AS_INV2_BECOMES_INV3_LOSING_INV4:
          happs.text = `Using the ${inv2} with the ${inv4} allows you to obtain the ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.InvAppears, inv3))
          happs.array.push(new Happening(Happen.InvGoes, inv4))
          output = inv1
          inputA = inv2
          inputB = inv4
          command = new Command(Verb.Use, Mix.VerbvsInv, inv2, inv4)
          break
        case _.INV1_OBTAINED_AS_PROP1_BECOMES_PROP2_KEEP_INV2:
          happs.text = `Using the ${inv2} on the ${prop1} allows you to obtain the ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          output = inv1
          inputA = inv2
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, prop1)
          break
        case _.INV1_OBTAINED_BY_COMBINING_INV2_WITH_INV3:
          happs.text = `The ${inv2} and the ${inv3} combine to form an ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.InvGoes, inv3))
          output = inv1
          inputA = inv2
          inputB = inv3
          command = new Command(Verb.Use, Mix.InvVsInv, inv2, inv3)
          break
        case _.INV1_OBTAINED_BY_COMBINING_INV2_WITH_PROP1:
          happs.text = `By using the ${inv1} with the ${prop1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          output = inv1
          inputA = inv2
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, prop1)
          break
        case _.INV1_OBTAINED_BY_INV2_WITH_PROP1_LOSE_NONE:
          happs.text = `By using the ${inv2} with the ${prop1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          output = inv1
          inputA = inv2
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, prop1)
          break
        case _.INV1_OBTAINED_BY_LOSING_INV2_KEEPING_PROP1:
          happs.text = `By using the ${inv2} with the ${prop1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.PropStays, prop1))
          output = inv1
          inputA = inv2
          inputB = prop1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, prop1)
          break
        case _.INV1_OBTAINED_BY_LOSING_PROP1_KEEPING_INV2:
          happs.text = `By using the ${inv2} with the ${prop1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          output = inv1
          inputA = inv2
          inputB = prop1
          command = new Command(Verb.Open, Mix.InvVsProp, inv2, prop1)
          break
        case _.INV1_OBTAINED_BY_OPENING_INV2_WHICH_BECOMES_INV3:
          // eg open radio...BATTERIES!
          happs.text = `You open the ${inv2} and find ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.InvAppears, inv3))
          output = inv1
          inputA = inv2
          command = new Command(Verb.Open, Mix.Inv, inv2)
          break
        case _.INV1_OBTAINED_BY_PROP1_WITH_PROP2_LOSE_PROPS:
          // eg obtain inv_meteor via radiation suit with the meteor.
          // ^^ this is nearly a two in one, but the radiation suit never becomes inventory: you wear it.
          happs.text = `You use the ${prop1} with the ${prop2} and obtain the ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropGoes, prop2))
          output = inv1
          inputA = prop1
          inputB = prop2
          command = new Command(Verb.Open, Mix.PropVsProp, prop1, prop2)
          break
        case _.INV1_OBTAINED_WHEN_LOSING_INV2_AND_PROP1_BECOMES_PROP2_GEN:
          {
            happs.text = `When you use the ${inv2} with the ${prop1}, you obtain an ${inv1} as the ${prop1} becomes a ${prop2}`
            happs.array.push(new Happening(Happen.InvGoes, inv2))
            happs.array.push(new Happening(Happen.InvAppears, inv1))
            happs.array.push(new Happening(Happen.PropGoes, prop1))
            happs.array.push(new Happening(Happen.PropAppears, prop2))

            const newGoal = makeGoalNameDeterministically(inv2, prop1)
            const happs1 = new Happenings()
            happs1.array.push(new Happening(Happen.GoalIsSet, newGoal))
            const inputA1 = inv2
            const inputB1 = prop1
            const output1 = newGoal
            AddPiece(
              new Piece(
                GetNextId() + 'd',
                null,
                output1,
                _.GOAL1_MET_BY_USING_INV1_WITH_PROP1,
                count,
                new Command(Verb.Use, Mix.InvVsProp, inv1, prop1),
                happs1,
                restrictions,
                inputA1,
                inputB1
              ),
              this.path,
              true, // there's no file, its dynamic
              box,
              this.aggregates
            )

            if (!isCopyRootPiecesOnly) {
              const happs2 = new Happenings()
              happs2.array.push(new Happening(Happen.InvAppears, inv1))
              happs2.array.push(new Happening(Happen.InvGoes, inv2))
              const inputA2 = newGoal
              const output2 = inv1
              AddPiece(
                new Piece(
                  GetNextId() + 'e',
                  null,
                  output2,
                  _.AUTO_INV1_OBTAINED_VIA_GOAL1,
                  count,
                  new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                  happs2,
                  restrictions,
                  inputA2
                ),
                this.path,
                true, // there's no file, its dynamic
                box,
                this.aggregates
              )
              const happs3 = new Happenings()
              happs3.array.push(new Happening(Happen.PropGoes, prop1))
              happs3.array.push(new Happening(Happen.PropAppears, prop2))
              const inputA3 = newGoal
              const inputB3 = prop1
              const output3 = prop2
              AddPiece(
                new Piece(
                  GetNextId() + 'f',
                  null,
                  output3,
                  _.AUTO_PROP1_BECOMES_PROP2_VIA_GOAL1,
                  count,
                  new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                  happs3,
                  restrictions,
                  inputA3,
                  inputB3
                ),
                this.path,
                true, // there's no file, its dynamic
                box,
                this.aggregates
              )
            }
          }
          continue // since it does its own calls to AddPiece
        case _.PROP1_APPEARS_BY_INV1_WITH_PROP2:
          happs.text = `Using the ${inv1} with the ${prop2} has revealed a ${prop1}`
          happs.array.push(new Happening(Happen.PropAppears, prop1))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop2))
          output = prop1
          inputA = inv1
          inputB = prop2
          command = new Command(Verb.Open, Mix.InvVsProp, inv1, prop2)
          break
        case _.PROP1_APPEARS_BY_LOSING_INV1_WITH_PROP2:
          happs.text = `Using the ${inv1} with the ${prop2} loses ${inv1} , but revaels a ${prop1}`
          happs.array.push(new Happening(Happen.PropAppears, prop1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop2))
          output = prop1
          inputA = inv1
          inputB = prop2
          command = new Command(Verb.Open, Mix.InvVsProp, inv1, prop2)
          break
        case _.PROP1_APPEARS_WHEN_GRAB_PROP2_WITH_GOAL1:
          happs.text = `You use the ${prop2} and, somewhere, a ${prop1} appears`
          happs.array.push(new Happening(Happen.PropAppears, prop1))
          command = new Command(Verb.Open, Mix.Inv, inv2)
          output = prop1
          // the prop you grab (ie phone) must be input A - the solution creator
          // always constructs the solution as 'grab inputA'
          // so it needs to be input A
          inputA = prop2
          inputB = goal1
          break
        case _.PROP1_APPEARS_WHEN_USE_INV1_WITH_PROP2:
          happs.text = `You use the ${inv1} with the ${prop2} and the ${prop2} appears`
          happs.array.push(new Happening(Happen.PropAppears, prop1))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.PropStays, prop2))
          output = prop1
          // the prop you grab (ie phone) must be input A - the solution creator
          // always constructs the solution as 'grab inputA'
          // so it needs to be input A
          inputA = prop2
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop2)
          break
        case _.PROP1_BECOMES_PROP2_BY_KEEPING_INV1:
          happs.text = `You use the ${inv1}, and the ${prop1} becomes a ${inv2}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          inputA = prop1
          output = prop2
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.PROP1_BECOMES_PROP2_BY_KEEPING_PROP3:
          happs.text = `You use the ${prop3}, and the ${prop1} becomes a ${prop2}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          inputA = prop1
          output = prop2
          inputB = prop3
          command = new Command(Verb.Use, Mix.PropVsProp, prop1, prop3)
          break
        case _.PROP1_BECOMES_PROP2_BY_LOSING_INV1:
          happs.text = `You use the ${inv1}, and the ${prop1} becomes a ${prop2}}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          inputA = prop1
          output = prop2
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, prop1)
          break
        case _.PROP1_BECOMES_PROP2_BY_LOSING_PROP3:
          happs.text = `You use the ${prop3}, and the ${prop1} becomes a ${prop2}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          happs.array.push(new Happening(Happen.PropGoes, prop3))
          inputA = prop1
          output = prop2
          inputB = prop3
          command = new Command(Verb.Use, Mix.PropVsProp, prop1, prop3)
          break
        case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the prop you clicked on.  '\n You notice the ' + prop1 + ' has now become a ' + prop2
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          // This is a weird one, because there are two real-life outputs
          // but only one puzzle output. I forget how I was going to deal with this.
          inputA = prop1
          // const inputB, count = '' + reactionsFile.pieces[i].prop2
          output = inv1
          command = new Command(Verb.Grab, Mix.Prop, prop1)
          break
        case _.PROP1_CHANGES_STATE_TO_PROP2_BY_KEEPING_INV1:
          happs.text = `You use the ${inv1}, and the ${prop1} is now ${AlleviateBrackets(
            prop2
          )}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          inputA = prop1
          output = prop2
          inputB = inv1
          command = new Command(Verb.Open, Mix.InvVsProp, inv1, prop1)
          break
        case _.PROP1_GOES_WHEN_GRAB_INV1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the prop you clicked on.  '\n You notice the ' + prop1 + ' has now become a ' + prop2
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          command = new Command(Verb.Grab, Mix.Prop, prop1)
          output = inv1
          inputA = prop1
          break
        case _.PROP1_STAYS_WHEN_GRAB_INV1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the prop you clicked on.  '\n You now have a' + inv1
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = prop1
          command = new Command(Verb.Grab, Mix.Prop, prop1)
          break
        case _.PROP1_GOES_WHEN_GRAB_INV1_WITH_GOAL1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the prop you clicked on.  '\n You notice the ' + prop1 + ' has now become a ' + prop2
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          command = new Command(Verb.Grab, Mix.Prop, prop1)
          output = inv1
          inputA = prop1
          inputB = goal1
          break
        case _.PROP1_STAYS_WHEN_GRAB_INV1_WITH_GOAL1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the prop you clicked on.  '\n You now have a' + inv1
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = prop1
          inputB = goal1
          command = new Command(Verb.Grab, Mix.Prop, prop1)
          break
        case _.TALK_TO_PROP1_GETS_INV1:
          happs.text = `You now have a ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = prop1
          command = new Command(Verb.Talk, Mix.Prop, prop1)
          break
        case _.TALK_TO_PROP1_WITH_GOAL1_GETS_INV1:
          happs.text = `You talked with goal and now have a ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = prop1
          inputB = goal1
          command = new Command(Verb.Talk, Mix.Prop, prop1)
          break
        case _.THROW_INV1_AT_PROP1_GETS_INV2_LOSE_BOTH:
          happs.text = `Throw the ${inv1} at the ${prop1} gets you the ${inv2}.`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          output = inv2
          inputA = prop1
          inputB = inv1
          command = new Command(Verb.Throw, Mix.InvVsProp, inv1, prop1)
          break
        case _.TOGGLE_PROP1_BECOMES_PROP2:
          happs.text = `The ${prop1} has become a ${prop2}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          inputA = prop1
          output = prop2
          command = new Command(Verb.Toggle, Mix.Prop, prop1)
          break
        case _.TOGGLE_PROP1_CHANGES_STATE_TO_PROP2:
          happs.text = `The ${prop1} is now ${AlleviateBrackets(prop2)}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          command = new Command(Verb.Toggle, Mix.Prop, prop1)
          inputA = prop1
          output = prop2
          break
        case _.TOGGLE_PROP1_REVEALS_PROP2_AS_IT_BECOMES_PROP3:
          happs.text = `The ${prop1} becomes ${prop3} and reveals ${prop4}`
          happs.array.push(new Happening(Happen.PropGoes, prop1))
          happs.array.push(new Happening(Happen.PropAppears, prop2))
          happs.array.push(new Happening(Happen.PropAppears, prop3))
          inputA = prop1
          output = prop2
          command = new Command(Verb.Toggle, Mix.Prop, prop1)
          break
        default:
          console.error(
            `Fatal Error: We did not handle a pieceType that we're supposed to. Check to see if constant names are the same as their values in the schema. ${pieceType}`
          )
          return
      } // end switch
      AddPiece(
        new Piece(
          GetNextId() + 'g',
          boxToMerge,
          output,
          pieceType,
          count,
          command,
          happs,
          restrictions,
          inputA,
          inputB,
          inputC,
          inputD,
          inputE,
          inputF
        ),
        this.path,
        isNoFile, // defer to variable at end of file
        box,
        this.aggregates
      )
    }
  }
}
