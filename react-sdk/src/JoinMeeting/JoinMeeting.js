import { ZoomMtg } from '@zoomus/websdk';
import React, { useState } from 'react';
import '../App.css';
import { GET_SIGNATURE, ZOOM_JS_LIBRARY_URL } from '../CommonUtils/ApiConstant';
import {
  LEAVE_URL,
  MEETING_SDK_KEY,
  NODE_API_END_POINT,
} from '../CommonUtils/Constants';

ZoomMtg.setZoomJSLib(ZOOM_JS_LIBRARY_URL, '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

/**
 * @Component
 * @name JoinMeeting
 * @desc Component that render the join meeting screen.
 */
const JoinMeeting = () => {
  const userEmail = '';
  const [inputs, setInputs] = useState({});

  /**
   * @function
   * @name getSignature
   * @desc function that returns the generated the signature from API response.
   *
   * @param e - returns the event object.
   * @returns {array} signature object from API response.
   */
  const getSignature = (e) => {
    e.preventDefault();
    fetch(`${NODE_API_END_POINT}${GET_SIGNATURE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: inputs.meetingNumber,
        role: 0,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @function
   * @name startMeeting
   * @desc function that initiate the meeting sdk and allow access to join meeting.
   *
   * @param signature - returns the string that is allow to join the meeting.
   * @returns {object} - returns the success object if API succeed, otherwise return error object from server API call.
   */
  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block';
    ZoomMtg.init({
      leaveUrl: LEAVE_URL,
      success: (success) => {
        ZoomMtg.join({
          signature: signature,
          sdkKey: MEETING_SDK_KEY,
          meetingNumber: inputs.meetingNumber,
          passWord: inputs.passWord,
          userName: inputs.userName,
          userEmail: userEmail,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * @function
   * @name handleChange
   * @desc function that get all the user provided inputs value.
   *
   * @param event - contain the event object that holds field name, value and other required values.
   * @returns {object} - returns the success object if API succeed, otherwise return error object from server API call.
   */
  const handleChange = (event) => {
    const {
      target: { name, value },
    } = event;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <>
      <div className="App">
        <h2 className="meeting-header">Zoom Meeting</h2>
        <div className="meeting-container">
          <i className="helpText">
            **Please fill all the detail before join the meeting.
          </i>
          <div className="meeting-grid">
            <label for="meetingId">Meeting ID</label>
            <input
              type="text"
              id="meetingId"
              placeholder="Meeting ID"
              value={inputs.meetingNumber || ''}
              name="meetingNumber"
              onChange={handleChange}
            />
          </div>
          <div className="meeting-grid">
            <label for="passCode">Passcode</label>
            <input
              type="text"
              placeholder="Passcode"
              value={inputs.passWord || ''}
              name="passWord"
              onChange={handleChange}
            />
          </div>
          <div className="meeting-grid">
            <label for="username">User Name</label>
            <input
              type="text"
              placeholder="User name"
              value={inputs.userName || ''}
              name="userName"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="action-container">
          <button className="join-meeting-button" onClick={getSignature}>
            Join Meeting
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinMeeting;
