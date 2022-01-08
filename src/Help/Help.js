import React from 'react';

import './Help.scss';

function Help() {
  return (
    <div className="Help">
      <a href="./">Go back to current song</a>
      <video controls autoplay src="https://user-images.githubusercontent.com/10085393/148653385-fd39404c-e87e-4ada-b56f-7dcef8d2ce6f.mp4"></video>
    </div>
  );
}

export default Help;
