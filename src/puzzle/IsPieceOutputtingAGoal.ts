import { IdPrefixes } from '../../IdPrefixes'
import { Piece } from './Piece'

export function IsPieceOutputtingAGoal (piece: Piece): boolean {
  if (piece.output.startsWith(IdPrefixes.InvGoal)) {
    return true
  }
  return piece.type.startsWith('TALK_GAINS_GOAL1') ||
    piece.type.startsWith('AUTO_GOAL1_MET') ||
    piece.type.startsWith('GOAL1_MET')
}
