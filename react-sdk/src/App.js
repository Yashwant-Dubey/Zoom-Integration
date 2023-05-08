import React, { useEffect } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { getAccessToken, getAuthorizeUrl } from './CommonUtils/CommonUtils';
import JoinMeeting from './JoinMeeting/JoinMeeting';
import Layout from './Layout/Layout';
import MeetingList from './MeetingList/MeetingList';
import PageNotFound from './PageNotFound/PageNotFound';
import ScheduleMeeting from './ScheduleMeeting/ScheduleMeeting';

const App = () => {
  const zoomCode = new URLSearchParams(window.location.search).get('code');
  useEffect(() => {
    if (zoomCode) {
      getAccessToken(zoomCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomCode]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MeetingList />} />
            <Route path="scheduleMeeting" element={<ScheduleMeeting />} />
            <Route path="joinMeeting" element={<JoinMeeting />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <div>
        <button className="join-meeting-button" onClick={getAuthorizeUrl}>
          Get access token
        </button>
      </div>
    </>
  );
};

export default App;
