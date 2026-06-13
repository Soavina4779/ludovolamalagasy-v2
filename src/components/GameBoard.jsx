import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './GameBoard.css'

function GameBoard({ game, user }) {
  const [board, setBoard] = useState(JSON.parse(game.board))
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [validMoves, setValidMoves] = useState([])

  const rows = 9
  const cols = 5

  const getValidMoves = (row, col) => {
    const moves = []
    // Mouvements horizontaux et diagonaux
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (board[newRow][newCol] === 0) {
          moves.push([newRow, newCol])
        }
      }
    }
    return moves
  }

  const handlePieceClick = (row, col) => {
    if (board[row][col] === game.current_player) {
      setSelectedPiece([row, col])
      setValidMoves(getValidMoves(row, col))
    }
  }

  const handleMove = async (toRow, toCol) => {
    if (!selectedPiece) return

    const [fromRow, fromCol] = selectedPiece
    const newBoard = board.map(r => [...r])
    newBoard[toRow][toCol] = board[fromRow][fromCol]
    newBoard[fromRow][fromCol] = 0

    const nextPlayer = game.current_player === 1 ? 2 : 1

    try {
      const { error } = await supabase
        .from('games')
        .update({
          board: JSON.stringify(newBoard),
          current_player: nextPlayer,
          updated_at: new Date()
        })
        .eq('id', game.id)

      if (error) throw error

      setBoard(newBoard)
      setSelectedPiece(null)
      setValidMoves([])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="gameboard-container">
      <div className="game-info">
        <p>Joueur actuel: <strong>{game.current_player === 1 ? 'Blanc' : 'Bleu'}</strong></p>
      </div>

      <div className="gameboard">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="board-row">
            {row.map((piece, colIdx) => {
              const isSelected = selectedPiece && selectedPiece[0] === rowIdx && selectedPiece[1] === colIdx
              const isValidMove = validMoves.some(m => m[0] === rowIdx && m[1] === colIdx)

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`cell ${piece === 1 ? 'white' : piece === 2 ? 'blue' : 'empty'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}`}
                  onClick={() => {
                    if (piece !== 0) {
                      handlePieceClick(rowIdx, colIdx)
                    } else if (isValidMove) {
                      handleMove(rowIdx, colIdx)
                    }
                  }}
                >
                  {piece === 1 && <div className="piece white-piece"></div>}
                  {piece === 2 && <div className="piece blue-piece"></div>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameBoard
