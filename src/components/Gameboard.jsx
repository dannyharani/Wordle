import React from 'react'
import Slot from './Slot';

function GameBoard() {

    return (
        <div className="grid">
            <div className="row">
                <Slot col={0} row={0} />
                <Slot col={1} row={0} />
                <Slot col={2} row={0} />
                <Slot col={3} row={0} />
                <Slot col={4} row={0} />
            </div>
            <div className="row">
                <Slot col={0} row={1} />
                <Slot col={1} row={1} />
                <Slot col={2} row={1} />
                <Slot col={3} row={1} />
                <Slot col={4} row={1} />
            </div>
            <div className="row">
                <Slot col={0} row={2} />
                <Slot col={1} row={2} />
                <Slot col={2} row={2} />
                <Slot col={3} row={2} />
                <Slot col={4} row={2} />
            </div>
            <div className="row">
                <Slot col={0} row={3} />
                <Slot col={1} row={3} />
                <Slot col={2} row={3} />
                <Slot col={3} row={3} />
                <Slot col={4} row={3} />
            </div>
            <div className="row">
                <Slot col={0} row={4} />
                <Slot col={1} row={4} />
                <Slot col={2} row={4} />
                <Slot col={3} row={4} />
                <Slot col={4} row={4} />
            </div>
            <div className="row">
                <Slot col={0} row={5} />
                <Slot col={1} row={5} />
                <Slot col={2} row={5} />
                <Slot col={3} row={5} />
                <Slot col={4} row={5} />
            </div>
        </div>
    )
}

export default GameBoard