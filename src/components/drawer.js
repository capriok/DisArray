import React from 'react'
import Drawer from 'godspeed/build/Drawer'
const SideDrawer = ({ setDrawer, components, toggleHelp, toggleLB, theme, setTheme }) => {

  const isMobile = window.innerWidth < 500

  return (
    <Drawer onClick={() => setDrawer()} open={components.drawer} bg="rgb(17, 17, 17)" color="white" padding="0px" >
      <div className="drawer">
        <h1>Game</h1>
        <p onClick={() => {
          toggleHelp()
          isMobile && setDrawer()
        }}>Objective</p>
        <p onClick={() => {
          toggleLB()
          isMobile && setDrawer()
        }}>Leaderboards</p>
        <p onClick={() => {
          setTheme({ ...theme, darkState: !theme.darkState })
          localStorage.setItem('DA-darkState', !theme.darkState)
        }}>Theme</p>
        <h1>Navigation</h1>
        <p><a href="https://www.kylecaprio.dev">Portfolio</a></p>
        <p><a href="https://snekkel.kylecaprio.dev">Snekkel</a></p>
        <div className="modal-clickout" onTouchStart={() => setDrawer()}>
        </div>
      </div>
    </Drawer>
  )
}

export default SideDrawer
