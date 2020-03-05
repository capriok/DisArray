import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash'
import logo from './gallery/logo.png'
import './App.scss';

function Game({ tiles, setTiles, victory, hasWon, playing, checkForWin }) {
  let emptyIndex = _.findIndex(tiles, t => t === 16) + 1

  const playerAction = (e, i, tile) => {
    console.log("---------User Clicked--------");
    console.log('Action location', i);
    let newName
    let check = () => {
      if (tile === 16) {
        return newName = 'EMPTY'
      } else { return tile }
    }
    console.log('Action Tile', check(newName));
    tile !== 16 && checkSurroundings(i, tile)
  }

  const checkSurroundings = (i, tile) => {
    console.log('Checking Surroundings...');
    tile !== 16 && console.log('--Empty Location', emptyIndex);
    let top = i - 4
    let right = i + 1
    let bottom = i + 4
    let left = i - 1
    switch (emptyIndex) {
      case top:
        return (
          console.log('--Can move up'),
          swapTiles(i, tile, 'up')
        )
      case right:
        switch (i) {
          case 4:
            return true
          case 8:
            return true
          case 12:
            return true
          default:
            return (
              console.log('--Can move right'),
              swapTiles(i, tile, 'right')
            )
        }
      case bottom:
        return (
          console.log('--Can move down'),
          swapTiles(i, tile, 'down')
        )
      case left:
        switch (i) {
          case 5:
            return true
          case 9:
            return true
          case 13:
            return true
          default:
            return (
              console.log('--Can move left'),
              swapTiles(i, tile, 'left')
            )
        }
      default:
        return console.log('--Cannot move anywhere')
    }
  }

  const swapTiles = (i, tile, side) => {
    let step1 = tiles.filter(t => t !== 16)
    step1.splice(i - 1, 0, 16)
    let step2 = step1.filter(t => t !== tile)
    step2.splice(emptyIndex - 1, 0, tile)

    console.log(`--Action Tile moved ${side}`)
    const newTiles = step2
    setTiles(newTiles)
    // checkForWin(step2)
  }



  return (
    <>
      <div className="game">
        {victory && <div className="victory"><h1>You've Won!</h1></div>}
        {!playing
          ? <><div><img src={logo} alt="" /><h1>disArray</h1></div></>
          : tiles.map((tile, i) => (
            <li key={i} onClick={(e) => playerAction(e, i + 1, tile)}>
              <div key={i}
              >
                {tile <= 15 ? tile : ''}
              </div>
            </li>
          ))}
      </div>
    </>
  );
}

export default function Board() {
  const spaces = 16
  const [playing, inSession] = useState(false)
  const [victory, hasWon] = useState(false)
  const [tiles, setTiles] = useState([])

  const startGame = () => {
    let population = []
    for (let i = 1; i < spaces; i++) {
      population.push(i)
    }
    population.splice(spaces, 0, 16)

    setTiles(_.shuffle(population))
    // setTiles(population)
    hasWon(false)
    inSession(true)
  }

  const checkForWin = (arr) => {
    console.log('checking for win... ');
    console.log(arr);

    for (let i = 0; i < arr.length; i++) {
      console.log(i);
      console.log(i + 1);
      if (arr[i] > arr[i + 1]) {
        hasWon(false)
      } else { hasWon(true) }
      console.log(victory);

    }
    console.log('victory?', victory);
  }

  useEffect(() => checkForWin(tiles), [tiles])

  useEffect(() => startGame(), [])

  return (
    <>
      <div className="app">
        <Game tiles={tiles} setTiles={setTiles} victory={victory} hasWon={hasWon} playing={playing} checkForWin={checkForWin} />
        <button onClick={() => startGame()}>{playing ? 'Shuffle' : 'Start Game'}</button>
      </div>
    </>
  );
}



ReactDOM.render(<Board />, document.getElementById('root'));