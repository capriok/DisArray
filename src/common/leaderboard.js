import React, { useState, useEffect } from 'react'
import Confetti from './confetti';
import axios from 'axios'

export default function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const url = 'http://disarray-leaderboard.herokuapp.com/leaderbaoard'

  useEffect(() => {
    const populate = async () => {
      await axios.get('http://localhost:5000/leaderboard/')
        .then(res => {
          console.log(res)
          setEntries(res.data)
          setLoading(false)
        })
        .catch(e => console.log(e))
    }
    populate()
  }, [])

  return (
    <>
      <div className="post-game">
        <div className="head">
          <h1>You've Won!</h1>
          <p>Youre time: {'3:50'}</p>
        </div>
        <div className="leaderboard">
          <h1>Leaderboards</h1>
          <div className="titles">
            <span>Rank</span>
            <span>Name</span>
            <span>Time</span>
          </div>
          {loading
            ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            : entries.map((row, i) => (
              <div className="entries" key={i}>
                <span>{i + 1}</span>
                <span>{row.name}</span>
                <span>{row.time}</span>
              </div>
            ))}
        </div>
      </div>
      <Confetti />
    </>
  )
}
