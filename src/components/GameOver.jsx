import React from 'react'

function GameOver({guessCount, win, correctWord}) {
  return (
    <div>
        <h1>Game Over</h1>
        {win ? (guessCount>=1 ? <h3>It took you {guessCount} tries to guess the correct word: </h3> : <h3>It took you {guessCount} try to guess the correct word: </h3>) : <h3>The correct word was:</h3>}
        <h2>{correctWord}</h2>
    </div>
  )
}

export default GameOver