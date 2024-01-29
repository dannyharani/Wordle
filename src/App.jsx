import { useState } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import Keyboard from './components/Keyboard'
import { createContext } from 'react'
import { wordMatrix } from './Tools';

export const AppContext = createContext();

function App() {
  const [gameBoard, setGameBoard] = useState(wordMatrix);
  const [currPos, setCurrPos] = useState({row: 0, col: 0})

  const correctWord = "words";

  const onLetterDown = (keyVal) => {
    if (currPos.col >= 5)
    {
      return;
    }

    const newBoard = [...gameBoard];
    newBoard[currPos.row][currPos.col] = keyVal;
    setGameBoard(newBoard)
    setCurrPos({...currPos, col: currPos.col + 1})
  }

  const onDelete = () => {
    if (currPos.col == 0)
    {
        return;
    }
    
    const newBoard = [...gameBoard];
    newBoard[currPos.row][currPos.col-1] = "";
    setGameBoard(newBoard);
    setCurrPos({...currPos, col: currPos.col - 1})
  }

  const onEnter = () => {
      if (currPos.col != 5) {
          return;
      }
      setCurrPos({...currPos, col: 0, row: currPos.row + 1})
  }

  return (
    <div className="main">
      <h1 className="title">Wordle</h1>

      <AppContext.Provider value={{ gameBoard, setGameBoard, currPos, setCurrPos, onLetterDown, onDelete, onEnter, correctWord}}>
        <div className="center">
          <GameBoard/>
          <Keyboard />
        </div>
      </AppContext.Provider>
    </div>
  )
}

export default App
