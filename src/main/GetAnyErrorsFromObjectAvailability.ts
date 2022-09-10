import { Mix } from 'main/Mix'
import { MixedObjectsAndVerb } from 'main/MixedObjectsAndVerb'

export function GetAnyErrorsFromObjectAvailability(objects: MixedObjectsAndVerb, visibleProps: string[], visibleInvs: string[]): string {
  const isObject1InVisibleInvs = visibleInvs.includes(objects.object1)
  const isObject1InVisibleProps = visibleProps.includes(objects.object1)
  const isObject2InVisibleInvs = visibleInvs.includes(objects.object2)
  const isObject2InVisibleProps = visibleProps.includes(objects.object2)

  const type = objects.type
  if (type === Mix.InvVsInv) {
    if (!isObject1InVisibleInvs || !isObject2InVisibleInvs) {
      return 'One of those inventory items is not visible!'
    }
  }
  if (type === Mix.InvVsProp) {
    if (!isObject1InVisibleInvs || !isObject2InVisibleProps) {
      return 'One of those items is not visible!'
    }
  }
  if (type === Mix.PropVsProp) {
    if (!isObject1InVisibleProps || !isObject2InVisibleProps) {
      return 'One of those props is not visible!'
    }
  }
  if (type === Mix.SingleVsInv && !isObject1InVisibleInvs) {
    return 'That inv is not visible!'
  } else if (type === Mix.SingleVsProp && !isObject1InVisibleProps) {
    return 'That prop is not visible!'
  }

  return ''// no error!
}
