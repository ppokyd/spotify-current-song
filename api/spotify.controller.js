const got = require('got');

const STATE_KEY = 'spotify_auth_state';

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const stringify = obj => new URLSearchParams(obj).toString();

const login = async (req, res) => {
  const state = generateRandomString(16);
  const scopes = ['user-read-currently-playing'];

  res.cookie(STATE_KEY, state);

  const query = stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: process.env.REDIRECT_URI,
    state: state
  });

  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
};

const callback = async (req, res) => {
  try {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

    if (state === null || state !== storedState) {
      res.redirect(`/#${stringify({ error: 'state_mismatch' })}`);
    } else {
      res.clearCookie(STATE_KEY);
      const token = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');
      const { access_token, refresh_token } = await got.post('https://accounts.spotify.com/api/token', {
        headers: {
          'Authorization': `Basic ${token}`
        },
        form: {
          code,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: 'authorization_code'
        }
      }).json();

      res.cookie('access_token', access_token);
      res.cookie('refresh_token', refresh_token);

      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');
    const { access_token } = await got.post('https://accounts.spotify.com/api/token', {
      headers: {
        'Authorization': `Basic ${token}`
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: req.cookies.refresh_token
      }
    }).json();

    res.cookie('access_token', access_token);

    res.send({ access_token });
  } catch (error) {
    console.error(error);
  }
};

const currentSong = async (req, res) => {
  try {
    const response = await got.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${req.cookies.access_token}`
      }
    }).json();

    res.send(response);
  } catch (error) {
    res.send({ status: 401 });
  }
};

module.exports = {
  login,
  callback,
  refreshToken,
  currentSong
};
