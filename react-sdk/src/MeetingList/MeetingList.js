import { Fragment, useEffect, useState } from 'react';
import { MEETING_LIST } from '../CommonUtils/ApiConstant';
import { dateFormat, getRefreshToken } from '../CommonUtils/CommonUtils';
import {
  ACCESS_TOKEN_EXPIRED,
  NODE_API_END_POINT,
  ZOOM_ERROR_CODE,
} from '../CommonUtils/Constants';
import './MeetingList.css';

/**
 * @Component
 * @name MeetingList
 * @desc Component that render the zoom meetings.
 */
const MeetingList = () => {
  const [meetingList, setMeetingList] = useState([]);

  /**
   * @function
   * @name getAllMeetings
   * @desc function that returns the meeting data array from API response.
   */
  const getAllMeetings = () => {
    const zoomToken = sessionStorage.getItem('zoomToken');
    const zoomRefreshToken = sessionStorage.getItem('zoomRefreshToken');
    fetch(`${NODE_API_END_POINT}${MEETING_LIST}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: zoomToken,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.meetings?.length) {
          setMeetingList(response?.meetings);
        } else if (
          response?.code === ZOOM_ERROR_CODE &&
          response?.message === ACCESS_TOKEN_EXPIRED
        ) {
          setMeetingList([]);
          getRefreshToken(zoomRefreshToken);
        }
      })
      .catch((error) => {
        setMeetingList([]);
        console.error(error);
      });
  };

  useEffect(() => {
    if (!meetingList.length) {
      getAllMeetings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingList]);

  return (
    <>
      <div className="table_div">
        <table border="1">
          <thead>
            <tr>
              <th>Meeting Id</th>
              <th>Topic</th>
              <th>Agenta</th>
              <th>Duration</th>
              <th>Start Time</th>
              <th>Action</th>
            </tr>
          </thead>
          {meetingList?.length ? (
            meetingList.map((item) => (
              <Fragment key={item?.uuid}>
                <tbody>
                  <tr>
                    <td>{item?.id}</td>
                    <td>{item?.topic}</td>
                    <td>{item?.agenda || '-'}</td>
                    <td>{item?.duration} mins</td>
                    <td>{dateFormat(new Date(item?.start_time))}</td>
                    <td>
                      <a
                        href={item?.join_url}
                        target="_blank"
                        rel="noreferrer"
                        className="start-meeting-button"
                      >
                        Start meeting
                      </a>
                    </td>
                  </tr>
                </tbody>
              </Fragment>
            ))
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No record found
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};
export default MeetingList;
