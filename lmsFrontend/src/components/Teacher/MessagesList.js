import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function MessagesList(props) {
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
          const objDIV = document.getElementById("msgList");
          objDIV.scrollTop = objDIV.scrollHeight;
        });
    } catch (error) {
      console.log(error);
    }
  };

  const msgList = {
    height: "500px",
    overFlow: "auto",
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
      <p>
        <span className="btn btn-secondary" onClick={fetchMsgs} title="Refresh">
          <i className="bi bi-bootstrap-reboot"></i>
        </span>
      </p>
      <div style={msgList} id="msgList">
        {msgData.map((row, index) => (
          <div className="row mb-4">
            {row.msgFrom !== "teacher" && (
              <div className="col-5">
                <div className="alert alert-primary mb-1">{row.msgText}</div>
                <small className="text-muted">{row.msgTime}</small>
              </div>
            )}
            {row.msgFrom === "teacher" && (
              <div className="col-5 offset-7">
                <div className="alert alert-success mb-1">{row.msgText}</div>
                <small className="text-muted">{row.msgTime}</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default MessagesList;
