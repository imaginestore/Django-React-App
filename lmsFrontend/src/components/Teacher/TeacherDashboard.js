import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../LocalStorageService";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherDashboard() {
  const [server_error, setServerError] = useState({});
  const [dashboardData, setdashboardData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  //const [teacherData, setteacherData] = useState([]); // for welcome message
  const teacherId = localStorage.getItem("teacherId");
  // ----------- userEffect() start ----------------
  useEffect(() => {
    window.dispatchEvent(new Event("userLogin"));
    // Fetch courses
    axios
      .get(baseURL + "/teacher/dashboard/" + teacherId)
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
    // End
  }, []);
  // ----------- userEffect() end ----------------

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
    <div className="container mb-4 mt-3">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="row">
            <div className="col-md-4">
              <div className="card border-primary">
                <h5 className="card-header bg-primary text-white">
                  Total Courses
                </h5>
                <div className="card-body">
                  <h3>
                    <Link to="/teacher-courses">
                      {dashboardData.totalTeacherCourses}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-success">
                <h5 className="card-header bg-success text-white">
                  Total Students
                </h5>
                <div className="card-body">
                  <h3>
                    <Link to="/teacher-users">
                      {dashboardData.totalTeacherStudents}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info">
                <h5 className="card-header bg-info text-white">
                  Total Chapters
                </h5>
                <div className="card-body">
                  <h3>
                    <Link to="/teacher-courses">
                      {dashboardData.totalTeacherChapters}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeacherDashboard;
