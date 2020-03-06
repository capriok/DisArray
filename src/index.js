import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash'
import logo from './gallery/logo.png'
import './App.scss';
import './common/confetti.scss'
import { Confetti } from './common/confetti';

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
    console.log(`--Tile moved ${side}`)
    const newTiles = step2
    setTiles(newTiles)
    checkForWin(newTiles)
  }

  const users = [
    {
      name: 'kyle',
      time: ':17'
    },
    {
      name: 'sarah',
      time: '2:25'
    },
    {
      name: 'cat',
      time: '2:55'
    },
    {
      name: 'hunter',
      time: '6:29'
    },
    {
      name: 'fox',
      time: 'DNF'
    },
  ]

  let time = '3:50'

  return (
    <>
      <div className="game">
        {victory &&
          <>
            <div className="victory">
              <h2>You've Won!</h2>
              <p className="time">Youre time: {time}</p>
              <div className="leaderboard">
                <h3>Leaderboards</h3>
                {users.map((row, i) => (
                  <>
                    <p>
                      <span>{i + 1}</span>
                      <span>{row.name}</span>
                      <span>{row.time}</span>
                    </p>
                  </>
                ))}
              </div>
            </div>
            <Confetti />
          </>
        }
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
  )
}

export default function Board() {
  const spaces = 16
  const [playing, inSession] = useState(false)
  const [victory, hasWon] = useState(true)
  const [tiles, setTiles] = useState([])

  const startGame = () => {
    let population = []
    for (let i = 1; i < spaces; i++) {
      population.push(i)
    }
    population.splice(spaces, 0, 16)

    setTiles(_.shuffle(population))
    setTiles(population)
    hasWon(false)
    inSession(true)
  }

  const checkForWin = (arr) => {
    console.log('Checking for win... ');
    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i + 1] === arr[i] + 1) {
        endGame()
      } else {
        hasWon(false)
        console.log('--Tiles in order?', victory);
        break;
      }
    }
  }

  const endGame = () => {
    hasWon(true)
  }

  return (
    <>
      <div className="app">
        <Game tiles={tiles} setTiles={setTiles} victory={victory} hasWon={hasWon} playing={playing} checkForWin={checkForWin} />
        <button onClick={() => startGame()}>{!victory ? 'Shuffle' : 'Scramble Tiles'}</button>
      </div>
    </>
  );
}



ReactDOM.render(<Board />, document.getElementById('root'));