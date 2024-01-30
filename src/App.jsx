import { useEffect, useState } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import Keyboard from './components/Keyboard'
import { createContext } from 'react'
import { wordMatrix, getWordList } from './Tools';

export const AppContext = createContext();

function App() {
  const [gameBoard, setGameBoard] = useState(wordMatrix);
  const [currPos, setCurrPos] = useState({row: 0, col: 0});
  const [prevGuesses, setPrevGuesses] = useState([]);
  const [wordList, setWordList] = useState(new Set());
  const [usedKeys, setUsedKeys] = useState([]);
  const [correctKeys, setCorrectKeys] = useState([]);
  const [okayKeys, setOkayKeys] = useState([]);
  const [gameOver, setGameOver] = useState({gameOver: false, guessed: false});

  const correctWord = "doors";

  useEffect(() => {
    getWordList().then((words) => {
      setWordList(words.wordList);
    });
  }, []);

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

      let currWord = "";

      for(let i = 0; i < 5; i++)
      {
        currWord += gameBoard[currPos.row][i];
      }

      if (!wordList.has(currWord.toLowerCase()))
      {
        alert("Does not exist - change this to nice popup/animation");
        //return;
      }

      if (currWord === correctWord.toUpperCase())
      {
        alert("Win");
      }

      setPrevGuesses((prev) => [...prev, currWord]);
      setCurrPos({...currPos, col: 0, row: currPos.row + 1})
  }

  return (
    <div className="main">
      <h1 className="title">Wordle</h1>

      <AppContext.Provider value={{ gameBoard, setGameBoard, currPos, setCurrPos, onLetterDown, onDelete, onEnter, correctWord, usedKeys, setUsedKeys, correctKeys, setCorrectKeys, okayKeys, setOkayKeys, prevGuesses}}>
        <div className="center">
          <GameBoard/>
          <Keyboard />
        </div>
      </AppContext.Provider>
    </div>
  )
}

export default App
