import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Transition } from 'react-spring/renderprops'
import _ from 'lodash'
import axios from 'axios'
import './App.scss';
import './common/confetti.scss'
import logo from './gallery/logo.png'
import format from './common/format'
import Leaderboard from './common/leaderboard'

export default function Board() {
  console.log = function () { }
  let DOMnickname = document.getElementById('nickname')
  const spaces = 16
  const trueDarkState = localStorage.getItem('DA-darkState') === 'true'
  let theme = {
    app: {
      backgroundColor: 'rgb(35, 35, 35)',
    },
    game: {
      backgroundColor: 'rgb(200, 200, 200)',
    },
    whiteFont: { color: 'white' },
    invertImage: { filter: 'invert(1)' }
  }
  const [darkState, setDarkState] = useState(trueDarkState)
  const [theTheme, setTheTheme] = useState({})
  const [helpShowing, showHelp] = useState(false)
  const [leaderboardOpen, openLeaderboard] = useState(false)
  const [navDrop, setDrop] = useState(false)
  const [name, setName] = useState('')
  const [playing, inSession] = useState(false)
  const [victory, hasWon] = useState(false)
  const [tiles, setTiles] = useState([])
  const [leaderboardReady, entrySent] = useState(false)
  const [time, setTime] = useState();
  const [min, setMin] = useState(2);
  const [sec, setSec] = useState(20);

  useEffect(() => trueDarkState ? setTheTheme(theme) : setTheTheme({}), [darkState, trueDarkState])
  let emptyIndex = _.findIndex(tiles, t => t === 16) + 1

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
    // setTiles(population)
    setMin(0)
    setSec(0)
    !playing && toggleHelp()
    hasWon(false)
    openLeaderboard(false)
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
    const postToLeaderboard = async () => {
      await axios.post(URL, {
        name: name,
        time: clock,
        seconds: clockInSeconds()
      }, { "Access-control-allow-origin": "*" })
        .then(res => {
          console.log('Ranking Sent =>', name, '/', time, '/', clockInSeconds())
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
    }, 1000);
    return () => {
      clearTimeout(timeout);
    }
  }, [time, sec, min]);

  const clock = `${format(min)}:${format(sec)}`
  const clockInSeconds = () => {
    let secs = (min * 60) + sec
    return secs
  }

  return (
    <>
      <div className="app" style={theTheme.app}>

        <div className="navbar">
          <h1>Kyle Caprio</h1>
          <div className="hamburger" onClick={() => setDrop(!navDrop)}><p>☰</p></div>
          {navDrop &&
            <>
              <div className="navdrop">
                <p onClick={() => toggleHelp}>Objective</p>
                <p onClick={() => toggleLB()}>Leaderboards</p>
                <p onClick={() => {
                  setDarkState(!darkState)
                  localStorage.setItem('DA-darkState', !darkState)
                }}>Dark Mode</p>
              </div>
              <div className="modal-clickout"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                onTouchStart={() => setDrop(!navDrop)}>
              </div>
            </>
          }
        </div >
        {(playing && !victory) &&
          <button>
            {clock}
          </button>
        }
        <div className="game" style={theTheme.game}>
          {leaderboardOpen && <Leaderboard victory={victory} time={clock} leaderboardReady={leaderboardReady} />}
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
          {helpShowing => helpShowing &&
            (props => <p style={props} id="help" style={theTheme.whiteFont}>
              Sort the tiles in ascending order to win.</p>
            )
          }
        </Transition>
      </div>
    </>
  );
}

ReactDOM.render(<Board />, document.getElementById('root'));

// reduce leaderboard to single name entries
// also if lodash uniqby to remove dupe times