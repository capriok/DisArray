import React from 'react';
import Navbar from 'godspeed/build/Navbar'
import NavLink from 'godspeed/build/NavLink'
import Drawer from 'godspeed/build/Drawer'

const Nav = ({ components, setComponents, theme, setTheme, toggleHelp, toggleLB }) => {

  return (
    <>
      <Drawer onClick={() => setComponents({ ...components, drawer: !components.drawer })} open={components.drawer} bg="rgb(17, 17, 17)" color="white" padding="0px" >
        <div className="drawer">
          <h1>Game</h1>
          <p onClick={() => {
            toggleHelp()
          }}>Objective</p>
          <p onClick={() => {
            toggleLB()
          }}>Leaderboards</p>
          <p onClick={() => {
            setTheme({ ...theme, darkState: !theme.darkState })
            localStorage.setItem('DA-darkState', !theme.darkState)
          }}>Theme</p>
          <h1>Navigation</h1>
          <p><a href="https://www.kylecaprio.dev">Portfolio</a></p>
          <p><a href="https://snekkel.kylecaprio.dev">Snekkel</a></p>
        </div>
      </Drawer>
      <Navbar className="nav" title="Kyle Caprio" to="/" shadow>
        <NavLink onClick={() => setComponents({ ...components, drawer: !components.drawer })}><h1>≡</h1></NavLink>
      </Navbar>
    </>
  );
}

export default Nav