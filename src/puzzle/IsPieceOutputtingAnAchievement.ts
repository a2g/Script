import { IdPrefixes } from '../../IdPrefixes'
import { Piece } from './Piece'

export function IsPieceOutputtingAnAchievement (piece: Piece): boolean {
  if (piece.output.startsWith(IdPrefixes.InvAchievement)) {
    return true
  }
  return piece.type.startsWith('CHAT_GAINS_ACHMT1') ||
    piece.type.startsWith('AUTO_ACHMT1_MET') ||
    piece.type.startsWith('ACHMT1_MET')
}
