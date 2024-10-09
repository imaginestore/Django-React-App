import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Sidebar() {
  const [notifData, setnotifData] = useState([]);
  const studentId = localStorage.getItem("studentId");
  // Fetch Notifications
  useEffect(() => {
    try {
      axios
        .get(baseURL + "/student/fetch-all-notifications/" + studentId)
        .then((res) => {
          console.log(res);
          setnotifData(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="card">
      <div className="list-group list-group-flush">
        <Link
          to="/user-dashboard"
          className="list-group-item list-group-item-action text-light"
          style={{ backgroundColor: "#A6071C" }} // #2A4E7B ---> blue   #A6071C ---> red
        >
          Dashboard
        </Link>
        <Link
          to="/my-courses"
          className="list-group-item list-group-item-action"
        >
          My Courses
        </Link>
        <Link
          to="/my-teachers"
          className="list-group-item list-group-item-action"
        >
          My Teachers
        </Link>
        <Link
          to="/favourite-courses"
          className="list-group-item list-group-item-action"
        >
          Favourite Courses
        </Link>
        <Link
          to="/recommended-courses"
          className="list-group-item list-group-item-action"
        >
          Recommended Courses
        </Link>
        <Link
          to="/my-assignments"
          className="list-group-item list-group-item-action"
        >
          Assignments{" "}
          <span className="float-end badge bg-danger mt-1">
            {notifData.length}
          </span>
        </Link>
        <Link to="/my-exams" className="list-group-item list-group-item-action">
          Examinations
        </Link>
        <Link
          to="/exam-list"
          className="list-group-item list-group-item-action"
        >
          Exam Results
        </Link>
        {/* <Link to="/tts" className="list-group-item list-group-item-action">
          Text to Speech
        </Link> */}
        <Link
          to="/profile-settings"
          className="list-group-item list-group-item-action"
        >
          Profile Settings
        </Link>
        <Link
          to="/change-password"
          className="list-group-item list-group-item-action"
        >
          Change Password
        </Link>
        <Link
          to="/user-logout"
          className="list-group-item list-group-item-action text-danger"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
