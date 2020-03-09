import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { useSpring, animated } from 'react-spring'
// import { Spring } from 'react-spring/renderprops'
import { Transition } from 'react-spring/renderprops'
import _ from 'lodash'
import axios from 'axios'
import './App.scss';
import './common/confetti.scss'
import logo from './gallery/logo.png'
import lbIcon from './gallery/lb-icon.png'
import format from './common/format'
import Leaderboard from './common/leaderboard'

export default function Board() {
  console.log = function () { }
  let DOMnickname = document.getElementById('nickname')
  const spaces = 16
  const [helpShowing, showHelp] = useState(false)
  const [leaderboardOpen, openLeaderboard] = useState()
  const [name, setName] = useState('')
  const [playing, inSession] = useState(false)
  const [victory, hasWon] = useState(false)
  const [entryPopReady, entrySent] = useState(false)
  const [tiles, setTiles] = useState([])
  const [time, setTime] = useState();
  const [hr, setHr] = useState(0);
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  // make end game set leaderboardopen true sintead of relying on playing and victory
  // use victory for /create entry for db

  let emptyIndex = _.findIndex(tiles, t => t === 16) + 1
  const clock = `${format(hr)}:${format(min)}:${format(sec)}`

  const startGame = () => {
    if (!name) {
      try {
        console.log(DOMnickname);
        DOMnickname.style.borderBottom = "2px solid red"
      } catch (error) {
        console.log(error);
      }
      return
    }
    let population = []
    for (let i = 1; i < spaces; i++) {
      population.push(i)
    }
    population.splice(spaces, 0, 16)
    setTiles(_.shuffle(population))
    //setTiles(population)
    setHr(0)
    setMin(0)
    setSec(0)
    !playing && toggleHelp()
    hasWon(false)
    inSession(true)
  }

  const checkForWin = (arr) => {
    let inOrder = false
    console.log('Checking for win...');
    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i + 1] === arr[i] + 1) {
        inOrder = true
      } else {
        inOrder = false
        break;
      }
    }
    console.log('--Tiles in order?', inOrder);
    inOrder && endGame()
  }

  const endGame = () => {
    hasWon(true)
    inSession(false)
    const URL = 'https://k-server.netlify.com/.netlify/functions/server/create'
    const postToLeaderboard = async (name, time) => {
      await axios.post(URL, {
        name: name,
        time: clock
      }, { "Access-control-allow-origin": "*" })
        .then(res => {
          console.log('Ranking Sent =>', name, '/', time)
          entrySent(true)
        })
        .catch(e => console.log(e))
    }
    postToLeaderboard(name, clock)
    openLeaderboard(true)
  }

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

  const toggleHelp = () => {
    showHelp(true)
    setTimeout(() => {
      showHelp(false)
    }, 5000)
  }

  const toggleLB = () => {
    openLeaderboard(!leaderboardOpen)
    entrySent(true)
  }

  const setNickname = (e) => {
    try {
      setName(e.target.value)
      DOMnickname.style.borderBottom = "2px solid black"
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTime(new Date().toLocaleTimeString());
      playing && setSec(sec + 1)
      if (sec === 59) {
        setSec(0)
        setMin(min + 1)
      }
      if (min === 59 && sec === 59) {
        setMin(0)
        setHr(hr + 1)
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    }
  }, [time, sec, min]);

  const Clock = () => (
    hr > 0
      ? `${format(hr)}:${format(min)}:${format(sec)}`
      : `${format(min)}:${format(sec)}`
  )

  return (
    <>
      <div className="app">
        {(playing && !victory) &&
          <button>
            <Clock className="clock" />
          </button>
        }
        <div className="game">
          {leaderboardOpen && <Leaderboard victory={victory} time={clock} entryPopReady={entryPopReady} />}
          {(!playing && !victory) &&
            < div className="greeting">
              <img draggable={false} src={logo} alt="" />
              <h1>DisArray</h1>
              <form autoComplete="off" onSubmit={e => e.preventDefault()}>
                <input
                  id="nickname" placeholder="Enter a Nickname"
                  autoFocus={true} maxLength={8} value={name}
                  onChange={e => setNickname(e)}
                />
              </form>
            </div>
          }
          {tiles.map((tile, i) => (
            <li className="tile" key={i} onClick={(e) => playerAction(e, i + 1, tile)}>
              <div key={i}>{tile <= 15 ? tile : ''}</div>
            </li>
          ))}
        </div>
        <button className="cta" onClick={() => startGame()}>
          {!playing ? 'Start Game' : 'Scramble Tiles'}
        </button>
        <Transition
          items={helpShowing}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}>
          {helpShowing => helpShowing && (props => <p style={props} id="help" > Sort the tiles in ascending order to win.</p>)}
        </Transition>
        <div className="help-button" onClick={() => toggleHelp()}>
          <h1>?</h1>
        </div>
        <div className="lb-button" onClick={() => toggleLB()}>
          <img src={lbIcon} alt="" />
        </div>
      </div>
    </>
  );
}

ReactDOM.render(<Board />, document.getElementById('root'));
