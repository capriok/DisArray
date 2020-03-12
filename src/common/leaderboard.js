import React, { useState, useEffect } from 'react'
import Confetti from './confetti';
import Loading from './loading';
import axios from 'axios'

export default function Leaderboard({ time, leaderboardReady, victory }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const URL = 'https://k-server.netlify.com/.netlify/functions/server/'

  useEffect(() => {
    const populate = async () => {
      console.log('--Fetching leaderboard entries')
      await axios.get(URL, { "Access-control-allow-origin": "*" })
        .then(res => {
          console.log(res.data)
          res.data.sort((a, b) => a.seconds - b.seconds)
          setEntries(res.data)
          setLoading(false)
        })
        .catch(e => console.log(e))
    }
    leaderboardReady && populate()
  }, [leaderboardReady])

  return (
    <>
      <div className="post-game">
        {loading && <Loading />}
        {victory &&
          <div className="head">
            <h1>You've Won!</h1>
            <p>Youre time: {time}</p>
          </div>
        }
        <div className="leaderboard">
          <div className="head">
            <h1>Leaderboards</h1>
            <div className="titles">
              <span>Rank</span>
              <span>Name</span>
              <span>Time</span>
            </div>
          </div>
          {!loading && entries.slice(0, 20).map((row, i) => (
            <div className="entries" key={i}>
              <span>{i + 1}</span>
              <span>{row.name}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>
      </div>
      {victory && <Confetti />
      }
    </>
  )
}
