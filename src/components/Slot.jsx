import React, {useContext, useEffect} from 'react'
import { AppContext } from '../App';

function getLetterCount(word, letter)
{
    let letterCount = 0;

    for (let i = 0; i < word.length; i++)
    {
        word.toUpperCase()[i] === letter.toUpperCase() ? letterCount++ : {}; // if letter eq. lettercount ++
    }

    return letterCount;
}

function guessesLeft(letter, guessedWord, correctWord, letterCount)
{
    let count = letterCount;

    for (let i = 0; i < 5; i++)
    {
        if (letter === guessedWord[i] && guessedWord[i] === correctWord[i]) 
        {
            count--;
        }
    }

    return count;
}

function isOkay(letter, col, correctWord, guessedWord)
{

    let validLetterCount = getLetterCount(correctWord, letter);

    // console.log(letter + " " + col + " " + validLetterCount);

    if (validLetterCount === getLetterCount(guessedWord, letter))
    {
        return true;
    }

    if (getLetterCount(guessedWord, letter) > validLetterCount)
    {
        if(guessesLeft(letter, guessedWord, correctWord, validLetterCount) <= 0)
        {
            return false;
        }

        if (getLetterCount(guessedWord.substring(0, col), letter) < validLetterCount)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    return true;

}

function Slot({col, row}) {
    const { gameBoard, correctWord, currPos, setUsedKeys, setCorrectKeys, setOkayKeys, prevGuesses } = useContext(AppContext);
    const letter = gameBoard[row][col].toUpperCase();
    const currGuess = prevGuesses[row];

    const correct = correctWord[col].toUpperCase() === letter;

    var okay = false;

    if (!correct && correctWord.toUpperCase().includes(letter) && letter !== "")
    {
        if (currGuess)
        {   
            okay = isOkay(letter, col, correctWord.toUpperCase(), currGuess.toUpperCase())
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
        <div className='slot' id={letterState}>
            <input type='text'/>
            {letter} 
        </div>
    )
}

export default Slot