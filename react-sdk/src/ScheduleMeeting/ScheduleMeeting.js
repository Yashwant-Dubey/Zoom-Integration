import React, { useState } from 'react';
import '../App.css';
import { SCHEDULE_MEETING } from '../CommonUtils/ApiConstant';
import { getRefreshToken } from '../CommonUtils/CommonUtils';
import {
  ACCESS_TOKEN_EXPIRED,
  NODE_API_END_POINT,
  ZOOM_ERROR_CODE,
} from '../CommonUtils/Constants';

/**
 * @Component
 * @name ScheduleMeeting
 * @desc Component that render the schedule meeting form.
 */
const ScheduleMeeting = () => {
  const [inputs, setInputs] = useState({});

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

  /**
   * @function
   * @name addMeeting
   * @desc function that create/schedule a meeting on the zoom with user provided input data.
   *
   * @param event - returns the event object.
   * @returns {object} returns the object of added meeting data like meeting id, agenda, start time,
   * join URL etc. if API succeed otherwise returns error object.
   */
  const addMeeting = (event) => {
    event.preventDefault();
    const reqParam = {
      ...inputs,
      start_time: new Date(
        `${inputs.startDate} ${inputs.startTime}`
      ).toISOString(),
      duration: 40,
    };
    const zoomToken = sessionStorage.getItem('zoomToken');
    const zoomRefreshToken = sessionStorage.getItem('zoomRefreshToken');
    fetch(`${NODE_API_END_POINT}${SCHEDULE_MEETING}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: zoomToken,
      },
      body: JSON.stringify(reqParam),
    })
      .then((res) => res.json())
      .then((response) => {
        if (
          response?.code === ZOOM_ERROR_CODE &&
          response?.message === ACCESS_TOKEN_EXPIRED
        ) {
          getRefreshToken(zoomRefreshToken);
        } else {
          window.location.replace('/');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="App">
        <h2 className="meeting-header">Schedule Meeting</h2>
        <form onSubmit={addMeeting}>
          <div className="meeting-container">
            <i className="helpText">
              **Please fill all the detail before schedule the meeting.
            </i>

            <div className="meeting-grid">
              <label for="topic">Topic</label>
              <input
                type="text"
                id="topic"
                placeholder="Meeting topic"
                value={inputs.topic || ''}
                name="topic"
                onChange={handleChange}
                required={true}
              />
            </div>
            <div className="meeting-grid">
              <label for="agenda">Agenda</label>
              <input
                type="text"
                id="agenda"
                placeholder="Meeting agenda"
                value={inputs.agenda || ''}
                name="agenda"
                onChange={handleChange}
                required={true}
              />
            </div>

            <div className="meeting-grid">
              <label for="start_time">Schedule Date</label>
              <input
                type="text"
                id="startDate"
                placeholder="mm/dd/yyyy"
                value={inputs.startDate || ''}
                name="startDate"
                onChange={handleChange}
                required={true}
              />
            </div>

            <div className="meeting-grid">
              <label for="startTime">Schedule time</label>
              <input
                type="text"
                id="startTime"
                placeholder="HH:mm"
                value={inputs.startTime || ''}
                name="startTime"
                onChange={handleChange}
                required={true}
              />
            </div>
          </div>
          <div className="action-container">
            <button type="submit" className="join-meeting-button">
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScheduleMeeting;
