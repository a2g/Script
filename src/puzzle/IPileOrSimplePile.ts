
import { TalkFile } from './talk/TalkFile'
import { Piece } from './Piece'
import { Box } from './Box'

export interface IPileOrSimplePile {
  AddPiece: (piece: Piece, folder: string, isNoFile: boolean, goalWords: Set<string>, mapOfBoxes: Map<string, Box>) => void
  AddTalkFile: (talkFile: TalkFile) => void
}
