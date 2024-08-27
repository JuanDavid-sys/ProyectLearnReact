import { useState, useEffect } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square"
import { TURNS} from "./constants"
import { checkWinner, checkEndGame} from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"
import { saveGameToStorage, resetGameToStorage } from "./logic/storage"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  // null es que hay un ganador, false es que hay un empate
  const [winner, setWinner] = useState(null) 


  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameToStorage()
  }


  const updateBoard = (index) => {
    // no actualiza la posicion si ya tienes algo
    if (board[index] || winner) return
    // actualizamos el tablero
    const newBoard = [...board]
    newBoard[index] = turn 
    setBoard(newBoard)
    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // Guardar partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    const newwinner = checkWinner(newBoard)
    if (newwinner) {
      confetti()
      setWinner(newwinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) //Empate
    }
  }

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reiniciar Juego</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                  {square}
              </Square>  
            )
          })
        }
      </section>

      <section className="turn">
      <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>  
      <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>  
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )

}


export default App
