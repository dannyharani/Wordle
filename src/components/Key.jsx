import React, { useContext } from 'react'
import { AppContext } from '../App'

function Key({ keyVal, bigKey, colour }) {
    const {onLetterDown, onEnter, onDelete} = useContext(AppContext);

    const selectKey = () => {
        if (keyVal == "DEL") {
            onDelete();
        } else if (keyVal == "ENTER") {
            onEnter();
        } else {
            onLetterDown(keyVal);
        }
    }

    return (
        <div className={'key' + " " + colour} id={bigKey && "big"} onClick={selectKey}>{keyVal}</div>
    )
}

export default Key