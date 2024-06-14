import { existsSync, readFileSync } from 'fs'
import { SingleFile } from './SingleFile'
import { Stringify } from './Stringify'
import { VisibleThingsMap } from './VisibleThingsMap'
import { parse } from 'jsonc-parser'
import { TalkFile } from './talk/TalkFile'
import { Piece } from './Piece'
import { GoalStubMap } from './GoalStubMap'
import { Aggregates } from './Aggregates'

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.jsonc file
 * so that's in there too.
 */
export class Box {
  public static GetArrayOfSingleObjectVerbs (): string[] {
    return ['grab', 'toggle']
  }

  public static GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return [true, true]
  }

  private readonly allProps: string[]

  private readonly allGoals: string[]

  private readonly goalWordSet: Set<string>

  private readonly allInvs: string[]

  private readonly allChars: string[]

  private readonly mapOfStartingThings: VisibleThingsMap

  private readonly startingInvSet: Set<string>

  private readonly startingPropSet: Set<string>

  private readonly startingGoalWordSet: Set<string>

  private readonly filename: string

  private readonly path: string

  private readonly pieces: Map<string, Set<Piece>>

  private readonly talkFiles: Map<string, TalkFile>

  private readonly aggregates: Aggregates

  constructor (path: string, filenames: string[], aggregates: Aggregates) {
    this.aggregates = aggregates
    this.path = path
    this.talkFiles = new Map<string, TalkFile>()
    this.filename = filenames[0]

    this.allProps = []
    this.allGoals = []
    this.allInvs = []
    this.allChars = []
    /* preen starting invs from the startingThings */
    this.startingInvSet = new Set<string>()
    this.startingGoalWordSet = new Set<string>()
    this.startingPropSet = new Set<string>()
    this.goalWordSet = new Set<string>()
    this.mapOfStartingThings = new VisibleThingsMap(null)
    this.pieces = new Map<string, Set<Piece>>()
    this.talkFiles = new Map<string, TalkFile>()

    // this is a bit hacky, but we need
    if (filenames.length > 1) {
      for (const filename of filenames) {
        let box = aggregates.mapOfBoxes.get(filename)
        if (box == null) {
          box = new Box(path, [filename], aggregates)
        }
        Box.CopyPiecesFromAtoB(box.pieces, this.pieces)
        box.goalWordSet.forEach(x => this.goalWordSet.add(x))
        Box.CopyTalksFromAtoB(box.talkFiles, this.talkFiles)
        Box.CopyPiecesFromAtoB(box.pieces, this.pieces)
        box.mapOfStartingThings.CopyTo(this.mapOfStartingThings)
      }
    } else if (filenames.length === 1) {
      const filename = filenames[0]
      this.aggregates.mapOfBoxes.set(filename, this)
      const box1 = this.aggregates.mapOfBoxes.get(filename)
      console.assert(box1 !== null)
      this.aggregates.mapOfBoxes.set(filename, this)
      if (!existsSync(path + filename)) {
        throw new Error(
          `file doesn't exist ${process.cwd()} ${path}${filename} `
        )
      }
      const text = readFileSync(path + filename, 'utf8')
      const scenario = parse(text)

      /* this loop is only to ascertain all the different */
      /* possible object names. ie basically all the enums */
      /* but without needing the enum file */
      const setProps = new Set<string>()
      const setGoals = new Set<string>()
      const setInvs = new Set<string>()
      const setChars = new Set<string>()
      for (const gate of scenario.pieces) {
        setInvs.add(Stringify(gate.inv1))
        setInvs.add(Stringify(gate.inv2))
        setInvs.add(Stringify(gate.inv3))
        setGoals.add(Stringify(gate.goal1))
        setGoals.add(Stringify(gate.goal2))
        setProps.add(Stringify(gate.prop1))
        setProps.add(Stringify(gate.prop2))
        setProps.add(Stringify(gate.prop3))
        setProps.add(Stringify(gate.prop4))
        setProps.add(Stringify(gate.prop5))
        setProps.add(Stringify(gate.prop6))
        setProps.add(Stringify(gate.prop7))
      }

      /* starting things is optional in the json */
      if (
        scenario.startingThings !== undefined &&
        scenario.startingThings !== null
      ) {
        for (const thing of scenario.startingThings) {
          if (thing.character !== undefined && thing.character !== null) {
            setChars.add(thing.character)
          }
        }
      }

      /* collect all the goals and pieces file */
      const singleFile = new SingleFile(this.path, filename, this.aggregates)
      singleFile.copyAllPiecesToContainers(this)

      /* starting things is optional in the json */
      if (
        scenario.startingThings !== undefined &&
        scenario.startingThings !== null
      ) {
        for (const thing of scenario.startingThings) {
          const theThing = Stringify(thing.thing)
          if (theThing.startsWith('inv')) {
            this.startingInvSet.add(theThing)
          }
          if (theThing.startsWith('goal')) {
            this.startingGoalWordSet.add(theThing)
          }
          if (theThing.startsWith('prop')) {
            this.startingPropSet.add(theThing)
          }
        }
        for (const item of scenario.startingThings) {
          if (!this.mapOfStartingThings.Has(item.thing)) {
            this.mapOfStartingThings.Set(item.thing, new Set<string>())
          }
          if (item.character !== undefined && item.character !== null) {
            const { character } = item
            const setOfCharacters = this.mapOfStartingThings.Get(item.thing)
            if (character.length > 0 && setOfCharacters != null) {
              setOfCharacters.add(character)
            }
          }
        }
      }

      setChars.delete('')
      setChars.delete('undefined')
      setProps.delete('')
      setProps.delete('undefined')
      setGoals.delete('')
      setGoals.delete('undefined')
      setInvs.delete('')
      setInvs.delete('undefined')
      this.allProps = Array.from(setProps.values())
      this.allGoals = Array.from(setGoals.values())
      this.allInvs = Array.from(setInvs.values())
      this.allChars = Array.from(setChars.values())
    }
  }

  public CopyStartingThingCharsToGivenMap (givenMap: VisibleThingsMap): void {
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      givenMap.Set(item[0], item[1])
    }
  }

  public GetArrayOfProps (): string[] {
    return this.allProps
  }

  public GetArrayOfInvs (): string[] {
    return this.allInvs
  }

  public GetArrayOfGoals (): string[] {
    return this.allGoals
  }

  public GetArrayOfSingleObjectVerbs (): string[] {
    return this.GetArrayOfSingleObjectVerbs()
  }

  public GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs()
  }

  public GetArrayOfInitialStatesOfGoals (): number[] {
    /* construct array of booleans in exact same order as ArrayOfProps - so they can be correlated */
    const startingSet = this.startingGoalWordSet
    const initialStates: number[] = []
    for (const goal of this.allGoals) {
      const isNonZero = startingSet.has(goal)
      initialStates.push(isNonZero ? 1 : 0)
    }
    return initialStates
  }

  public GetSetOfStartingProps (): Set<string> {
    return this.startingPropSet
  }

  public GetSetOfStartingInvs (): Set<string> {
    return this.startingInvSet
  }

  public GetMapOfAllStartingThings (): VisibleThingsMap {
    return this.mapOfStartingThings
  }

  // public GetStartingThingsForCharacter(charName: string): Set<string> {

  public GetArrayOfInitialStatesOfProps (): boolean[] {
    /* construct array of booleans in exact same order as ArrayOfProps - so they can be correlated */
    const startingSet = this.GetSetOfStartingProps()
    const visibilities: boolean[] = []
    for (const prop of this.allProps) {
      const isVisible = startingSet.has(prop)
      visibilities.push(isVisible)
    }
    return visibilities
  }

  public GetArrayOfInitialStatesOfInvs (): boolean[] {
    /* construct array of booleans in exact same order as ArrayOfProps - so they can be correlated */
    const startingSet = this.GetSetOfStartingInvs()
    const visibilities: boolean[] = []
    for (const inv of this.allInvs) {
      const isVisible = startingSet.has(inv)
      visibilities.push(isVisible)
    }
    return visibilities
  }

  public GetArrayOfCharacters (): string[] {
    return this.allChars
  }

  public GetFilename (): string {
    return this.filename
  }

  public AddTalkFile (talkFile: TalkFile): void {
    this.talkFiles.set(talkFile.GetName(), talkFile)
  }

  public GetSetOfGoalWords (): Set<string> {
    return this.goalWordSet
  }

  public GetPieceIterator (): IterableIterator<Set<Piece>> {
    return this.pieces.values()
  }

  public CopyGoalStubsToGivenGoalStubMap (destinationGoalStubMap: GoalStubMap): void {
    for (const goalStub of this.goalWordSet) {
      destinationGoalStubMap.AddGoalStub(goalStub)
    }
  }

  public static CopyPiecesFromAtoBViaIds (a: Map<string, Set<Piece>>, b: Map<string, Piece>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        b.set(piece.id, piece)
      })
    })
  }

  public static CopyPiecesFromAtoB (a: Map<string, Set<Piece>>, b: Map<string, Set<Piece>>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (!b.has(piece.output)) {
          b.set(piece.output, new Set<Piece>())
        }
        b.get(piece.output)?.add(piece)
      })
    })
  }

  public static CopyTalksFromAtoB (a: Map<string, TalkFile>, b: Map<string, TalkFile>): void {
    for (const talk of a.values()) {
      b.set(talk.GetName(), talk)
    }
  }

  GetTalkFiles (): Map<string, TalkFile> {
    return this.talkFiles
  }

  public Get (givenOutput: string): Set<Piece> | undefined {
    return this.pieces.get(givenOutput)
  }

  public GetPieces (): Map<string, Set<Piece>> {
    return this.pieces
  }

  public GetStartingThingsForCharacter (charName: string): Set<string> {
    const startingThingSet = new Set<string>()
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      for (const name of item[1]) {
        if (name === charName) {
          startingThingSet.add(item[0])
          break
        }
      }
    }
    return startingThingSet
  }

  GetStartersMapOfAllStartingThings (): VisibleThingsMap {
    const starter = this.aggregates.mapOfBoxes.get('starter.jsonc')
    if (starter != null) {
      return starter.mapOfStartingThings
    }
    return new VisibleThingsMap(null)
  }

  GetStartingPieces (): Map<string, Set<Piece>> {
    const starter = this.aggregates.mapOfBoxes.get('starter.jsonc')
    if (starter != null) {
      return starter.pieces
    }
    return new Map<string, Set<Piece>>()
  }

  GetStartingTalkFiles (): Map<string, TalkFile> {
    const starter = this.aggregates.mapOfBoxes.get('starter.jsonc')
    if (starter != null) {
      return starter.talkFiles
    }
    return new Map<string, TalkFile>()
  }

  GetPiecesAsString (): string {
    let stringOfPieceIds = ''
    for (const set of this.pieces.values()) {
      for (const piece of set) {
        stringOfPieceIds += `${piece.id}, `
      }
    }
    return stringOfPieceIds
  }

  public FillStoresWithBoxMapData (mapOfBoxes: Map<string, Box>): void {
    for (const box of mapOfBoxes.values()) {
      if (box.filename !== this.filename) {
        Box.CopyPiecesFromAtoB(box.pieces, this.pieces)
        Box.CopyTalksFromAtoB(box.talkFiles, this.talkFiles)
        box.goalWordSet.forEach(x => this.goalWordSet.add(x))
        box.mapOfStartingThings.CopyTo(this.mapOfStartingThings)
      }
    }
  }
}
