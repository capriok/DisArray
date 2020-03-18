import React, { useState, useEffect } from 'react'
import Confetti from '../common/confetti';
import Loading from '../common/loading';
import axios from 'axios'

export default function Leaderboard({ user, components, gameTime, leaderboardReady }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const populate = async () => {
      console.log('--Fetching leaderboard entries')
      await axios.get(process.env.REACT_APP_PROD_GET_URL)
        .then(res => {
          res.data.sort((a, b) => a.seconds - b.seconds)
          console.log(res.data)
          setEntries(res.data)
          setLoading(false)
        })
        .catch(e => console.log(e))
    }
    leaderboardReady && populate()
  }, [leaderboardReady])

  return (
    <>
      {components.victory && <Confetti />}
      <div className="post-game">
        {loading && <Loading />}
        {components.victory &&
          <div className="head">
            <h1>You've Won!</h1>
            <p>{user.name} | {gameTime}</p>
          </div>
        }
        <div className="leaderboard">
          <div className="head">
            <h1>Leaderboard</h1>
            <div className="titles">
              <span>Rank</span>
              <span>Name</span>
              <span>Time</span>
            </div>
          </div>
          <div className="entries-scroll">
            {!loading && entries.slice(0, 20).map((row, i) => (
              <div className="entries" key={i}>
                <span>{i + 1}</span>
                <span style={{ textTransform: 'capitalize' }}>{row.name}</span>
                <span>{row.time}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}