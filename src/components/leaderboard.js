import React, { useState, useEffect } from 'react'
import Confetti from '../common/confetti';
import Loading from '../common/loading';
import axios from 'axios'

export default function Leaderboard({ time, leaderboardReady, victory }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const PROD_GET_URL = 'https://k-server.netlify.com/.netlify/functions/server/'
  const DEV_GET_URL = 'https://k-server.netlify.com/.netlify/functions/server/'

  useEffect(() => {
    const populate = async () => {
      console.log('--Fetching leaderboard entries')
      await axios.get(PROD_GET_URL)
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
      {victory && <Confetti />}
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