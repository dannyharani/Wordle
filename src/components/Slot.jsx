import React, {useContext, useEffect} from 'react'
import { AppContext } from '../App';

function Slot({col, row}) {
    const { gameBoard, correctWord, currPos, setUsedKeys, setCorrectKeys, setOkayKeys } = useContext(AppContext);
    const letter = gameBoard[row][col];

    const correct = correctWord[col].toUpperCase() === letter;
    const okay = !correct && letter !== "" && correctWord.toUpperCase().includes(letter.toUpperCase());

    const letterState = currPos.row > row && (correct ? "correct" : okay ? "okay" : "default");

    useEffect(() => {
        if (letter !== "" && !correct && !okay) {
            setUsedKeys((prev) => [...prev, letter]);
        } else if (letter !== "" && correct) {
            setCorrectKeys((prev) => [...prev, letter]);
        } else if (letter !== "" && okay) {
            setOkayKeys((prev) => [...prev, letter]);
        }
    }, [currPos.row]);

    return (
        <div className='slot' id={letterState}> {letter} </div>
    )
}

export default Slot