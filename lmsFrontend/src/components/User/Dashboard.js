import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Dashboard() {
  const [server_error, setServerError] = useState({});
  const [dashboardData, setdashboardData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  //const [studentData, setstudentData] = useState([]);
  const studentId = localStorage.getItem("studentId");
  // console.log("studentId: ", studentId);
  useEffect(() => {
    // Dispatch custom event
    window.dispatchEvent(new Event("userLogin"));
    // Fetch courses
    // try {
    axios
      .get(baseURL + "/student/dashboard/" + studentId)
      .then((res) => {
        console.log(res);
        setdashboardData(res.data);
      })
      .catch(function (error) {
        if (error.response) {
          // that falls out of the range of 2xx
          if (error.response.data) {
            console.log(error.response.data.errors);
            setServerError(error.response.data.errors);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
          setServerError(error.message);
        }
        console.log(error.config);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after request is completed (either success or failure)
      });
  }, []);

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
    <div className="container mt-3 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="row">
            <div className="col-md-4">
              <div className="card border-primary">
                <h5 className="card-header bg-primary text-white">
                  Enrolled Courses
                </h5>
                <div className="card-body">
                  <h3>
                    <Link to="/my-courses">
                      {dashboardData.enrolledCourses}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-success">
                <h5 className="card-header bg-success text-white">
                  Favourite Courses
                </h5>
                <div className="card-body">
                  <h3>
                    <Link to="/favourite-courses">
                      {dashboardData.favouriteCourses}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info">
                <h5 className="card-header bg-info text-white">Assignments</h5>
                <div className="card-body">
                  <h5>
                    <Link to="/my-assignments">
                      Completed: {dashboardData.completeAssignments}, Pending:{" "}
                      {dashboardData.pendingAssignments}
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
