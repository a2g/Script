import { readFileSync } from 'fs';
import _ from '../../jigsaw.json';
import { AlleviateBrackets } from './AlleviateBrackets';
import { Box } from './Box';
import { Happen } from './Happen';
import { Happening } from './Happening';
import { Happenings } from './Happenings';
import { IPileOrRootPieceMap } from './IPileOrRootPieceMap';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Piece } from './Piece';
import { Stringify } from './Stringify';
import {parse} from 'jsonc-parser'
/**
 * Yup, this is the one location of these
 * And when the pieces are cloned, these ids get cloned too
 */
let globalId = 1;
export function SingleBigSwitch(
  path: string,
  filename: string,
  objects: MixedObjectsAndVerb,
  isGoalRetrieval: boolean,
  piecesMappedByOutput: IPileOrRootPieceMap | null
): Happenings | null {
  const text = readFileSync(path + filename, 'utf-8');
  const scenario = parse(text);
  for (const piece of scenario.pieces) {
    const id1 = globalId;
    globalId += 1;
    for (let i = 0; i < 1; i += 1) {
      const pieceType: string = piece.piece;
      let count = 1;
      if (piece.count !== undefined) {
        count = piece.count;
      }
      const prop1 = Stringify(piece.prop1);
      const prop2 = Stringify(piece.prop2);
      const prop3 = Stringify(piece.prop3);
      const prop4 = Stringify(piece.prop4);
      const prop5 = Stringify(piece.prop5);
      const prop6 = Stringify(piece.prop6);
      const prop7 = Stringify(piece.prop7);
      const goal1 = Stringify(piece.goal1);
      const goal2 = Stringify(piece.goal2);
      const goal3 = Stringify(piece.goal3);
      const goal4 = Stringify(piece.goal4);
      const goal5 = Stringify(piece.goal5);
      const goal6 = Stringify(piece.goal6);
      const inv1 = Stringify(piece.inv1);
      const inv2 = Stringify(piece.inv2);
      const inv3 = Stringify(piece.inv3);
      const isMergeNeeded = piece.isMergeNeeded;
      const happs = new Happenings();
      const { restrictions } = piece;
      if (
        pieceType.startsWith('GOAL1_MET') ||
        pieceType.startsWith('AUTO_GOAL1_MET')
      ) {
        if (isGoalRetrieval || piecesMappedByOutput == null) {
          let merge: Box | null = null;
          if (isMergeNeeded) {
            merge = new Box(path, `${goal1}.jsonc`);
          }
          switch (pieceType) {
            case _.AUTO_GOAL1_MET_BY_GOALS:
              if (piecesMappedByOutput != null) {
                const output = goal1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    goal2,
                    goal3,
                    goal4,
                    goal5,
                    goal6
                  )
                );
              }
              break;
            case _.AUTO_GOAL1_MET_BY_PROPS:
              if (piecesMappedByOutput != null) {
                const output = goal1;
                const input1 = prop1;
                const input2 = prop2;
                const input3 = prop3;
                const input4 = prop4;
                const input5 = prop5;
                const input6 = prop6;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    input1,
                    input2,
                    input3,
                    input4,
                    input5,
                    input6
                  )
                );
              }
              break;
            case _.AUTO_GOAL1_MET_BY_INVS:
              if (piecesMappedByOutput != null) {
                const output = goal1;
                const input1 = inv1;
                const input2 = inv2;
                const input3 = inv3;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    input1,
                    input2,
                    input3
                  )
                );
              }
              break;
            case _.GOAL1_MET_BY_KEEPING_INV1_WHEN_USED_WITH_PROP1:
              happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`;
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              happs.array.push(new Happening(Happen.InvStays, inv1));
              happs.array.push(new Happening(Happen.PropStays, prop1));
              if (piecesMappedByOutput != null) {
                const output = goal1;
                const inputA = inv1;
                const inputB = prop1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Use', inv1, prop1)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_LOSING_INV1_WHEN_USED_WITH_PROP1:
              happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`;
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              happs.array.push(new Happening(Happen.InvGoes, inv1));
              happs.array.push(new Happening(Happen.PropStays, prop1));
              if (piecesMappedByOutput != null) {
                const output = goal1;
                const inputA = inv1;
                const inputB = prop1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Use', inv1, prop1)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_LOSING_INV1_USED_WITH_PROP1_AND_PROPS:
              happs.text = `With everything set up correctly, you use the ${inv1} with the ${prop1} and something good happens...`;
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              happs.array.push(new Happening(Happen.InvGoes, inv1));
              happs.array.push(new Happening(Happen.PropStays, prop1));
              if (prop2.length > 0) {
                happs.array.push(new Happening(Happen.PropStays, prop2));
              }
              if (prop3.length > 0) {
                happs.array.push(new Happening(Happen.PropStays, prop3));
              }
              if (piecesMappedByOutput != null) {
                const output = goal1;
                const inputA = inv1;
                const inputB = prop1;
                const inputC = prop2;
                const inputD = prop3;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB,
                    inputC,
                    inputD
                  )
                );
              } else if (objects.Match('Use', inv1, prop1)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_USING_INV1_WITH_INV2:
              happs.text = `You use the ${inv1} with the ${inv2} and something good happens...`;
              happs.array.push(new Happening(Happen.InvStays, inv1));
              happs.array.push(new Happening(Happen.InvStays, inv2));
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              if (piecesMappedByOutput != null) {
                const inputA = inv1;
                const inputB = inv2;
                const output = goal1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Use', inv1, inv2)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_USING_INV1_WITH_PROP1:
              happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`;
              happs.array.push(new Happening(Happen.InvStays, inv1));
              happs.array.push(new Happening(Happen.PropStays, prop1));
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              if (piecesMappedByOutput != null) {
                const inputA = inv1;
                const inputB = prop1;
                const output = goal1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Use', inv1, prop1)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_USING_INV1_WITH_PROP1_LOSE_PROPS:
              happs.text = `You use the ${inv1} with the  ${prop1} and something good happens...`;
              happs.array.push(new Happening(Happen.InvStays, inv1));
              happs.array.push(new Happening(Happen.PropGoes, prop1));
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              if (piecesMappedByOutput != null) {
                const inputA = inv1;
                const inputB = prop1;
                const output = goal1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Use', inv1, prop1)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_USING_INV1_WITH_PROP1_NEED_GOALS:
              happs.text = `You use the ${inv1} with the  ${prop1} and something good happens...`;
              happs.array.push(new Happening(Happen.InvStays, inv1));
              happs.array.push(new Happening(Happen.PropStays, prop1));
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              if (piecesMappedByOutput != null) {
                const output = goal1;
                const inputA = inv1;
                const inputB = prop1;
                const inputC = goal2;
                const inputD = goal3;
                const inputE = goal4;
                const inputF = goal5;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB,
                    inputC,
                    inputD,
                    inputE,
                    inputF
                  )
                );
              } else if (objects.Match('Use', inv1, prop1)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_USING_PROP1_WITH_PROP2:
              happs.text = `You use the ${prop1} with the ${prop2} and something good happens...`;
              happs.array.push(new Happening(Happen.PropStays, prop1));
              happs.array.push(new Happening(Happen.PropStays, prop2));
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              if (piecesMappedByOutput != null) {
                const inputA = prop1;
                const inputB = prop2;
                const output = goal1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Use', prop1, prop2)) {
                return happs;
              }
              break;
            case _.GOAL1_MET_BY_GIVING_INV1_TO_PROP1:
              happs.text = `Goal is set ${goal1}`;
              happs.array.push(new Happening(Happen.InvGoes, inv1));
              happs.array.push(new Happening(Happen.PropStays, prop1));
              happs.array.push(new Happening(Happen.GoalIsSet, goal1));
              if (piecesMappedByOutput != null) {
                const inputA = inv1;
                const inputB = prop1;
                const output = goal1;
                piecesMappedByOutput.AddPiece(
                  new Piece(
                    id1,
                    merge,
                    output,
                    pieceType,
                    count,
                    happs,
                    restrictions,
                    inputA,
                    inputB
                  )
                );
              } else if (objects.Match('Give', inv1, prop1)) {
                return happs;
              }
              break;
            default:
              break;
          }
        }
      } else if (!isGoalRetrieval || piecesMappedByOutput == null) {
        switch (pieceType) {
          case _.AUTO_PROP1_BECOMES_PROP2_BY_PROPS:
            if (piecesMappedByOutput != null) {
              const input1 = prop1;
              const output = prop2;
              const input2 = prop3;
              const input3 = prop4;
              const input4 = prop5;
              const input5 = prop6;
              const input6 = prop7;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input1,
                  input2,
                  input3,
                  input4,
                  input5,
                  input6
                )
              );
            }
            break;
          case _.AUTO_INV1_BECOMES_INV2_VIA_GOAL1:
            if (piecesMappedByOutput != null) {
              const input1 = goal1;
              const input2 = inv1;
              const output = inv2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input1,
                  input2
                )
              );
            }
            break;
          case _.AUTO_PROP1_BECOMES_PROP2_VIA_GOAL1:
            if (piecesMappedByOutput != null) {
              const input1 = goal1;
              const input2 = prop1;
              const output = prop2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input1,
                  input2
                )
              );
            }
            break;
          case _.AUTO_PROP1_APPEARS_VIA_GOAL1:
            if (piecesMappedByOutput != null) {
              const output = prop1;
              const input1 = goal1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input1
                )
              );
            }
            break;
          case _.AUTO_INV1_OBTAINED_VIA_GOAL1:
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const input1 = goal1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input1
                )
              );
            }
            break;
          case _.EXAMINE_PROP1_YIELDS_INV1:
            happs.text = `You examine the ${prop1} and find a ${inv1}`;
            // ly don't mention what happen to the prop you clicked on.  "\n You now have a" + inv1;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA
                )
              );
            } else if (objects.Match('Examine', prop1, '')) {
              return happs;
            }
            break;
          case _.GIVE_INV1_TO_PROP1_GETS_INV2:
            happs.text = `You give the ${inv1} to the ${prop1} and you get the ${inv2} in return`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.InvAppears, inv2));
            happs.array.push(new Happening(Happen.PropStays, prop1));
            if (piecesMappedByOutput != null) {
              // keeping prop1
              const inputA = inv1;
              const inputB = prop1;
              const output = inv2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Give', inv1, prop1)) {
              return happs;
            }
            break;
          case _.INV1_AND_INV2_COMBINE_TO_FORM_INV3:
            happs.text = `The ${inv1} and the ${inv2} combine to form an ${inv3}`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.InvGoes, inv2));
            happs.array.push(new Happening(Happen.InvAppears, inv3));
            if (piecesMappedByOutput != null) {
              // losing all
              const inputA = inv1;
              const inputB = inv2;
              const output = inv3;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, inv2)) {
              return happs;
            }
            break;
          case _.INV1_AND_INV2_GENERATE_AN_INV3:
            happs.text = `The ${inv1} and the ${inv2} has generated an ${inv3}`;
            happs.array.push(new Happening(Happen.InvStays, inv1));
            happs.array.push(new Happening(Happen.InvStays, inv2));
            happs.array.push(new Happening(Happen.InvAppears, inv3));
            if (piecesMappedByOutput != null) {
              // losing none
              const inputA = inv1;
              const inputB = inv2;
              const output = inv3;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, inv2)) {
              return happs;
            }
            break;
          case _.INV1_BECOMES_INV2_BY_KEEPING_INV3:
            happs.text = `Your ${inv1} has become a ${inv2}`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.InvAppears, inv2));
            happs.array.push(new Happening(Happen.InvStays, inv3));
            if (piecesMappedByOutput != null) {
              // losing inv
              const inputA = inv1;
              const output = inv2;
              const inputB = inv3;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, inv3)) {
              return happs;
            }
            break;
          case _.INV1_BECOMES_INV2_BY_KEEPING_PROP1:
            happs.text = `Your ${inv1} has become a ${inv2}`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.InvAppears, inv2));
            happs.array.push(new Happening(Happen.PropStays, prop1));
            if (piecesMappedByOutput != null) {
              // keeping prop1
              const inputA = inv1;
              const output = inv2;
              const inputB = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, prop1)) {
              return happs;
            }
            break;
          case _.INV1_BECOMES_INV2_BY_LOSING_INV3:
            happs.text = `The ${inv1} has become a  ${inv2}`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.InvAppears, inv2));
            happs.array.push(new Happening(Happen.InvGoes, inv3));
            if (piecesMappedByOutput != null) {
              // losing inv
              const inputA = inv1;
              const output = inv2;
              const inputB = inv3;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, inv3)) {
              return happs;
            }
            break;
          case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
            happs.text = `Using the ${inv1} with the ${prop1} has revealed a ${prop2}`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.PropStays, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            if (piecesMappedByOutput != null) {
              const inputA = inv1;
              const inputB = prop1;
              const output = prop2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, prop1)) {
              return happs;
            }
            break;
          case _.OBTAIN_INV1_BY_INV2_WITH_PROP1_LOSE_BOTH:
            happs.text = `By using the ${inv1} with the ${prop1} you have obtained the ${inv1}.`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            happs.array.push(new Happening(Happen.InvGoes, inv2));
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = inv2;
              const inputB = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv2, prop1)) {
              return happs;
            }
            break;
          case _.OBTAIN_INV1_BY_INV2_WITH_PROP1_LOSE_NONE:
            happs.text = `By using the ${inv2} with the ${prop1} you have obtained the ${inv1}.`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            happs.array.push(new Happening(Happen.InvStays, inv2));
            happs.array.push(new Happening(Happen.PropStays, prop1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = inv2;
              const inputB = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv2, prop1)) {
              return happs;
            }
            break;
          case _.OBTAIN_INV1_BY_LOSING_INV2_KEEPING_PROP1:
            happs.text = `By using the ${inv2} with the ${prop1} you have obtained the ${inv1}.`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            happs.array.push(new Happening(Happen.InvGoes, inv2));
            happs.array.push(new Happening(Happen.PropStays, prop1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = inv2;
              const inputB = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv2, prop1)) {
              return happs;
            }
            break;
          case _.OBTAIN_INV1_BY_LOSING_PROP1_KEEPING_INV2:
            happs.text = `By using the ${inv2} with the ${prop1} you have obtained the ${inv1}.`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            happs.array.push(new Happening(Happen.InvStays, inv2));
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = inv2;
              const inputB = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv2, prop1)) {
              return happs;
            }
            break;
          case _.OBTAIN_INV1_BY_PROP1_WITH_PROP2_LOSE_PROPS:
            // eg obtain inv_meteor via radiation suit with the meteor.
            // ^^ this is nearly a two in one, but the radiation suit never becomes inventory: you wear it.
            happs.text = `You use the ${prop1} with the ${prop2} and obtain the ${inv1}`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropGoes, prop2));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              const inputB = prop2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, prop2)) {
              return happs;
            }
            break;
          case _.PROP1_APPEARS_WHEN_GRAB_PROP2_WITH_GOAL1:
            happs.text = `You use the ${prop2} and, somewhere, a ${prop1} appears`;
            happs.array.push(new Happening(Happen.PropAppears, prop1));
            if (piecesMappedByOutput != null) {
              const output = prop1;
              // the prop you grab (ie phone) must be input A - the solution creator
              // always constructs the solution as "grab inputA"
              // so it needs to be input A
              const inputA = prop2;
              const inputB = goal1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Grab', prop2, '')) {
              return happs;
            }
            break;
          case _.PROP1_APPEARS_WHEN_USE_INV1_WITH_PROP2:
            happs.text = `You use the ${inv1} with the ${prop2} and the ${prop2} appears`;
            happs.array.push(new Happening(Happen.PropAppears, prop1));
            happs.array.push(new Happening(Happen.InvStays, inv1));
            happs.array.push(new Happening(Happen.PropStays, prop2));
            if (piecesMappedByOutput != null) {
              const output = prop1;
              // the prop you grab (ie phone) must be input A - the solution creator
              // always constructs the solution as "grab inputA"
              // so it needs to be input A
              const inputA = prop2;
              const inputB = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop2, '')) {
              return happs;
            }
            break;
          case _.PROP1_BECOMES_PROP2_AS_INV1_BECOMES_INV2:
            happs.text = `The ${prop1} has become a ${prop2}. And your ${inv1} has become a ${inv2}.`;
            // ly don't mention what happen to the prop you clicked on.  "\n You notice the " + prop1 + " has now become a " + prop2;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.InvAppears, inv2));
            if (piecesMappedByOutput != null) {
              // Another weird one, with two outputs - but only one output slot in the graph
              // We fill the graph with the main output of the puzzle, otherwise
              // the won't puzzle won't get solved.
              const output = prop1;
              const inputA = prop2;
              const inputB = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', inv1, prop1)) {
              return happs;
            }
            break;
          case _.PROP1_BECOMES_PROP2_BY_KEEPING_INV1:
            happs.text = `You use the ${inv1}, and the ${prop1} becomes a ${inv2}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.InvStays, inv1));
            if (piecesMappedByOutput != null) {
              const inputA = prop1;
              const output = prop2;
              const inputB = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, inv1)) {
              return happs;
            }
            break;
          case _.PROP1_BECOMES_PROP2_BY_KEEPING_PROP3:
            happs.text = `You use the ${prop3}, and the ${prop1} becomes a ${prop2}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            if (piecesMappedByOutput != null) {
              const inputA = prop1;
              const output = prop2;
              const inputB = prop3;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, prop3)) {
              return happs;
            }
            break;
          case _.PROP1_BECOMES_PROP2_BY_LOSING_INV1:
            happs.text = `You use the ${inv1}, and the ${prop1} becomes a ${prop2}}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            if (piecesMappedByOutput != null) {
              const inputA = prop1;
              const output = prop2;
              const inputB = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, inv1)) {
              return happs;
            }
            break;
          case _.PROP1_BECOMES_PROP2_BY_LOSING_PROP3:
            happs.text = `You use the ${prop3}, and the ${prop1} becomes a ${prop2}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.PropGoes, prop3));
            if (piecesMappedByOutput != null) {
              const inputA = prop1;
              const output = prop2;
              const inputB = prop3;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, inv1)) {
              return happs;
            }
            break;
          case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
            happs.text = `You now have a ${inv1}`;
            // ly don't mention what happen to the prop you clicked on.  "\n You notice the " + prop1 + " has now become a " + prop2;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              // This is a weird one, because there are two real-life outputs
              // but only one puzzle output. I forget how I was going to deal with this.
              const inputA = prop1;
              // const inputB, count = "" + reactionsFile.pieces[i].prop2;
              const output = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA
                )
              );
            } else if (objects.Match('Grab', prop1, '')) {
              return happs;
            }
            break;
          case _.PROP1_CHANGES_STATE_TO_PROP2_BY_KEEPING_INV1:
            happs.text = `You use the ${inv1}, and the ${prop1} is now ${AlleviateBrackets(
              prop2
            )}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.InvStays, inv1));
            if (piecesMappedByOutput != null) {
              const inputA = prop1;
              const output = prop2;
              const inputB = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, inv1)) {
              return happs;
            }
            break;
          case _.PROP1_GOES_WHEN_GRAB_INV1:
            happs.text = `You now have a ${inv1}`;
            // ly don't mention what happen to the prop you clicked on.  "\n You notice the " + prop1 + " has now become a " + prop2;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA
                )
              );
            } else if (objects.Match('Grab', prop1, '')) {
              return happs;
            }
            break;
          case _.PROP1_STAYS_WHEN_GRAB_INV1:
            happs.text = `You now have a ${inv1}`;
            // ly don't mention what happen to the prop you clicked on.  "\n You now have a" + inv1;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA
                )
              );
            } else if (objects.Match('Grab', prop1, '')) {
              return happs;
            }
            break;
          case _.PROP1_GOES_WHEN_GRAB_INV1_WITH_GOAL1:
            happs.text = `You now have a ${inv1}`;
            // ly don't mention what happen to the prop you clicked on.  "\n You notice the " + prop1 + " has now become a " + prop2;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              const inputB = goal1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Grab', prop1, '')) {
              return happs;
            }
            break;
          case _.PROP1_STAYS_WHEN_GRAB_INV1_WITH_GOAL1:
            happs.text = `You now have a ${inv1}`;
            // ly don't mention what happen to the prop you clicked on.  "\n You now have a" + inv1;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              const inputB = goal1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Grab', prop1, '')) {
              return happs;
            }
            break;
          case _.TALK_TO_PROP1_GETS_INV1:
            happs.text = `You now have a ${inv1}`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA
                )
              );
            } else if (objects.Match('Talk', prop1, '')) {
              return happs;
            }
            break;
          case _.TALK_TO_PROP1_WITH_GOAL1_GETS_INV1:
            happs.text = `You talked with goal and now have a ${inv1}`;
            happs.array.push(new Happening(Happen.InvAppears, inv1));
            if (piecesMappedByOutput != null) {
              const output = inv1;
              const inputA = prop1;
              const inputB = goal1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Talk', prop1, '')) {
              return happs;
            }
            break;
          case _.THROW_INV1_AT_PROP1_GETS_INV2_LOSE_BOTH:
            happs.text = `Throw the ${inv1} at the ${prop1} gets you the ${inv2}.`;
            happs.array.push(new Happening(Happen.InvGoes, inv1));
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.InvAppears, inv2));
            if (piecesMappedByOutput != null) {
              const output = inv2;
              const inputA = prop1;
              const inputB = inv1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA,
                  inputB
                )
              );
            } else if (objects.Match('Use', prop1, inv1)) {
              return happs;
            }
            break;
          case _.TOGGLE_PROP1_BECOMES_PROP2:
            happs.text = `The ${prop1} has become a ${prop2}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            if (piecesMappedByOutput != null) {
              const output = prop2;
              const inputA = prop1;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  inputA
                )
              );
            } else if (objects.Match('Toggle', prop1, '')) {
              return happs;
            }
            break;
          case _.TOGGLE_PROP1_CHANGES_STATE_TO_PROP2:
            happs.text = `The ${prop1} is now ${AlleviateBrackets(prop2)}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            if (piecesMappedByOutput != null) {
              const input = prop1;
              const output = prop2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input
                )
              );
            } else if (objects.Match('Toggle', prop1, '')) {
              return happs;
            }
            break;
          case _.TOGGLE_PROP1_REVEALS_PROP2_AS_IT_BECOMES_PROP3:
            happs.text = `The ${prop1} becomes ${prop3} and reveals ${prop4}`;
            happs.array.push(new Happening(Happen.PropGoes, prop1));
            happs.array.push(new Happening(Happen.PropAppears, prop2));
            happs.array.push(new Happening(Happen.PropAppears, prop3));
            if (piecesMappedByOutput != null) {
              const input = prop1;
              const output = prop2;
              piecesMappedByOutput.AddPiece(
                new Piece(
                  id1,
                  null,
                  output,
                  pieceType,
                  count,
                  happs,
                  restrictions,
                  input
                )
              );
            } else if (objects.Match('Toggle', prop1, '')) {
              return happs;
            }
            break;
          default:
            console.warn(
              `We did not handle a pieceType that we"re supposed to. Check to see if constant names are the same as their values in the schema. ${pieceType}`
            );
        }
      }
    }
  }
  return null;
}
