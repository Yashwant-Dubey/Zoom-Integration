const authEndpoint = 'http://localhost:4000';
const authorizeUrl = `${authEndpoint}/api/zoom/authorize`;

export const getAuthorizeUrl = () => {
  window.location.replace(authorizeUrl);
};

export const getAccessToken = (zoomCode) => {
  fetch(`${authEndpoint}/api/zoom/redirect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: zoomCode,
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log('response == ', response);
      sessionStorage.setItem('zoomToken', response.access_token);
      sessionStorage.setItem('zoomRefreshToken', response.refresh_token);
      sessionStorage.setItem('expireIn', response.expires_in);
      window.location.replace('/');
    })
    .catch((error) => {
      console.error('error == ', error);
    });
};

export const getRefreshToken = (zoomRefreshToken) => {
  fetch(`${authEndpoint}/api/zoom/refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: zoomRefreshToken,
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      sessionStorage.setItem('zoomToken', response.access_token);
      sessionStorage.setItem('zoomRefreshToken', response.refresh_token);
      window.location.replace('/');
    })
    .catch((error) => {
      console.error(error);
    });
};

/**
 * @function
 * @name dateFormat
 * @desc function that returns the required date string from date object
 *
 * @param date: object that contain the date object.
 * @returns {string} formatted date string after conversion.
 */
export const dateFormat = (date) => {
  let dateString =
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + date.getDate()).slice(-2) +
    '/' +
    date.getFullYear() +
    ' ' +
    formatAMPM(date);
  return dateString;
};

/**
 * @function
 * @name formatAMPM
 * @desc function that returns the formatted time with AM/PM.
 *
 * @param date: object that contain the date object.
 * @returns {string} formatted date string after conversion.
 */
export const formatAMPM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? (hours < 10 ? '0' + hours : hours) : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};
