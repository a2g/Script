import { IdPrefixes } from '../../IdPrefixes'
import { Piece } from './Piece'

export function IsPieceOutputtingAnAchievement (piece: Piece): boolean {
  if (piece.output.startsWith(IdPrefixes.InvAchievement)) {
    return true
  }
  return piece.type.startsWith('CHAT_GAINS_AMENT1') ||
    piece.type.startsWith('AUTO_AMENT1_MET') ||
    piece.type.startsWith('AMENT1_MET')
}
