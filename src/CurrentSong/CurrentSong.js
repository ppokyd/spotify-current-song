import React from 'react';

import './CurrentSong.scss';

function CurrentSong(item) {
  return (
    <div className="CurrentSong">
      <div className="cover">
        <img src={item.album.images[2].url} alt="cover"/>
      </div>
      <div className="song">
        <div className="name">{ item.name }</div>
        <div className="artist">{ item.artists.map(a => a.name).join(', ') }</div>
      </div>
    </div>
  );
}

export default CurrentSong;
