import { Happener } from '../puzzle/Happener';
import { Mix } from '../puzzle/Mix';
import { MixedObjectsAndVerb } from '../puzzle/MixedObjectsAndVerb';

export function ParseTokenizedCommandLineFromFromThreeStrings(
  strings: string[],
  happener: Happener
): MixedObjectsAndVerb {
  const verb = strings[0].toLowerCase();

  const is1InPropsRaw = happener.GetArrayOfProps().includes(strings[1]);
  const is1InPropsPrefixed = happener
    .GetArrayOfProps()
    .includes(`prop_${strings[1]}`);
  const is1InInvsRaw = happener.GetArrayOfInvs().includes(strings[1]);
  const is1InInvsPrefixed = happener
    .GetArrayOfInvs()
    .includes(`inv_${strings[1]}`);
  const is2InPropsRaw = happener.GetArrayOfProps().includes(strings[2]);
  const is2InPropsPrefixed = happener
    .GetArrayOfProps()
    .includes(`prop_${strings[2]}`);
  const is2InInvsRaw = happener.GetArrayOfInvs().includes(strings[2]);
  const is2InInvsPrefixed = happener
    .GetArrayOfInvs()
    .includes(`inv_${strings[2]}`);

  if (verb === 'grab') {
    /* no combinations needed */
    if (is1InPropsRaw) {
      return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1]);
    }

    if (is1InPropsPrefixed) {
      return new MixedObjectsAndVerb(
        Mix.SingleVsProp,
        verb,
        `prop_${strings[1]}`
      );
    }
    return new MixedObjectsAndVerb(
      Mix.ErrorGrabButNoProp,
      '',
      '',
      '',
      `Couldn't recognize '${strings[1]}' as something to grab`
    );
  }
  if (verb === 'toggle') {
    /* no combinations needed */
    if (is1InPropsRaw) {
      return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1]);
    }
    if (is1InPropsPrefixed) {
      return new MixedObjectsAndVerb(
        Mix.SingleVsProp,
        verb,
        `prop_${strings[1]}`
      );
    }
    if (is1InInvsRaw) {
      return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, strings[1]);
    }
    if (is1InInvsPrefixed) {
      return new MixedObjectsAndVerb(
        Mix.SingleVsInv,
        verb,
        `inv_${strings[1]}`
      );
    }
    return new MixedObjectsAndVerb(
      Mix.ErrorToggleButNoInvOrProp,
      '',
      '',
      '',
      `Couldn't recognize '${strings[1]}' as something to toggle`
    );
  }
  if (verb === 'use') {
    /* pure raw */
    if (is1InInvsRaw && is2InInvsRaw) {
      /* a */
      return new MixedObjectsAndVerb(
        Mix.InvVsInv,
        verb,
        strings[1],
        strings[2]
      );
    }
    if (is1InInvsRaw && is2InPropsRaw) {
      /* b */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        strings[1],
        strings[2]
      );
    }
    if (is2InInvsRaw && is1InPropsRaw) {
      /* c */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        strings[2],
        strings[1]
      );
    }
    if (is1InPropsRaw && is2InPropsRaw) {
      /* d */
      return new MixedObjectsAndVerb(
        Mix.PropVsProp,
        verb,
        strings[1],
        strings[2]
      );
    }
    /* pure prefixed */ if (is1InInvsPrefixed && is2InInvsPrefixed) {
      /* a */
      return new MixedObjectsAndVerb(
        Mix.InvVsInv,
        verb,
        `inv_${strings[1]}`,
        `inv_${strings[2]}`
      );
    }
    if (is1InInvsPrefixed && is2InPropsPrefixed) {
      /* b */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        `inv_${strings[1]}`,
        `prop_${strings[2]}`
      );
    }
    if (is2InInvsPrefixed && is1InPropsPrefixed) {
      /* c */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        `inv_${strings[2]}`,
        `prop_${strings[1]}`
      );
    }
    if (is1InPropsPrefixed && is2InPropsPrefixed) {
      /* d */
      return new MixedObjectsAndVerb(
        Mix.PropVsProp,
        verb,
        `prop_${strings[1]}`,
        `prop_${strings[2]}`
      );
      /* mixed case a */
    }
    if (is1InInvsRaw && is2InInvsPrefixed) {
      /* a */
      return new MixedObjectsAndVerb(
        Mix.InvVsInv,
        verb,
        strings[1],
        `inv_${strings[2]}`
      );
    }
    if (is1InInvsPrefixed && is2InInvsRaw) {
      /* a */
      return new MixedObjectsAndVerb(
        Mix.InvVsInv,
        verb,
        `inv_${strings[1]}`,
        strings[2]
      );
      /* mixed case b */
    }
    if (is1InInvsRaw && is2InPropsPrefixed) {
      /* b */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        strings[1],
        `prop_${strings[2]}`
      );
    }
    if (is1InInvsPrefixed && is2InPropsRaw) {
      /* b */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        `inv_${strings[1]}`,
        strings[2]
      );
      /* mixed case c */
    }
    if (is2InInvsRaw && is1InPropsPrefixed) {
      /* c */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        strings[2],
        `prop_${strings[1]}`
      );
    }
    if (is2InInvsPrefixed && is1InPropsRaw) {
      /* c */
      return new MixedObjectsAndVerb(
        Mix.InvVsProp,
        verb,
        `inv_${strings[2]}`,
        strings[1]
      );
      /* mixed case d */
    }
    if (is1InPropsRaw && is2InPropsPrefixed) {
      // d
      return new MixedObjectsAndVerb(
        Mix.PropVsProp,
        verb,
        strings[1],
        `prop_${strings[2]}`
      );
    }
    if (is1InPropsPrefixed && is2InPropsRaw) {
      // d
      return new MixedObjectsAndVerb(
        Mix.PropVsProp,
        verb,
        `prop_${strings[1]}`,
        strings[2]
      );
    }
    return new MixedObjectsAndVerb(
      Mix.ErrorUseButNoInvOrProp,
      '',
      '',
      '',
      `Couldn't recognize '${strings[1]}' '${strings[2]}' as something to use`
    );
  }
  return new MixedObjectsAndVerb(
    Mix.ErrorVerbNotIdentified,
    '',
    '',
    '',
    `Couldn't recognize '${strings[1]}' as a verb`
  );
}
