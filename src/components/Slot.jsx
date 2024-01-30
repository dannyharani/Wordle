import React, {useContext, useEffect} from 'react'
import { AppContext } from '../App';

function getLetterCount(word, letter)
{
    let letterCount = 0;

    for (let i = 0; i < word.length; i++)
    {
        word.toUpperCase()[i] === letter.toUpperCase() ? letterCount++ : {};
    }

    return letterCount;
}

function Slot({col, row}) {
    const { gameBoard, correctWord, currPos, setUsedKeys, setCorrectKeys, setOkayKeys, prevGuesses } = useContext(AppContext);
    const letter = gameBoard[row][col];
    const wordArr = correctWord.split("");
    const currGuess = prevGuesses[row];
    
    const letterMap = new Map();

    wordArr.map(letter => {
        letterMap.set(letter.toUpperCase(), (letterMap.get(letter.toUpperCase()) ?? 0) + 1);
    });

    const correct = correctWord[col].toUpperCase() === letter;

    var okay = false;

    if (!correct && correctWord.toUpperCase().includes(letter) && letter !== "")
    {
        if (currGuess)
        {   
            for (let j = 0; j < col; j++)
            {
                if (letter === correctWord.toUpperCase()[j] && row !== j)
                {
                    letterMap.set(letter, letterMap.get(letter)-1);
                }
            }
    
            if (letterMap.get(letter) > 0)
            {
                okay = true;
            }
        }

    }

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