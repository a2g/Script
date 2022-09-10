import { ReadOnlyJsonInterfaceFindLeaves } from 'jigsaw/ReadOnlyJsonInterfaceFindLeaves'
import { ReadOnlyJsonInterfaceConcoct } from 'jigsaw/ReadOnlyJsonInterfaceConcoct'
import { ReadOnlyJsonInterfaceFindUsed } from 'jigsaw/ReadOnlyJsonInterfaceFindUsed'
import { ReadOnlyJsonInterfacePlayThru } from 'jigsaw/ReadOnlyJsonInterfacePlayThru'
import { ReadOnlyJsonInterfaceHappener } from 'jigsaw/ReadOnlyJsonInterfaceHappener'

export interface ReadOnlyJsonInterface
  extends ReadOnlyJsonInterfacePlayThru,
  ReadOnlyJsonInterfaceConcoct,
  ReadOnlyJsonInterfaceFindLeaves,
  ReadOnlyJsonInterfaceFindUsed,
  ReadOnlyJsonInterfaceHappener {

}
