import { Happener } from '../puzzle/Happener'
import { Mix } from '../puzzle/Mix'
import { Command } from '../puzzle/Command'
import { Verb } from '../puzzle/Verb'

export function ParseTokenizedCommandLineFromFromThreeStrings (
  strings: string[],
  happener: Happener
): Command {
  const verb = strings[0].toLowerCase()

  const is1InPropsRaw = happener.GetArrayOfProps().includes(strings[1])
  const is1InPropsPrefixed = happener
    .GetArrayOfProps()
    .includes(`prop_${strings[1]}`)
  const is1InInvsRaw = happener.GetArrayOfInvs().includes(strings[1])
  const is1InInvsPrefixed = happener
    .GetArrayOfInvs()
    .includes(`inv_${strings[1]}`)
  const is2InPropsRaw = happener.GetArrayOfProps().includes(strings[2])
  const is2InPropsPrefixed = happener
    .GetArrayOfProps()
    .includes(`prop_${strings[2]}`)
  const is2InInvsRaw = happener.GetArrayOfInvs().includes(strings[2])
  const is2InInvsPrefixed = happener
    .GetArrayOfInvs()
    .includes(`inv_${strings[2]}`)

  if (verb === 'grab') {
    /* no combinations needed */
    if (is1InPropsRaw) {
      return new Command(Verb.Grab, Mix.Prop, strings[1])
    }

    if (is1InPropsPrefixed) {
      return new Command(Verb.Grab, Mix.Prop, `prop_${strings[1]}`)
    }
    return new Command(
      Verb.Grab,
      Mix.ErrorGrabButNoProp,
      '',
      '',
      `Couldn't recognize '${strings[1]}' as something to grab`
    )
  }
  if (verb === 'toggle') {
    /* no combinations needed */
    if (is1InPropsRaw) {
      return new Command(Verb.Toggle, Mix.Prop, strings[1])
    }
    if (is1InPropsPrefixed) {
      return new Command(Verb.Toggle, Mix.Prop, `prop_${strings[1]}`)
    }
    if (is1InInvsRaw) {
      return new Command(Verb.Toggle, Mix.Inv, strings[1])
    }
    if (is1InInvsPrefixed) {
      return new Command(Verb.Toggle, Mix.Inv, `inv_${strings[1]}`)
    }
    return new Command(
      Verb.Toggle,
      Mix.ErrorToggleButNoInvOrProp,
      '',
      '',
      `Couldn't recognize '${strings[1]}' as something to toggle`
    )
  }
  if (verb === 'use') {
    /* pure raw */
    if (is1InInvsRaw && is2InInvsRaw) {
      /* a */
      return new Command(Verb.Use, Mix.InvVsInv, strings[1], strings[2])
    }
    if (is1InInvsRaw && is2InPropsRaw) {
      /* b */
      return new Command(Verb.Use, Mix.InvVsProp, strings[1], strings[2])
    }
    if (is2InInvsRaw && is1InPropsRaw) {
      /* c */
      return new Command(Verb.Use, Mix.InvVsProp, strings[2], strings[1])
    }
    if (is1InPropsRaw && is2InPropsRaw) {
      /* d */
      return new Command(Verb.Use, Mix.PropVsProp, strings[1], strings[2])
    }
    /* pure prefixed */ if (is1InInvsPrefixed && is2InInvsPrefixed) {
      /* a */
      return new Command(
        Verb.Use,
        Mix.InvVsInv,
        `inv_${strings[1]}`,
        `inv_${strings[2]}`
      )
    }
    if (is1InInvsPrefixed && is2InPropsPrefixed) {
      /* b */
      return new Command(
        Verb.Use,
        Mix.InvVsProp,
        `inv_${strings[1]}`,
        `prop_${strings[2]}`
      )
    }
    if (is2InInvsPrefixed && is1InPropsPrefixed) {
      /* c */
      return new Command(
        Verb.Use,
        Mix.InvVsProp,
        `inv_${strings[2]}`,
        `prop_${strings[1]}`
      )
    }
    if (is1InPropsPrefixed && is2InPropsPrefixed) {
      /* d */
      return new Command(
        Verb.Use,
        Mix.PropVsProp,
        `prop_${strings[1]}`,
        `prop_${strings[2]}`
      )
      /* mixed case a */
    }
    if (is1InInvsRaw && is2InInvsPrefixed) {
      /* a */
      return new Command(
        Verb.Use,
        Mix.InvVsInv,
        strings[1],
        `inv_${strings[2]}`
      )
    }
    if (is1InInvsPrefixed && is2InInvsRaw) {
      /* a */
      return new Command(
        Verb.Use,
        Mix.InvVsInv,
        `inv_${strings[1]}`,
        strings[2]
      )
      /* mixed case b */
    }
    if (is1InInvsRaw && is2InPropsPrefixed) {
      /* b */
      return new Command(
        Verb.Use,
        Mix.InvVsProp,
        strings[1],
        `prop_${strings[2]}`
      )
    }
    if (is1InInvsPrefixed && is2InPropsRaw) {
      /* b */
      return new Command(
        Verb.Use,
        Mix.InvVsProp,
        `inv_${strings[1]}`,
        strings[2]
      )
      /* mixed case c */
    }
    if (is2InInvsRaw && is1InPropsPrefixed) {
      /* c */
      return new Command(
        Verb.Use,
        Mix.InvVsProp,
        strings[2],
        `prop_${strings[1]}`
      )
    }
    if (is2InInvsPrefixed && is1InPropsRaw) {
      /* c */
      return new Command(
        Verb.Use,
        Mix.InvVsProp,
        `inv_${strings[2]}`,
        strings[1]
      )
      /* mixed case d */
    }
    if (is1InPropsRaw && is2InPropsPrefixed) {
      // d
      return new Command(
        Verb.Use,
        Mix.PropVsProp,

        strings[1],
        `prop_${strings[2]}`
      )
    }
    if (is1InPropsPrefixed && is2InPropsRaw) {
      // d
      return new Command(
        Verb.Use,
        Mix.PropVsProp,
        `prop_${strings[1]}`,
        strings[2]
      )
    }
    return new Command(
      Verb.Use,
      Mix.ErrorUseButNoInvOrProp,
      '',
      '',
      `Couldn't recognize '${strings[1]}' '${strings[2]}' as something to use`
    )
  }
  return new Command(
    Verb.Use,
    Mix.ErrorVerbNotIdentified,
    '',
    '',
    `Couldn't recognize '${strings[1]}' as a verb`
  )
}
