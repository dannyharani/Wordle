import React, {useCallback, useContext, useEffect} from 'react'
import Key from './Key';
import App, { AppContext } from '../App';

function Keyboard() {
    const {onEnter, onDelete, onLetterDown, usedKeys, correctKeys, okayKeys} = useContext(AppContext);

    const keyrow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const keyrow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const keyrow3 = ["Z", "X", "C", "V", "B", "N", "M"];

    const handleKeyboard = useCallback((e) => {

        if (e.key === "Enter") {
            onEnter();
        } else if (e.key === "Backspace") {
            onDelete();
        } else {
            keyrow1.forEach((key) => {
                if (e.key.toUpperCase() === key) {
                    onLetterDown(key);
                }
            })
            keyrow2.forEach((key) => {
                if (e.key.toUpperCase() === key) {
                    onLetterDown(key);
                }
            })
            keyrow3.forEach((key) => {
                if (e.key.toUpperCase() === key) {
                    onLetterDown(key);
                }
            })
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", handleKeyboard);
        return () => {
            document.removeEventListener("keydown", handleKeyboard);
        }
    }, [handleKeyboard])

    return (
        <div className='keyboard' onKeyDown={handleKeyboard}>
            <div className="topline">
                {keyrow1.map((key) => {
                    return <Key keyVal={key} colour={usedKeys.includes(key) ? "used" : correctKeys.includes(key) ? "correctKey" : okayKeys.includes(key) ? "okayKey" : "ignore"}/>;
                })}
            </div>
            <div className="midline">
                {keyrow2.map((key) => {
                    return <Key keyVal={key} colour={usedKeys.includes(key) ? "used" : correctKeys.includes(key) ? "correctKey" : okayKeys.includes(key) ? "okayKey" : "ignore"}/>;
                })}
            </div>
            <div className="botline">
                <Key keyVal={"ENTER"} bigKey/>
                {keyrow3.map((key) => {
                    return <Key keyVal={key} colour={usedKeys.includes(key) ? "used" : correctKeys.includes(key) ? "correctKey" : okayKeys.includes(key) ? "okayKey" : "ignore"}/>;
                })}
                <Key keyVal={"DEL"} bigKey/>
            </div>
        </div>
    )
}

export default Keyboard