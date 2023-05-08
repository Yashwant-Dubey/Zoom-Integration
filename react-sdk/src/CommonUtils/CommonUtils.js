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
