import { ReadOnlyJsonInterfaceFindLeaves } from 'main/ReadOnlyJsonInterfaceFindLeaves'
import { ReadOnlyJsonInterfaceConcoct } from 'main/ReadOnlyJsonInterfaceConcoct'
import { ReadOnlyJsonInterfaceFindUsed } from 'main/ReadOnlyJsonInterfaceFindUsed'
import { ReadOnlyJsonInterfacePlayThru } from 'main/ReadOnlyJsonInterfacePlayThru'
import { ReadOnlyJsonInterfaceHappener } from 'main/ReadOnlyJsonInterfaceHappener'

export interface ReadOnlyJsonInterface
  extends ReadOnlyJsonInterfacePlayThru,
  ReadOnlyJsonInterfaceConcoct,
  ReadOnlyJsonInterfaceFindLeaves,
  ReadOnlyJsonInterfaceFindUsed,
  ReadOnlyJsonInterfaceHappener {

}
