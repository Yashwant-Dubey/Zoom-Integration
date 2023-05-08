const fetch = require('node-fetch');

const authorize = () => {
  return `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${process.env.ZOOM_REDIRECT_URL}`;
};

/**
 * @function
 * @name redirect
 * @desc function that returns the access token, refresh token and expire in data.
 *
 *@param code - holds the unique code string that helps for get the authorization code.
 * @returns {object} - returns the object that holds the access token, refresh token and expire in value.
 */
const redirect = async (code) => {
  const b = Buffer.from(
    process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET
  );

  const zoomRes = await fetch(
    `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${process.env.ZOOM_REDIRECT_URL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${b.toString('base64')}`,
      },
    }
  );

  const zoomData = await zoomRes.json();
  return zoomData;
};

/**
 * @function
 * @name getRefreshToken
 * @desc function that returns the updated access token, refresh token and expire in data.
 *
 *@param zoomRefreshToken - holds the refresh token value to get new access token.
 * @returns {object} - returns the object that holds the updated access token, refresh token and expire in value.
 */
const getRefreshToken = async (zoomRefreshToken) => {
  const b = Buffer.from(
    process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET
  );
  const zoomRes = await fetch(
    `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${zoomRefreshToken}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${b.toString('base64')}`,
      },
    }
  );
  const zoomData = await zoomRes.json();
  return zoomData;
};

/**
 * @function
 * @name meetings
 * @desc function that returns the list of zoom meetings which are scheduled.
 *
 *@param zoomToken - holds the access token value that used in the zoom meeting list API.
 * @returns {object} - returns the object that holds the meeting list array, total records etc.
 */
const meetings = async (zoomToken) => {
  const meetingList = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${zoomToken}`,
    },
  });
  const meetingLists = await meetingList.json();
  return meetingLists;
};

const scheduleMeeting = async (zoomToken, reqBody) => {
  const addMeeting = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zoomToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  });
  const addMeetingRes = await addMeeting.json();
  return addMeetingRes;
};

module.exports = {
  authorize,
  redirect,
  meetings,
  getRefreshToken,
  scheduleMeeting,
};
