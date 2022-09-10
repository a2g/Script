import { ReadOnlyJsonInterfaceFindLeaves } from './ReadOnlyJsonInterfaceFindLeaves'
import { ReadOnlyJsonInterfaceConcoct } from './ReadOnlyJsonInterfaceConcoct'
import { ReadOnlyJsonInterfaceFindUsed } from './ReadOnlyJsonInterfaceFindUsed'
import { ReadOnlyJsonInterfacePlayThru } from './ReadOnlyJsonInterfacePlayThru'
import { ReadOnlyJsonInterfaceHappener } from './ReadOnlyJsonInterfaceHappener'

export interface ReadOnlyJsonInterface
  extends ReadOnlyJsonInterfacePlayThru,
  ReadOnlyJsonInterfaceConcoct,
  ReadOnlyJsonInterfaceFindLeaves,
  ReadOnlyJsonInterfaceFindUsed,
  ReadOnlyJsonInterfaceHappener {

}
