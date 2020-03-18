import React from 'react';

const Navbar = ({ theme, setTheme, components, setComponents, toggleHelp, toggleLB }) => {
  const isMobile = window.innerWidth < 500
  const setNavPop = () => {
    setComponents({ ...components, navPop: !components.navPop })
  }
  return (
    <>
      <div className="navbar">
        <h1>Kyle Caprio</h1>
        {components.navPop && <>
          <div className="navpop">
            <p onClick={() => {
              toggleHelp()
              isMobile && setNavPop()
            }}>Objective</p>
            <p onClick={() => {
              toggleLB()
              isMobile && setNavPop()
            }}>Leaderboards</p>
            <p onClick={() => {
              setTheme({ ...theme, darkState: !theme.darkState })
              localStorage.setItem('DA-darkState', !theme.darkState)
            }}>Theme</p>
          </div>
          <div className="modal-clickout"
            onTouchStart={() => setNavPop()}>
          </div>
        </>}
        <div className="hamburger" onClick={() => setNavPop()}><p>☰</p></div>


      </div>
    </>
  );
}

export default Navbar