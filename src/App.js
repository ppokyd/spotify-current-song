import React, { useEffect, useState } from 'react';
import CurrentSong from './CurrentSong/CurrentSong';
import Login from './Login/Login';
import Help from './Help/Help';

import './App.scss';

function App() {
  const [item, setData] = useState();
  const [loggedIn, setLoggedIn] = useState(true);
  const isHelp = window.location.hash.includes('help');

  const getCurrentSong = () => {
    fetch('./api/v1/current-song')
    .then(res => res.json())
    .then(res => {
      if (res.item) {
        setData(res.item)
      } else if (res.status === 401) {
        setLoggedIn(false);
      }
    })
    .catch(() => setLoggedIn(false))
  };

  useEffect(() => {
    if (loggedIn) {
      const interval = setInterval(() => getCurrentSong(), 3e3);
      return () => clearInterval(interval);
    }
  }, [loggedIn]);

  return (
    <div className="App">
      { isHelp === false && (
        <>
          { loggedIn === false && <Login /> }
          { loggedIn === true && item && <CurrentSong {...item} /> }
        </>
      )}
      { isHelp === true && <Help /> }
    </div>
  );
}

export default App;
