
# puzzle-pieces

A puzzle solving algorithm, for side quests, and adventure games. Includes a yack-like json schema for when dialog trees are an essential part of the quest.

![Alternate text](piece.svg)

## Puzzle Pieces

The pieces have one output and multiple inputs.

An output can be either an:

- inventory item - item that can be carried
- prop - item that is a fixture in the location its in
- goal

The inputs are also any of the above.

For example "macaroni" + "cheese" becomes "macaroni and cheese" - where "macaroni and cheese" is the output and the inputs are "macaroni" and "cheese".

## How solving Solving is done

Pieces are defined in .jsonc files.
The solver initially loads starter.jsonc,
then starts finding a solution using:

- all the pieces in the box
- all the talk files - referenced by pieces in the box.
- the things - both props and the things the characters start with.
- goals referenced in outputs of pieces in the box, as starting hints

``` typescript
 const solution1 = Solution.createSolution(
      box.GetPieces(),
      box.GetTalkFiles(),
      box.GetMapOfAllStartingThings(),
      this.CreateRootMapFromGoalWords(box.GetSetOfGoalWords()),
      this.isMergeBoxToBeCalled
    )
```

Once the solver comes to a point where two or more pieces can be inserted to a given input, then solution is cloned to ensure there is a solution for each alternative.

When a goal is solved, if there exists a file named after that goal, then it will be merged in to the solution.

``` typescript
public MergeBox (boxToMerge: Box): void {
    Box.CopyPiecesFromAtoB(boxToMerge.GetPiecesMappedByOutput(), this.remainingPieces)
    Box.CopyTalksFromAtoB(boxToMerge.GetTalkFiles(), this.talks)
    boxToMerge.CopyGoalWordsToGivenGoalWordMap(this.goalWords)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
  }
```

And then its just a case of repeating the solving, cloning and merging - until all solutions have been solved

``` typescript
    solver.SolvePartiallyUntilCloning()
    solver.MarkGoalsAsCompletedAndMergeIfNeeded()
```

The only real complexity comes in the amount of pieces in teh box files that are pre=processed - with some single pieces generating multiple pieces to exist in its place.

- Pieces with two outputs: Sometimes these are necessary. To facilitate this there exist some special piece types that can be easily split up in to a system of single output pieces.
- Talk pieces: Talk pieces simply reference a talk file. This talk file is processed, and pieces are generated for every output that can be gained from that conversation.

## Build

```sh
npm run build
```

## Command line interface

```sh
npm run cli
```

## Run vue frontend

```sh
cd vuelve
yarn
yarn serve
```

## Run node.js backend

```sh
yarn
yarn start
```
