import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function UserMessagesList(props) {
  const [msgData, setmsgData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  // Fetch messages list when the page loads
  useEffect(() => {
    try {
      axios
        .get(
          baseURL + "/get-messages/" + props.teacher_id + "/" + props.student_id
        )
        .then((res) => {
          setmsgData(res.data);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  const fetchMsgs = () => {
    try {
      axios
        .get(
          baseURL + "/get-messages/" + props.teacher_id + "/" + props.student_id
        )
        .then((res) => {
          setmsgData(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const objDIV = document.getElementById("msgList");
    if (objDIV) {
      objDIV.scrollTop = objDIV.scrollHeight;
    }
  }, [msgData]); // This will run every time msgData updates

  const DateTimeComponent = ({ dateString }) => {
    const formattedDateTime = moment(dateString).format("MM-DD-YYYY HH:mm:ss");

    return <span>{formattedDateTime}</span>;
  };

  const msgList = {
    height: "450px",
    overflowY: "auto",
    overflowX: "hidden",
    margin: 0,
    padding: "10px",
    wordWrap: "breakWord",
    maxWidth: "100%",
    boxSizing: "borderBox",
  };

  if (loading) {
    return (
      <div className="container mt-4 mb-4">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="py-2 mb-2 bg-body-secondary border border-secondary-subtle rounded">
        <span
          className="btn btn-secondary ms-2"
          onClick={fetchMsgs}
          title="Refresh"
        >
          <i className="bi bi-bootstrap-reboot"></i>
        </span>
      </p>
      <div
        className="bg-light border border-primary-subtle rounded"
        style={msgList}
        id="msgList"
      >
        {msgData.map((row, index) => (
          <div className="row mb-4">
            {row.msgFrom !== "student" && (
              <div className="col-5">
                <div className="alert alert-primary mb-1 py-0">
                  {row.msgText}
                </div>
                <small className="text-muted">
                  <DateTimeComponent dateString={row.msgTime} />
                </small>
              </div>
            )}
            {row.msgFrom === "student" && (
              <div className="col-5 offset-7">
                <div className="alert alert-success mb-1 py-0">
                  {row.msgText}
                </div>
                <small className="text-muted">
                  <DateTimeComponent dateString={row.msgTime} />
                </small>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default UserMessagesList;
