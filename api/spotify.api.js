const cors = require('cors');
const cookieParser = require('cookie-parser');

const { login, callback, refreshToken, currentSong } = require('./spotify.controller');

module.exports = (app) => {

  app.use('/api/v1/', cors());
  app.use('/api/v1/', cookieParser());

  app.get('/api/v1/login', login);
  app.get('/api/v1/callback', callback);
  app.get('/api/v1/refresh_token', refreshToken);
  app.get('/api/v1/current-song', currentSong);
};
