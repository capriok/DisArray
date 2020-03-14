import React from 'react';

const Navbar = (props) => {
  const { darkState, setDarkState, toggleHelp, toggleLB, navPopOpen, navPop } = props
  return (
    <>
      <div className="navbar">
        <h1>Kyle Caprio</h1>
        {navPop && <>
          <div className="navpop">
            <p onClick={() => { toggleHelp(); navPopOpen(!navPop) }}>Objective</p>
            <p onClick={() => { toggleLB(); navPopOpen(!navPop) }}>Leaderboards</p>
            <p onClick={() => {
              setDarkState(!darkState); localStorage.setItem('DA-darkState', !darkState)
            }}>Theme</p>
          </div>
          <div className="modal-clickout"
            onTouchStart={() => navPopOpen(!navPop)}>
          </div>
        </>}
        <div className="hamburger" onClick={() => navPopOpen(!navPop)}><p>☰</p></div>


      </div>
    </>
  );
}

export default Navbar
