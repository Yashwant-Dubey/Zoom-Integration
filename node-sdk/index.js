require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const KJUR = require('jsrsasign');

const {
  authorize,
  redirect,
  meetings,
  getRefreshToken,
  scheduleMeeting,
} = require('./ZoomHelper');

const ZOOM_MEETING_SDK_KEY = process.env.ZOOM_MEETING_SDK_KEY;
const ZOOM_MEETING_SDK_SECRET = process.env.ZOOM_MEETING_SDK_SECRET;

const app = express();
const port = 4000;

app.use(bodyParser.json(), cors());
app.options('*', cors());

app.post('/api/zoom/get_signature', (req, res) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: 'HS256', typ: 'JWT' };

  const oPayload = {
    sdkKey: ZOOM_MEETING_SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: ZOOM_MEETING_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    'HS256',
    sHeader,
    sPayload,
    ZOOM_MEETING_SDK_SECRET
  );

  res.json({
    signature: signature,
  });
});

app.get('/api/zoom/authorize', async function (req, res) {
  res.redirect(encodeURI(authorize()));
});

app.post('/api/zoom/redirect', async function (req, res) {
  let data = await redirect(req.body.code);
  res.json(data);
});

app.post('/api/zoom/refresh_token', async function (req, res) {
  let data = await getRefreshToken(req.body.refreshToken);
  res.json(data);
});

app.get('/api/zoom/meetings', async function (req, res) {
  let meetingList = await meetings(req.headers.authorization);
  res.json(meetingList);
});

app.post('/api/zoom/add_meeting', async function (req, res) {
  let addMeeting = await scheduleMeeting(req.headers.authorization, req.body);
  res.json(addMeeting);
});

app.listen(port, () =>
  console.log(
    `Zoom Meeting SDK Auth Endpoint Sample Node.js listening on port ${port}!`
  )
);
