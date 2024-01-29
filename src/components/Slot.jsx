import React, {useContext} from 'react'
import { AppContext } from '../App';

function Slot({col, row}) {
    const { gameBoard, correctWord, currPos } = useContext(AppContext);
    const letter = gameBoard[row][col];

    const correct = correctWord[col].toUpperCase() === letter;
    const okay = !correct && letter !== "" && correctWord.toUpperCase().includes(letter.toUpperCase());

    console.log(okay);

    const letterState = currPos.row > row && (correct ? "correct" : okay ? "okay" : "default");

    console.log(letterState)
    return (
        <div className='slot' id={letterState}> {letter} </div>
    )
}

export default Slot