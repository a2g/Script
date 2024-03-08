import { IdPrefixes } from '../../IdPrefixes'
import { AddBrackets } from './AddBrackets'
import { FormatText } from './FormatText'
import { Raw } from './Raw'

export class RawObjectsAndVerb {
  public type: Raw
  public objectA: string
  public objectB: string
  public output: string
  public startingCharacterForA: string
  public startingCharacterForB: string
  public restrictions: string[]
  public typeJustForDebugging: string
  public goalSpiel: string
  public mainSpiel: string
  public restrictionSpiel: string
  public speechLines: string[][]
  // other ideas for debugging fields to add
  // - the box the command came out of
  // - the id of the command

  constructor (
    type: Raw,
    objectA: string,
    objectB: string,
    output: string,
    restrictions: string[],
    speechLines: string[][],
    typeJustForDebugging: string
  ) {
    this.type = type
    this.objectA = objectA
    this.objectB = objectB
    this.output = output
    this.startingCharacterForA = ''
    this.startingCharacterForB = ''
    this.restrictions = restrictions
    this.mainSpiel = ''
    this.goalSpiel = ''
    this.restrictionSpiel = ''
    this.typeJustForDebugging = typeJustForDebugging
    this.speechLines = speechLines
  }

  public PopulateSpielFields (isColor = true): void {
    const verb = FormatText(this.type, isColor)
    const output = FormatText(this.output)
    const objectA =
      FormatText(this.objectA, isColor) +
      FormatText(this.startingCharacterForA, isColor, true)
    if (this.objectB === undefined) {
      this.dumpRaw()
    }
    const objectB =
      FormatText(this.objectB, isColor) +
      FormatText(this.startingCharacterForB, isColor, true)

    this.restrictionSpiel =
      this.restrictions.length > 0
        ? AddBrackets(FormatText(this.restrictions, isColor))
        : ''

    let joiner = ' '
    switch (this.type) {
      case Raw.Use:
        joiner = ' with '
        break
      case Raw.Toggle:
        joiner = ' to '
        break
      case Raw.Auto:
        if (this.objectB.startsWith(IdPrefixes.Inv)) {
          this.mainSpiel = `You obtain a ${objectB}`
          this.goalSpiel = `as a result of goal ${objectA}`
        } else if (this.objectB.startsWith(IdPrefixes.Prop)) {
          this.mainSpiel = `You now see a ${objectB}`
          this.goalSpiel = `as a result of goal ${objectA}`
        } else if (this.objectB.startsWith(IdPrefixes.Talk)) {
          this.mainSpiel = `You now see a chatty ${objectB}`
          this.goalSpiel = `as a result of goal ${objectA}`
        } else if (this.objectB.startsWith(IdPrefixes.Goal)) {
          this.type = Raw.Goal
          this.mainSpiel = `Goal met ${objectB}`
          this.goalSpiel = `as a result of goal ${objectA}`
        } else {
          this.mainSpiel = `${objectB} generically appears.... `
        }
        return
    }
    this.mainSpiel = verb + ' ' + objectA + joiner + objectB + ' gains you ' + output + ' '
  }

  public appendStartingCharacterForA (startingCharacterForA: string): void {
    if (this.startingCharacterForA.length > 0) {
      this.startingCharacterForA += ', ' + startingCharacterForA
    } else {
      this.startingCharacterForA = startingCharacterForA
    }
  }

  public appendStartingCharacterForB (startingCharacterForB: string): void {
    if (this.startingCharacterForB.length > 0) {
      this.startingCharacterForB += ', ' + startingCharacterForB
    } else {
      this.startingCharacterForB = startingCharacterForB
    }
  }

  public dumpRaw (): void {
    console.warn('Dumping instance of RawObjectsAndVerb')
    console.warn(Raw[this.type])
    console.warn(this.objectA)
    console.warn(this.objectB)
  }

  public isAGoalOrAuto (): boolean {
    return this.type === Raw.Goal || this.type === Raw.Auto
  }
}
