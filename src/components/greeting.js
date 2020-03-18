import React from 'react'
import logo from '../gallery/logo.png'

const Greeting = ({ user, setNickname }) => {
  return (
    <>
      <div className="greeting">
        <img draggable={false} src={logo} alt="" />
        <h1>DisArray</h1>
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            id="nickname" placeholder="Enter a Nickname"
            autoFocus={true} maxLength={8} value={user.name}
            onChange={e => setNickname(e)}
          />
        </form>
      </div>
    </>
  )
}

export default Greeting