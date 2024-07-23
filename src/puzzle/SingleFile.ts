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
import { ChatFile } from './talk/ChatFile'
import { Aggregates } from './Aggregates'
import { AddPiece } from './AddPiece'
import { _STARTER } from '../_STARTER'
import { IdPrefixes } from '../../IdPrefixes'

function makeAchievementNameDeterministically (partA: string, partB: string): string {
  return `${IdPrefixes.Achievement}_gen_${partA}_${partB}_ament`
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
    for (const piece of this.scenario.pieces) {
      const pieceType: string = piece.piece
      let count = 1
      if (piece.count !== undefined) {
        count = piece.count
      }
      const chat1 = Stringify(piece.chat1)
      const ament1 = Stringify(piece.ament1)
      const ament2 = Stringify(piece.ament2)
      const ament3 = Stringify(piece.ament3)
      const ament4 = Stringify(piece.ament4)
      const ament5 = Stringify(piece.ament5)
      // const ament6 = Stringify(piece.ament6)
      const inv1 = Stringify(piece.inv1)
      const inv2 = Stringify(piece.inv2)
      const inv3 = Stringify(piece.inv3)
      const inv4 = Stringify(piece.inv4)
      const obj1 = Stringify(piece.obj1)
      const obj2 = Stringify(piece.obj2)
      const obj3 = Stringify(piece.obj3)
      const obj4 = Stringify(piece.obj4)
      const obj5 = Stringify(piece.obj5)
      const obj6 = Stringify(piece.obj6)
      const obj7 = Stringify(piece.obj7)

      const isNoFile = piece.isNoFile === undefined ? false : piece.isNoFile as boolean
      const { prerequisites } = piece
      let output = 'undefined'
      let inputA = 'undefined'
      let inputB = 'undefined'
      let inputC = 'undefined'
      let inputD = 'undefined'
      let inputE = 'undefined'
      let inputF = 'undefined'
      const happs = new Happenings('', [])
      const boxToMerge: Box | null = null
      let command = null
      switch (pieceType) {
        case _.AUTO_AMENT1_MET_BY_AMENTS:
          output = ament1
          inputA = ament2
          inputB = ament3
          inputC = ament4
          inputD = ament5
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_AMENT1_MET_BY_INVS:
          output = ament1
          inputA = inv1
          inputB = inv2
          inputC = inv3
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_AMENT1_MET_BY_OBJS:
          output = ament1
          inputA = obj1
          inputB = obj2
          inputC = obj3
          inputD = obj4
          inputE = obj5
          inputF = obj6
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_INV1_BECOMES_INV2_VIA_AMENT1:
          inputA = ament1
          inputB = inv1
          output = inv2
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_INV1_OBTAINED_VIA_AMENT1:
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = ament1
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_OBJ1_APPEARS_VIA_AMENT1:
          output = obj1
          inputA = ament1
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_OBJ1_BECOMES_OBJ2_BY_OBJS:
          inputA = obj1
          output = obj2
          inputB = obj3
          inputC = obj4
          inputD = obj5
          inputE = obj6
          inputF = obj7
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.AUTO_OBJ1_BECOMES_OBJ2_VIA_AMENT1:
          inputA = ament1
          inputB = obj1
          output = obj2
          command = new Command(Verb.Auto, Mix.AutoNeedsNothing, '')
          break
        case _.INCLUDE_ALL_PIECES_IN_CHAT1:
          {
            const chatFile = new ChatFile(chat1 + '.jsonc', this.path, this.aggregates)
            box.GetChatFiles().set(chatFile.GetName(), chatFile)
            const blankMap = new Map<string, string>()
            // chat1 is a subclass of a obj: it represents the character that
            // you interact with and can be visible and invisible - just like a obj
            // To chat to a obj it needs to be visible, so we add chat1 as a requisite
            chatFile.FindAndAddPiecesRecursively(_STARTER, '', [chat1], blankMap, box)
          }
          break
        case _.EXAMINE_OBJ1_YIELDS_INV1:
          happs.text = `You examine the ${obj1} and find a ${inv1}`
          // ly don't mention what happen to the obj you clicked on.  '\n You now have a' + inv1
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = obj1
          command = new Command(Verb.Examine, Mix.Prop, obj1)
          break
        case _.GIVE_INV1_TO_OBJ1_GETS_INV2:
          happs.text = `You give the ${inv1} to the ${obj1} and you get the ${inv2} in return`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          // keeping obj1
          inputA = inv1
          inputB = obj1
          output = inv2
          command = new Command(Verb.Give, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_GRABBING_OBJ_AND_GAINING_INV1:
          happs.text = `You use the ${inv1} with the ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          output = ament1
          inputA = obj1
          inputB = inv1
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          break

        case _.AMENT1_MET_BY_KEEPING_INV1_WHEN_USED_WITH_OBJ1:
          happs.text = `You use the ${inv1} with the ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          output = ament1
          inputA = obj1
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_LOSING_BOTH_INV1_AND_OBJ1_WHEN_USED:
          happs.text = `You use the ${inv1} with the ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          output = ament1
          inputA = inv1
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_LOSING_INV1_WHEN_USED_WITH_OBJ1:
          happs.text = `You use the ${inv1} with the ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          output = ament1
          inputA = inv1
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_LOSING_INV1_USED_WITH_OBJ1_AND_OBJS:
          happs.text = `With everything set up correctly, you use the ${inv1} with the ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          if (obj2.length > 0) {
            happs.array.push(new Happening(Happen.ObjStays, obj2))
          }
          if (obj3.length > 0) {
            happs.array.push(new Happening(Happen.ObjStays, obj3))
          }
          output = ament1
          inputA = inv1
          inputB = obj1
          inputC = obj2
          inputD = obj3
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_USING_INV1_WITH_INV2:
          happs.text = `You use the ${inv1} with the ${inv2} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          inputA = inv1
          inputB = inv2
          output = ament1
          command = new Command(Verb.Use, Mix.InvVsInv, inv1, inv2)
          break
        case _.AMENT1_MET_BY_USING_INV1_WITH_OBJ1:
          happs.text = `You use the ${inv1} with the ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          inputA = inv1
          inputB = obj1
          output = ament1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_USING_INV1_WITH_OBJ1_LOSE_OBJS:
          happs.text = `You use the ${inv1} with the  ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          inputA = inv1
          inputB = obj1
          output = ament1
          break
        case _.AMENT1_MET_BY_USING_INV1_WITH_OBJ1_NEED_AMENTS:
          happs.text = `You use the ${inv1} with the  ${obj1} and something good happens...`
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          output = ament1
          inputA = inv1
          inputB = obj1
          inputC = ament2
          inputD = ament3
          inputE = ament4
          inputF = ament5
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.AMENT1_MET_BY_USING_OBJ1_WITH_OBJ2:
          happs.text = `You use the ${obj1} with the ${obj2} and something good happens...`
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          happs.array.push(new Happening(Happen.ObjStays, obj2))
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          inputA = obj1
          inputB = obj2
          output = ament1
          command = new Command(Verb.Use, Mix.PropVsProp, obj1, obj2)
          break
        case _.AMENT1_MET_BY_GIVING_INV1_TO_OBJ1:
          happs.text = `Achievement is set ${ament1}`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          happs.array.push(new Happening(Happen.AchievementIsSet, ament1))
          inputA = inv1
          inputB = obj1
          output = ament1
          command = new Command(Verb.Give, Mix.InvVsProp, inv1, obj1)
          break
        case _.INV1_BECOMES_INV2_AS_OBJ1_BECOMES_OBJ2_GEN:
          {
            const newAchievement = makeAchievementNameDeterministically(inv1, obj1)
            const inputA1 = inv1
            const inputB1 = obj1
            const output1 = newAchievement
            AddPiece(
              new Piece(
                `${GetNextId()}a`,
                null,
                output1,
                _.AMENT1_MET_BY_USING_INV1_WITH_OBJ1,
                count,
                new Command(Verb.Use, Mix.InvVsProp, inv1, obj1),
                new Happenings('',
                  [new Happening(Happen.AchievementIsSet, newAchievement)]
                ),
                prerequisites,
                inputA1,
                inputB1
              ),
              this.path,
              true, // there's no file, its dynamic,
              box,
              this.aggregates
            )

            const inputA2 = newAchievement
            const output2 = inv2
            AddPiece(
              new Piece(
                `${GetNextId()}b`,
                null,
                output2,
                _.AUTO_INV1_BECOMES_INV2_VIA_AMENT1,
                count,
                new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                new Happenings(
                  '',
                  [new Happening(Happen.InvTransitions, inv1, inv2)]
                ),
                prerequisites,
                inputA2
              ),
              this.path,
              true, // there's no file, its dynamic
              box,
              this.aggregates
            )
            const inputA3 = newAchievement
            const inputB3 = obj1
            const output3 = obj2
            count = 10
            AddPiece(
              new Piece(
                `${GetNextId()}c`,
                null,
                output3,
                _.AUTO_OBJ1_BECOMES_OBJ2_VIA_AMENT1,
                count,
                new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                new Happenings(
                  '',
                  [new Happening(Happen.ObjTransitions, obj1, obj2)]
                ),
                prerequisites,
                inputA3,
                inputB3
              ),
              this.path,
              true, // there's no file, its dynamic,
              box,
              this.aggregates
            )
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
        case _.INV1_BECOMES_INV2_BY_KEEPING_OBJ1:
          happs.text = `Your ${inv1} has become a ${inv2}`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          // keeping obj1
          inputA = inv1
          output = inv2
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
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
        case _.INV1_OBTAINED_AS_GRABBED_OBJ1_BECOMES_OBJ2:
          happs.text = `Grabbing the ${obj1} allows you to obtain the ${inv1} ( and it becomes ${obj2}) `
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          output = inv1
          inputA = obj1
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          break
        case _.INV1_OBTAINED_AS_OBJ1_GRABBED_AND_OBJ2_BECOMES_OBJ3_GEN:
        {
          command = new Command(Verb.Grab, Mix.Prop, obj1)

          // we treat the inv1 as an invament
          AddPiece(
            new Piece(
                `${GetNextId()}h`,
                null,
                inv1, // <-- output
                _.AMENT1_MET_BY_GRABBING_OBJ_AND_GAINING_INV1,
                count,
                new Command(Verb.Grab, Mix.Inv, inv1),
                new Happenings(
                  `Grabbing the ${obj1} gains you the  ${inv1}`,
                  [
                    new Happening(Happen.AchievementIsSet, inv1),
                    new Happening(Happen.InvAppears, inv1)
                  ]
                ),
                prerequisites,
                obj1// <-- the input
            ),
            this.path,
            true, // there's no file, its dynamic,
            box,
            this.aggregates
          )

          AddPiece(
            new Piece(
                `${GetNextId()}i`,
                null,
                obj3, // <-- output 'as obj2 becomes obj3 '
                _.AUTO_OBJ1_BECOMES_OBJ2_VIA_AMENT1,
                count,
                new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                new Happenings(
                  `Grabbing the ${inv1} has a side-effect of making ${obj2} turn into ${obj3}`,
                  [new Happening(Happen.ObjTransitions, obj2, obj3)]
                ),
                prerequisites,
                inv1, // gaining inv1 is now met as an achievement (see preceding AddPiece)
                obj2 // <-- input 'as obj2 becomes obj3 ',
            ),
            this.path,
            true, // there's no file, its dynamic
            box,
            this.aggregates
          )
          continue
        }
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
        case _.INV1_OBTAINED_AS_OBJ1_BECOMES_OBJ2_KEEP_INV2:
          happs.text = `Using the ${inv2} on the ${obj1} allows you to obtain the ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          output = inv1
          inputA = inv2
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, obj1)
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
        case _.INV1_OBTAINED_BY_COMBINING_INV2_WITH_OBJ1:
          happs.text = `By using the ${inv1} with the ${obj1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          output = inv1
          inputA = inv2
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, obj1)
          break
        case _.INV1_OBTAINED_BY_INV2_WITH_OBJ1_LOSE_NONE:
          happs.text = `By using the ${inv2} with the ${obj1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          output = inv1
          inputA = inv2
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, obj1)
          break
        case _.INV1_OBTAINED_BY_LOSING_INV2_KEEPING_OBJ1:
          happs.text = `By using the ${inv2} with the ${obj1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvGoes, inv2))
          happs.array.push(new Happening(Happen.ObjStays, obj1))
          output = inv1
          inputA = inv2
          inputB = obj1
          command = new Command(Verb.Use, Mix.InvVsProp, inv2, obj1)
          break
        case _.INV1_OBTAINED_BY_LOSING_OBJ1_KEEPING_INV2:
          happs.text = `By using the ${inv2} with the ${obj1} you have obtained the ${inv1}.`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.InvStays, inv2))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          output = inv1
          inputA = inv2
          inputB = obj1
          command = new Command(Verb.Open, Mix.InvVsProp, inv2, obj1)
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
        case _.INV1_OBTAINED_BY_OBJ1_WITH_OBJ2_LOSE_OBJS:
          // eg obtain inv_meteor via radiation suit with the meteor.
          // ^^ this is nearly a two in one, but the radiation suit never becomes inventory: you wear it.
          happs.text = `You use the ${obj1} with the ${obj2} and obtain the ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjGoes, obj2))
          output = inv1
          inputA = obj1
          inputB = obj2
          command = new Command(Verb.Open, Mix.PropVsProp, obj1, obj2)
          break
        case _.INV1_OBTAINED_WHEN_LOSING_INV2_AND_OBJ1_BECOMES_OBJ2_GEN:
          {
            happs.text = `When you use the ${inv2} with the ${obj1}, you obtain an ${inv1} as the ${obj1} becomes a ${obj2}`
            happs.array.push(new Happening(Happen.InvGoes, inv2))
            happs.array.push(new Happening(Happen.InvAppears, inv1))
            happs.array.push(new Happening(Happen.ObjGoes, obj1))
            happs.array.push(new Happening(Happen.ObjAppears, obj2))

            const newAchievement = makeAchievementNameDeterministically(inv2, obj1)

            const inputA1 = inv2
            const inputB1 = obj1
            const output1 = newAchievement
            AddPiece(
              new Piece(
                `${GetNextId()}d`,
                null,
                output1,
                _.AMENT1_MET_BY_USING_INV1_WITH_OBJ1,
                count,
                new Command(Verb.Use, Mix.InvVsProp, inv1, obj1),
                new Happenings(
                  'AMENT1_MET_BY_USING_INV1_WITH_OBJ1',
                  [new Happening(Happen.AchievementIsSet, newAchievement)]
                ),
                prerequisites,
                inputA1,
                inputB1
              ),
              this.path,
              true, // there's no file, its dynamic
              box,
              this.aggregates
            )

            const inputA2 = newAchievement
            const output2 = inv1
            AddPiece(
              new Piece(
                `${GetNextId()}e`,
                null,
                output2,
                _.AUTO_INV1_OBTAINED_VIA_AMENT1,
                count,
                new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                new Happenings(
                  '',
                  [
                    new Happening(Happen.InvAppears, inv1),
                    new Happening(Happen.InvGoes, inv2)
                  ]
                ),
                prerequisites,
                inputA2
              ),
              this.path,
              true, // there's no file, its dynamic
              box,
              this.aggregates
            )
            const inputA3 = newAchievement
            const inputB3 = obj1
            const output3 = obj2
            AddPiece(
              new Piece(
                `${GetNextId()}f`,
                null,
                output3,
                _.AUTO_OBJ1_BECOMES_OBJ2_VIA_AMENT1,
                count,
                new Command(Verb.Auto, Mix.AutoNeedsNothing, ''),
                new Happenings(
                  '',
                  [
                    new Happening(Happen.ObjGoes, obj1),
                    new Happening(Happen.ObjAppears, obj2)
                  ]
                ),
                prerequisites,
                inputA3,
                inputB3
              ),
              this.path,
              true, // there's no file, its dynamic
              box,
              this.aggregates
            )
          }
          continue // since it does its own calls to AddPiece
        case _.OBJ1_APPEARS_BY_INV1_WITH_OBJ2:
          happs.text = `Using the ${inv1} with the ${obj2} has revealed a ${obj1}`
          happs.array.push(new Happening(Happen.ObjAppears, obj1))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj2))
          output = obj1
          inputA = inv1
          inputB = obj2
          command = new Command(Verb.Open, Mix.InvVsProp, inv1, obj2)
          break
        case _.OBJ1_APPEARS_BY_LOSING_INV1_WITH_OBJ2:
          happs.text = `Using the ${inv1} with the ${obj2} loses ${inv1} , but revaels a ${obj1}`
          happs.array.push(new Happening(Happen.ObjAppears, obj1))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj2))
          output = obj1
          inputA = inv1
          inputB = obj2
          command = new Command(Verb.Open, Mix.InvVsProp, inv1, obj2)
          break
        case _.OBJ1_APPEARS_WHEN_GRAB_OBJ2_WITH_AMENT1:
          happs.text = `You use the ${obj2} and, somewhere, a ${obj1} appears`
          happs.array.push(new Happening(Happen.ObjAppears, obj1))
          command = new Command(Verb.Open, Mix.Inv, inv2)
          output = obj1
          // the obj you grab (ie phone) must be input A - the solution creator
          // always constructs the solution as 'grab inputA'
          // so it needs to be input A
          inputA = obj2
          inputB = ament1
          break
        case _.OBJ1_APPEARS_WHEN_USE_INV1_WITH_OBJ2:
          happs.text = `You use the ${inv1} with the ${obj2} and the ${obj2} appears`
          happs.array.push(new Happening(Happen.ObjAppears, obj1))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          happs.array.push(new Happening(Happen.ObjStays, obj2))
          output = obj1
          // the obj you grab (ie phone) must be input A - the solution creator
          // always constructs the solution as 'grab inputA'
          // so it needs to be input A
          inputA = obj2
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj2)
          break
        case _.OBJ1_BECOMES_OBJ2_BY_KEEPING_INV1:
          happs.text = `You use the ${inv1}, and the ${obj1} becomes a ${inv2}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          inputA = obj1
          output = obj2
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.OBJ1_BECOMES_OBJ2_BY_KEEPING_OBJ3:
          happs.text = `You use the ${obj3}, and the ${obj1} becomes a ${obj2}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          inputA = obj1
          output = obj2
          inputB = obj3
          command = new Command(Verb.Use, Mix.PropVsProp, obj1, obj3)
          break
        case _.OBJ1_BECOMES_OBJ2_BY_LOSING_INV1:
          happs.text = `You use the ${inv1}, and the ${obj1} becomes a ${obj2}}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          inputA = obj1
          output = obj2
          inputB = inv1
          command = new Command(Verb.Use, Mix.InvVsProp, inv1, obj1)
          break
        case _.OBJ1_BECOMES_OBJ2_BY_LOSING_OBJ3:
          happs.text = `You use the ${obj3}, and the ${obj1} becomes a ${obj2}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          happs.array.push(new Happening(Happen.ObjGoes, obj3))
          inputA = obj1
          output = obj2
          inputB = obj3
          command = new Command(Verb.Use, Mix.PropVsProp, obj1, obj3)
          break
        case _.OBJ1_BECOMES_OBJ2_WHEN_GRAB_INV1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the obj you clicked on.  '\n You notice the ' + obj1 + ' has now become a ' + obj2
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          // This is a weird one, because there are two real-life outputs
          // but only one puzzle output. I forget how I was going to deal with this.
          inputA = obj1
          // const inputB, count = '' + reactionsFile.pieces[i].obj2
          output = inv1
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          break
        case _.OBJ1_CHANGES_STATE_TO_OBJ2_BY_KEEPING_INV1:
          happs.text = `You use the ${inv1}, and the ${obj1} is now ${AlleviateBrackets(
            obj2
          )}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          happs.array.push(new Happening(Happen.InvStays, inv1))
          inputA = obj1
          output = obj2
          inputB = inv1
          command = new Command(Verb.Open, Mix.InvVsProp, inv1, obj1)
          break
        case _.OBJ1_GOES_WHEN_GRAB_INV1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the obj you clicked on.  '\n You notice the ' + obj1 + ' has now become a ' + obj2
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          output = inv1
          inputA = obj1
          break
        case _.OBJ1_STAYS_WHEN_GRAB_INV1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the obj you clicked on.  '\n You now have a' + inv1
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = obj1
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          break
        case _.OBJ1_GOES_WHEN_GRAB_INV1_WITH_AMENT1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the obj you clicked on.  '\n You notice the ' + obj1 + ' has now become a ' + obj2
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          output = inv1
          inputA = obj1
          inputB = ament1
          break
        case _.OBJ1_STAYS_WHEN_GRAB_INV1_WITH_AMENT1:
          happs.text = `You now have a ${inv1}`
          // ly don't mention what happen to the obj you clicked on.  '\n You now have a' + inv1
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = obj1
          inputB = ament1
          command = new Command(Verb.Grab, Mix.Prop, obj1)
          break
        case _.CHAT_TO_OBJ1_GETS_INV1:
          happs.text = `You now have a ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = obj1
          command = new Command(Verb.Chat, Mix.Prop, obj1)
          break
        case _.CHAT_TO_OBJ1_WITH_AMENT1_GETS_INV1:
          happs.text = `You chated with achievement and now have a ${inv1}`
          happs.array.push(new Happening(Happen.InvAppears, inv1))
          output = inv1
          inputA = obj1
          inputB = ament1
          command = new Command(Verb.Chat, Mix.Prop, obj1)
          break
        case _.THROW_INV1_AT_OBJ1_GETS_INV2_LOSE_BOTH:
          happs.text = `Throw the ${inv1} at the ${obj1} gets you the ${inv2}.`
          happs.array.push(new Happening(Happen.InvGoes, inv1))
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.InvAppears, inv2))
          output = inv2
          inputA = obj1
          inputB = inv1
          command = new Command(Verb.Throw, Mix.InvVsProp, inv1, obj1)
          break
        case _.TOGGLE_OBJ1_BECOMES_OBJ2:
          happs.text = `The ${obj1} has become a ${obj2}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          inputA = obj1
          output = obj2
          command = new Command(Verb.Toggle, Mix.Prop, obj1)
          break
        case _.TOGGLE_OBJ1_CHANGES_STATE_TO_OBJ2:
          happs.text = `The ${obj1} is now ${AlleviateBrackets(obj2)}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          command = new Command(Verb.Toggle, Mix.Prop, obj1)
          inputA = obj1
          output = obj2
          break
        case _.TOGGLE_OBJ1_REVEALS_OBJ2_AS_IT_BECOMES_OBJ3:
          happs.text = `The ${obj1} becomes ${obj3} and reveals ${obj4}`
          happs.array.push(new Happening(Happen.ObjGoes, obj1))
          happs.array.push(new Happening(Happen.ObjAppears, obj2))
          happs.array.push(new Happening(Happen.ObjAppears, obj3))
          inputA = obj1
          output = obj2
          command = new Command(Verb.Toggle, Mix.Prop, obj1)
          break
        case 'AMENT1_MET_BY_GIVING_INV1_TO_OBJ1':
        default:
          console.error(
            `Fatal Error: We did not handle a pieceType that we're supposed to. Check to see if constant names are the same as their values in the schema. ${pieceType}`
          )
          return
      } // end switch
      AddPiece(
        new Piece(
          `${GetNextId()}g`,
          boxToMerge,
          output,
          pieceType,
          count,
          command,
          happs,
          prerequisites,
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
