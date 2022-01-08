import React, { useEffect, useState } from 'react';

import './App.scss';
import CurrentSong from './CurrentSong/CurrentSong';

function App() {
  const [item, setData] = useState();
  const [loggedIn, setLoggedIn] = useState(true);

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
  };

  // getCurrentSong();
  useEffect(() => {
    if (loggedIn) {
      const interval = setInterval(() => getCurrentSong(), 3e3);
      return () => clearInterval(interval);
    }
  }, [loggedIn]);

  return (
    <div className="App">
      { loggedIn === false && <a className="login" href="./api/v1/login">Login</a> }
      { item && <CurrentSong {...item} /> }
    </div>
  );
}

export default App;
