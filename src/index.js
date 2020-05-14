import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash'
import axios from 'axios'
import './App.scss';
import './common/confetti.scss'
import format from './common/format'
import Leaderboard from './components/leaderboard'
import Greeting from './components/greeting';
import Navbar from './components/navbar'
const publicIp = require('public-ip');
const IPinfo = require("node-ipinfo");

export default function Board() {
  if (process.env.NODE_ENV !== 'development') console.log = function () { }
  let DOMnickname = document.getElementById('nickname')
  const isMobile = window.innerWidth < 500
  const themeStyles = {
    app: { backgroundColor: 'rgb(20, 20, 20)', },
    whiteFont: { color: 'white' },
    invertImage: { filter: 'invert(1)' }
  }
  const trueDarkState = localStorage.getItem('DA-darkState') === 'true'
  const [theme, setTheme] = useState({ darkState: trueDarkState, theTheme: {} })
  useEffect(() => {
    trueDarkState
      ? setTheme({ ...theme, theTheme: themeStyles })
      : setTheme({ ...theme, theTheme: {} })
  }, [theme.darkState, trueDarkState])

  const [components, setComponents] = useState({
    greeting: true, playing: false, help: false,
    victory: false, drawer: false, leaderboard: false
  })
  const [user, setUser] = useState({ name: '', ip: '', location: '' })
  const [counter, setCounter] = useState({ clock: '', min: 0, sec: 0 })
  const [leaderboardReady, entrySent] = useState(false)
  const spaces = 16
  const [tiles, setTiles] = useState([])
  const [help, setHelp] = useState(false)

  let emptyIndex = _.findIndex(tiles, t => t === 16) + 1
  const gameTime = `${format(counter.min)}:${format(counter.sec)}`
  const gameTimeInSeconds = () => {
    let secs = (counter.min * 60) + counter.sec
    return secs
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

  const startGame = () => {
    setComponents(() => ({ ...components, leaderboard: false }))
    if (!user.name) {
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
    setCounter({ ...counter, min: 0, sec: 0 })
    !components.playing && toggleHelp()
    setComponents(() => ({ ...components, greeting: false, playing: true, victory: false, leaderboard: false }))
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
    inOrder && endGame();
  }

  const endGame = async () => {
    setComponents({ ...components, playing: false, victory: true, leaderboard: true })
    const postToLeaderboard = async () => {
      await axios.post(process.env.REACT_APP_POST, {
        name: user.name,
        time: gameTime,
        seconds: gameTimeInSeconds(),
        ip: user.ip,
        location: user.location
      })
        .then(() => {
          console.log('Entry Sent =>', user.name, '/', gameTime, '/', gameTimeInSeconds())
          entrySent(true)
          setTiles(_.shuffle(tiles))
        })
        .catch(error => console.log(error))
    }
    postToLeaderboard()
  }

  const toggleHelp = () => {
    setComponents(() => ({ ...components, drawer: isMobile ? !components.drawer : components.drawer }))
    setHelp(true)
  }

  useEffect(() => {
    setTimeout(() => {
      setHelp(false)
    }, 5000)
  }, [help])

  const toggleLB = () => {
    entrySent(true)
    setComponents({ ...components, leaderboard: !components.leaderboard, drawer: isMobile ? !components.drawer : components.drawer })
  }

  const setNickname = (e) => {
    let name = e.target.value
    try {
      setUser({ ...user, name: name.replace(/[^a-z]/ig, '').toLowerCase() })
      DOMnickname.style.borderBottom = "2px solid black"
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter({ ...counter, clock: new Date().toLocaleTimeString() });
      components.playing && setCounter({ ...counter, sec: counter.sec + 1 })
      if (counter.sec === 59) {
        setCounter({ ...counter, min: counter.min + 1, sec: 0 })
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [counter.clock, counter.min, counter.sec]);


  useEffect(() => {
    (async () => {
      let ipAddress = await publicIp.v4()
      const token = "81d19b8e942ff8"
      const ipinfo = new IPinfo(token)
      ipinfo.lookupIp(ipAddress).then(res => {
        setUser({
          ...user, ip: ipAddress, location: res.city
        })
      })
    })()
  }, [])


  return (
    <>
      <div className="app" style={theme.theTheme.app}>
        <Navbar
          className="nav"
          title="Kyle Caprio"
          to="/" shadow
          components={components}
          setComponents={setComponents}
          toggleHelp={toggleHelp}
          toggleLB={toggleLB}
          setTheme={setTheme}
          theme={theme} />
        {help &&
          <p id="help"
            style={theme.theTheme.whiteFont}>
            Sort the tiles in ascending order to win.
          </p>}
        {(components.playing && !components.victory) &&
          <button>{gameTime}</button>
        }
        <div className="game">
          {components.leaderboard &&
            <Leaderboard user={user} components={components}
              gameTime={`${format(counter.min)}:${format(counter.sec - 1)}`}
              leaderboardReady={leaderboardReady} />
          }
          {components.greeting &&
            <Greeting user={user} setNickname={setNickname} />
          }
          {tiles.map((tile, i) => (
            <li className="tile" key={i}
              onClick={(e) => playerAction(e, i + 1, tile)}>
              <div key={i}>{tile <= 15 ? tile : ''}</div>
            </li>
          ))}
        </div>
        <button className="cta"
          onClick={() => startGame()}>{!components.playing ? 'Start Game' : 'Scramble Tiles'}
        </button>
      </div>
    </>
  );
}

ReactDOM.render(<Board />, document.getElementById('root'));
