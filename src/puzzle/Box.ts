import { existsSync, readFileSync } from 'fs'
import { SingleFile } from './SingleFile'
import { Stringify } from './Stringify'
import { VisibleThingsMap } from './VisibleThingsMap'
import { parse } from 'jsonc-parser'
import { TalkFile } from './talk/TalkFile'
import { Piece } from './Piece'
import { IsPieceOutputtingAGoal } from './IsPieceOutputtingAGoal'
import { GoalWordMap } from './GoalWordMap'

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

  private readonly setOfGoalWords: Set<string>

  private readonly allInvs: string[]

  private readonly allChars: string[]

  private readonly mapOfStartingThings: VisibleThingsMap

  private readonly startingInvSet: Set<string>

  private readonly startingPropSet: Set<string>

  private readonly startingGoalSet: Set<string>

  private readonly filename: string

  private readonly path: string

  public readonly piecesMappedByOutput: Map<string, Set<Piece>>

  private readonly displayName: string
  private readonly mapOfTalks: Map<string, TalkFile>

  constructor (path: string, filenames: string[], set: Set<string>, map: Map<string, Box>) {
    this.path = path
    this.mapOfTalks = new Map<string, TalkFile>()
    this.filename = filenames[0]

    const setProps = new Set<string>()
    const setGoals = new Set<string>()
    const setInvs = new Set<string>()
    const setChars = new Set<string>()

    for (const filename of filenames) {
      if (!existsSync(path + filename)) {
        throw new Error(
          `file doesn't exist ${process.cwd()} ${path}${filename} `
        )
      }
      const text = readFileSync(path + filename, 'utf8')
      const scenario = parse(text)

      // this loop is only to ascertain all the different
      // possible object names. ie basically all the enums
      // but without needing the enum file
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
      // starting things is optional in the json
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
    // preen starting invs from the startingThings
    this.startingInvSet = new Set<string>()
    this.startingGoalSet = new Set<string>()
    this.startingPropSet = new Set<string>()
    this.setOfGoalWords = new Set<string>()
    this.mapOfStartingThings = new VisibleThingsMap(null)
    this.displayName = filenames[0]
    this.piecesMappedByOutput = new Map<string, Set<Piece>>()
    this.mapOfTalks = new Map<string, TalkFile>()

    for (const filename of filenames) {
      if (!existsSync(path + filename)) {
        throw new Error(
          `file doesn't exist ${process.cwd()} ${path}${filename} `
        )
      }
      const text = readFileSync(path + filename, 'utf8')
      const scenario = parse(text)

      // collect all the goals and pieces file
      const singleFile = new SingleFile(this.path, filename, set, map)
      singleFile.copyAllPiecesToContainer(this)

      // starting things is optional in the json
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
            this.startingGoalSet.add(theThing)
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
            const array = this.mapOfStartingThings.Get(item.thing)
            if (character.length > 0 && array != null) {
              array.add(character)
            }
          }
        }
      }
    }
  }

  public CopyStartingPropsToGivenSet (givenSet: Set<string>): void {
    for (const prop of this.startingPropSet) {
      givenSet.add(prop)
    }
  }

  public CopyStartingGoalsToGivenSet (givenSet: Set<string>): void {
    for (const goal of this.startingGoalSet) {
      givenSet.add(goal)
    }
  }

  public CopyStartingInvsToGivenSet (givenSet: Set<string>): void {
    for (const inv of this.startingInvSet) {
      givenSet.add(inv)
    }
  }

  public CopyStartingThingCharsToGivenMap (givenMap: VisibleThingsMap): void {
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      givenMap.Set(item[0], item[1])
    }
  }

  public CopyPropsToGivenSet (givenSet: Set<string>): void {
    for (const prop of this.allProps) {
      givenSet.add(prop)
    }
  }

  public CopyGoalsToGivenSet (givenSet: Set<string>): void {
    for (const goal of this.allGoals) {
      givenSet.add(goal)
    }
  }

  public CopyGoalWordsToGivenSet (givenSet: Set<string>): void {
    for (const goal of this.setOfGoalWords) {
      givenSet.add(goal)
    }
  }

  public CopyInvsToGivenSet (givenSet: Set<string>): void {
    for (const inv of this.allInvs) {
      givenSet.add(inv)
    }
  }

  public CopyCharsToGivenSet (givenSet: Set<string>): void {
    for (const character of this.allChars) {
      givenSet.add(character)
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
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingGoals()
    const initialStates: number[] = []
    for (const goal of this.allGoals) {
      const isNonZero = startingSet.has(goal)
      initialStates.push(isNonZero ? 1 : 0)
    }
    return initialStates
  }

  public GetSetOfStartingGoals (): Set<string> {
    return this.startingGoalSet
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

  public GetArrayOfInitialStatesOfProps (): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
    const startingSet = this.GetSetOfStartingProps()
    const visibilities: boolean[] = []
    for (const prop of this.allProps) {
      const isVisible = startingSet.has(prop)
      visibilities.push(isVisible)
    }
    return visibilities
  }

  public GetArrayOfInitialStatesOfInvs (): boolean[] {
    // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
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

  public GetPath (): string {
    return this.path
  }

  public AddTalkFile (talkFile: TalkFile): void {
    this.mapOfTalks.set(talkFile.GetName(), talkFile)
  }

  public GetSetOfGoalWords (): Set<string> {
    return this.setOfGoalWords
  }

  public AddPiece (piece: Piece, folder = '', isNoFile = true, aggregateGoalWords: Set<string>, mapOfBoxes: Map<string, Box>): void {
    if (IsPieceOutputtingAGoal(piece)) {
      const goal1 = piece.output
      this.setOfGoalWords.add(goal1)
      aggregateGoalWords.add(goal1)
      if (goal1 !== 'x_win' && !isNoFile) {
        const file = `${goal1}.jsonc`
        if (!existsSync(folder + file)) {
          throw new Error(
            `Ensure "isNoFile" needs to be marked for goal ${goal1} of ${piece.type} in ${goal1}, because the following file doesn't exist ${folder}`
          )
        }

        let box = mapOfBoxes.get(file)
        if (box == null) {
          // this map not only collects all the boxes
          // but prevents two pieces that output same goal from
          // processing the same file
          box = new Box(folder, [file], aggregateGoalWords, mapOfBoxes)
          mapOfBoxes.set(file, box)
        }
        piece.boxToMerge = box
      }
    }

    // initialize array, if it hasn't yet been
    if (!this.piecesMappedByOutput.has(piece.output)) {
      this.piecesMappedByOutput.set(piece.output, new Set<Piece>())
    }
    // always add to list
    this.piecesMappedByOutput.get(piece.output)?.add(piece)
  }

  public GetSinglePieceById (idToMatch: number): Piece | null {
    for (const set of this.piecesMappedByOutput.values()) {
      for (const piece of set) {
        if (piece.id === idToMatch) {
          return piece
        }
      }
    }
    return null
  }

  public Size (): number {
    let count = 0
    for (const set of this.piecesMappedByOutput.values()) {
      count += set.size
    }
    return count
  }

  public Has (givenOutput: string): boolean {
    return this.piecesMappedByOutput.has(givenOutput)
  }

  public Get (givenOutput: string): Set<Piece> | undefined {
    return this.piecesMappedByOutput.get(givenOutput)
  }

  public GetPieceIterator (): IterableIterator<Set<Piece>> {
    return this.piecesMappedByOutput.values()
  }

  public CopyGoalWordsToGivenGoalWordMap (destinationGoalWordMap: GoalWordMap): void {
    for (const goalWord of this.setOfGoalWords) {
      destinationGoalWordMap.AddGoalWord(goalWord)
    }
  }

  public static CopyPiecesFromAtoB (a: Map<string, Set<Piece>>, b: Map<string, Set<Piece>>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (b.has(piece.output)) {
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

  public ReplaceInputsThatMatchAWithB (a: string, b: string): number {
    let numberOfPiecesStubbed = 0
    this.piecesMappedByOutput.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((unusedPiece: Piece) => {
        for (let k = 0; k < unusedPiece.inputHints.length; k++) {
          if (unusedPiece.inputHints[k] === a) {
            console.log(`Stubbed out ${a} in ${unusedPiece.type} in ${this.displayName}`)
            unusedPiece.inputHints[k] = b
            numberOfPiecesStubbed += 1
          }
        }
      })
    })
    return numberOfPiecesStubbed
  }

  GetTalks (): Map<string, TalkFile> {
    return this.mapOfTalks
  }
}

/*

 if (cloneFromMe != null) {
      for (const talk of cloneFromMe.GetTalkIterator()) {
        const clone = talk.Clone()
        this.mapOfTalks.set(talk.GetName(), clone)
      }
      for (const set of cloneFromMe.GetPieceIterator()) {
        if (set.size > 0) {
          const clonedSet = new Set<Piece>()
          let outputName = ''
          for (const piece of set) {
            const clonedPiece = piece.ClonePieceAndEntireTree()
            clonedSet.add(clonedPiece)
            outputName = clonedPiece.output
          }
          this.piecesMappedByOutput.set(outputName, clonedSet)
        }
      }
    } */
