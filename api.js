
const express = require('express');
const { join } = require('path');
const SpotifyApi = require('./api/spotify.api');

const app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const PORT = Number(process.env.PORT || 4200);
const DIST_FOLDER = join(process.cwd(), 'build');


SpotifyApi(app);

app.use('/static', express.static(`${DIST_FOLDER}/static`, {
  maxAge: '1y'
}));

app.get('/', (req, res) => {
  res.sendFile(`${DIST_FOLDER}/index.html`);
});

app.listen(PORT, () => {
  console.log(`Node Express HTTP server listening on http://localhost:${PORT}`);
});
