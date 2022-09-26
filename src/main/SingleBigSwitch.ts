import { readFileSync } from 'fs';
import { Happenings } from '../main/Happenings.js';
import { SolutionNode } from '../main/SolutionNode.js';
import { AlleviateBrackets } from '../main/AlleviateBrackets.js';
import { Happen } from '../main/Happen.js';
import { Happening } from '../main/Happening.js';
import { MixedObjectsAndVerb } from '../main/MixedObjectsAndVerb.js';
import { SolutionNodeRepository } from '../main/SolutionNodeRepository.js';

import _ from '../../Gate.json';

function isNullOrUndefined(something: any): boolean {
  return typeof something === 'undefined' || something === null;
}

/**
 * Yup, this is the one location of these
 * And when the nodes are cloned, these ids get cloned too
 */
let globalId = 1;

export function SingleBigSwitch(
  filename: string,
  solutionNodesMappedByInput: SolutionNodeRepository | null,
  objects: MixedObjectsAndVerb
): Happenings | null {
  const text = readFileSync(filename, 'utf-8');
  const scenario = JSON.parse(text);

  for (let gate of scenario.gates) {
    const isConjoint = !isNullOrUndefined(gate.conjoint);
    let id1 = globalId;
    globalId += 1;
    let id2 = isConjoint ? globalId : 0;
    globalId += 1;
    for (let i = 0; i < (isConjoint ? 2 : 1); i += 1) {
      if (i === 1 && isConjoint) {
        gate.conjoint.text = gate.text; // share the text string for both
        gate = gate.conjoint; // overwrite gate with the conjoint
        const temp = id2;
        id2 = id1;
        id1 = temp;
      }

      const gateType: string = gate.gate;
      let count = 1;
      if (gate.count !== undefined) {
        count = gate.count;
      }

      const prop1 = JSON.stringify(gate.prop1);
      const prop2 = JSON.stringify(gate.prop2);
      const prop3 = JSON.stringify(gate.prop3);
      const prop4 = JSON.stringify(gate.prop4);
      const prop5 = JSON.stringify(gate.prop5);
      const prop6 = JSON.stringify(gate.prop6);
      const prop7 = JSON.stringify(gate.prop7);
      const flag1 = JSON.stringify(gate.flag1);
      const flag2 = JSON.stringify(gate.flag2);
      const flag3 = JSON.stringify(gate.flag3);
      const flag4 = JSON.stringify(gate.flag4);
      const flag5 = JSON.stringify(gate.flag5);
      const inv1 = JSON.stringify(gate.inv1);
      const inv2 = JSON.stringify(gate.inv2);
      const inv3 = JSON.stringify(gate.inv3);
      const happs = new Happenings();
      const { restrictions } = gate;
      switch (gateType) {
        case _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON:
          if (solutionNodesMappedByInput != null) {
            const output = JSON.stringify(gate.fileToMerge);
            const input = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
                count,
                happs,
                restrictions,
                input
              )
            );
          }
          break;
        case _.AUTO_PROP1_BECOMES_PROP2_BY_PROPS:
          if (solutionNodesMappedByInput != null) {
            const input1 = prop1;
            const output = prop2;
            const input2 = prop3;
            const input3 = prop4;
            const input4 = prop5;
            const input5 = prop6;
            const input6 = prop7;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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

        case _.AUTO_FLAG1_SET_BY_FLAG2:
          if (solutionNodesMappedByInput != null) {
            const output = flag1;
            const input = flag2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
                count,
                happs,
                restrictions,
                input
              )
            );
          }
          break;
        case _.AUTO_FLAG1_SET_BY_PROPS:
          if (solutionNodesMappedByInput != null) {
            const output = flag1;
            const input1 = prop1;
            const input2 = prop2;
            const input3 = prop3;
            const input4 = prop4;
            const input5 = prop5;
            const input6 = prop6;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.AUTO_FLAG1_SET_BY_INVS:
          if (solutionNodesMappedByInput != null) {
            const output = flag1;
            const input1 = inv1;
            const input2 = inv2;
            const input3 = inv3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.EXAMINE_PROP1_YIELDS_INV1:
          happs.text = `You examine the ${prop1} and find a ${inv1}`;
          // ly don't mention what happen to the prop you clicked on.  "\n You now have a" + inv1;
          happs.array.push(new Happening(Happen.InvAppears, inv1));
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.FLAG1_SET_BY_LOSING_INV1_WHEN_USED_WITH_PROP1:
          happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`;
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.PropStays, prop1));

          if (solutionNodesMappedByInput != null) {
            const output = flag1;
            const inputA = inv1;
            const inputB = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.FLAG1_SET_BY_LOSING_INV1_USED_WITH_PROP1_AND_PROPS:
          happs.text = `With everything set up correctly, you use the ${inv1} with the ${prop1} and something good happens...`;
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.PropStays, prop1));
          if (prop2.length > 0) {
            happs.array.push(new Happening(Happen.PropStays, prop2));
          }
          if (prop3.length > 0) {
            happs.array.push(new Happening(Happen.PropStays, prop3));
          }
          if (solutionNodesMappedByInput != null) {
            const output = flag1;
            const inputA = inv1;
            const inputB = prop1;
            const inputC = prop2;
            const inputD = prop3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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

        case _.FLAG1_SET_BY_USING_INV1_WITH_INV2:
          happs.text = `You use the ${inv1} with the ${inv2} and something good happens...`;
          happs.array.push(new Happening(Happen.InvStays, inv1));
          happs.array.push(new Happening(Happen.InvStays, inv2));
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          if (solutionNodesMappedByInput != null) {
            const inputA = inv1;
            const inputB = inv2;
            const output = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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

        case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1:
          happs.text = `You use the ${inv1} with the ${prop1} and something good happens...`;
          happs.array.push(new Happening(Happen.InvStays, inv1));
          happs.array.push(new Happening(Happen.PropStays, prop1));
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          if (solutionNodesMappedByInput != null) {
            const inputA = inv1;
            const inputB = prop1;
            const output = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1_LOSE_PROPS:
          happs.text = `You use the ${inv1} with the  ${prop1} and something good happens...`;
          happs.array.push(new Happening(Happen.InvStays, inv1));
          happs.array.push(new Happening(Happen.PropGoes, prop1));
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          if (solutionNodesMappedByInput != null) {
            const inputA = inv1;
            const inputB = prop1;
            const output = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1_NEED_FLAGS:
          happs.text = `You use the ${inv1} with the  ${prop1} and something good happens...`;
          happs.array.push(new Happening(Happen.InvStays, inv1));
          happs.array.push(new Happening(Happen.PropStays, prop1));
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          if (solutionNodesMappedByInput != null) {
            const output = flag1;
            const inputA = inv1;
            const inputB = prop1;
            const inputC = flag2;
            const inputD = flag3;
            const inputE = flag4;
            const inputF = flag5;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.FLAG1_SET_BY_USING_PROP1_WITH_PROP2:
          happs.text = `You use the ${prop1} with the ${prop2} and something good happens...`;
          happs.array.push(new Happening(Happen.PropStays, prop1));
          happs.array.push(new Happening(Happen.PropStays, prop2));
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const inputB = prop2;
            const output = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.GIVE_INV1_TO_PROP1_GETS_INV2:
          happs.text = `You give the ${inv1} to the ${prop1} and you get the ${inv2} in return`;
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.InvAppears, inv2));
          happs.array.push(new Happening(Happen.PropStays, prop1));
          if (solutionNodesMappedByInput != null) {
            // keeping prop1
            const inputA = inv1;
            const inputB = prop1;
            const output = inv2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.GIVE_INV1_TO_PROP1_SETS_FLAG1:
          happs.text = `Flag is set ${flag1}`;
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.FlagIsSet, flag1));
          if (solutionNodesMappedByInput != null) {
            const inputA = inv1;
            const inputB = prop1;
            const output = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.INPUT_INV1_PROP1_BECOMES_PROP2:
          happs.text = gate.text;
          happs.array.push(new Happening(Happen.PropGoes, prop1));
          happs.array.push(new Happening(Happen.PropAppears, prop2));
          if (solutionNodesMappedByInput != null) {
            const inputA = inv1;
            const inputB = prop1;
            const output = prop2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.INPUT_PROP1_INV1_BECOMES_INV2:
          happs.text = gate.text;
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.InvAppears, inv2));
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const inputB = inv1;
            const output = inv2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.INPUT_PROP1_INV1_REVEALS_PROP2:
          happs.text = gate.text;
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.PropAppears, prop2));
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const inputB = inv1;
            const output = prop2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.INV1_AND_INV2_COMBINE_TO_FORM_INV3:
          happs.text = `The ${inv1} and the ${inv2} combine to form an ${inv3}`;
          happs.array.push(new Happening(Happen.InvGoes, inv1));
          happs.array.push(new Happening(Happen.InvGoes, inv2));
          happs.array.push(new Happening(Happen.InvAppears, inv3));
          if (solutionNodesMappedByInput != null) {
            // losing all
            const inputA = inv1;
            const inputB = inv2;
            const output = inv3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            // losing none
            const inputA = inv1;
            const inputB = inv2;
            const output = inv3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            // losing inv
            const inputA = inv1;
            const output = inv2;
            const inputB = inv3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            // keeping prop1
            const inputA = inv1;
            const output = inv2;
            const inputB = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            // losing inv
            const inputA = inv1;
            const output = inv2;
            const inputB = inv3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const inputA = inv1;
            const inputB = prop1;
            const output = prop2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = inv2;
            const inputB = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = inv2;
            const inputB = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = inv2;
            const inputB = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = inv2;
            const inputB = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            const inputB = prop2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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

        case _.PROP1_APPEARS_WHEN_GRAB_PROP2_WITH_FLAG1:
          happs.text = `You use the ${prop2} and, somewhere, a ${prop1} appears`;
          happs.array.push(new Happening(Happen.PropAppears, prop1));
          if (solutionNodesMappedByInput != null) {
            const output = prop1;
            // the prop you grab (ie phone) must be input A - the solution creator
            // always constructs the solution as "grab inputA"
            // so it needs to be input A
            const inputA = prop2;
            const inputB = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = prop1;
            // the prop you grab (ie phone) must be input A - the solution creator
            // always constructs the solution as "grab inputA"
            // so it needs to be input A
            const inputA = prop2;
            const inputB = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            // Another weird one, with two outputs - but only one output slot in the graph
            // We fill the graph with the main output of the puzzle, otherwise
            // the won't puzzle won't get solved.
            const output = prop1;
            const inputA = prop2;
            const inputB = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const output = prop2;
            const inputB = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const output = prop2;
            const inputB = prop3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const output = prop2;
            const inputB = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const output = prop2;
            const inputB = prop3;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            // This is a weird one, because there are two real-life outputs
            // but only one puzzle output. I forget how I was going to deal with this.
            const inputA = prop1;
            // const inputB, count = "" + reactionsFile.gates[i].prop2;
            const output = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const inputA = prop1;
            const output = prop2;
            const inputB = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.PROP1_GOES_WHEN_GRAB_INV1_WITH_FLAG1:
          happs.text = `You now have a ${inv1}`;
          // ly don't mention what happen to the prop you clicked on.  "\n You notice the " + prop1 + " has now become a " + prop2;
          happs.array.push(new Happening(Happen.PropGoes, prop1));
          happs.array.push(new Happening(Happen.InvAppears, inv1));
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            const inputB = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.PROP1_STAYS_WHEN_GRAB_INV1_WITH_FLAG1:
          happs.text = `You now have a ${inv1}`;
          // ly don't mention what happen to the prop you clicked on.  "\n You now have a" + inv1;
          happs.array.push(new Happening(Happen.InvAppears, inv1));
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            const inputB = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
        case _.TALK_TO_PROP1_WITH_FLAG1_GETS_INV1:
          happs.text = `You talked with flag and now have a ${inv1}`;
          happs.array.push(new Happening(Happen.InvAppears, inv1));
          if (solutionNodesMappedByInput != null) {
            const output = inv1;
            const inputA = prop1;
            const inputB = flag1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = inv2;
            const inputA = prop1;
            const inputB = inv1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const output = prop2;
            const inputA = prop1;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const input = prop1;
            const output = prop2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          if (solutionNodesMappedByInput != null) {
            const input = prop1;
            const output = prop2;
            solutionNodesMappedByInput.AddToMap(
              new SolutionNode(
                id1,
                id2,
                output,
                gateType,
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
          console.log(
            `We did not handle a gateType that we"re supposed to. Check to see if constant names are the same as their values in the schema. ${gateType}`
          );
      }
    }
  }
  return null;
}
