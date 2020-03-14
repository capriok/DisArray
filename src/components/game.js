import React from 'react'
import logo from '../gallery/logo.png'
import Leaderboard from './leaderboard'

const Game = (props, { tiles }) => {
  const { leaderboardOpen, playing, victory, name, setNickname, playerAction } = props
  return (
    <>
      {leaderboardOpen && <Leaderboard />}
      {!leaderboardOpen && (!playing && !victory) &&
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
      {!leaderboardOpen && tiles.map((tile, i) => (
        <li className="tile" key={i} onClick={(e) => playerAction(e, i + 1, tile)}>
          <div key={i}>{tile <= 15 ? tile : ''}</div>
        </li>
      ))}
    </>
  )
}

export default Game
