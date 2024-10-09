import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherLogin1() {
  const navigate = useNavigate();
  const [teacherLoginData, setteacherLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, seterrorMsg] = useState("");

  const handleChange = (event) => {
    setteacherLoginData({
      ...teacherLoginData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const teacherFormData = new FormData();
    teacherFormData.append("email", teacherLoginData.email);
    teacherFormData.append("password", teacherLoginData.password);

    try {
      axios.post(baseURL + "/teacher-login", teacherFormData).then((res) => {
        if (res.data.bool === true) {
          if (res.data.login_via_otp === true) {
            navigate("/verify-teacher/" + res.data.teacher_id);
          } else {
            localStorage.setItem("teacherLoginStatus", true);
            localStorage.setItem("teacherId", res.data.teacher_id);
            //navigate("/teacher-dashboard");
            window.location.href = "/teacher-dashboard";
          }
        } else {
          seterrorMsg(res.data.msg);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  if (teacherLoginStatus === "true") {
    //navigate("/teacher-dashboard");
    window.location.href = "/teacher-dashboard";
  }

  useEffect(() => {
    document.title = "Teacher Login";
  });
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <small>Welcome, </small>
        <div className="col-6 offset-3">
          <div className="card">
            <h5 className="card-header">Teacher Login</h5>
            <div className="card-body">
              {errorMsg && <p className="text-danger">{errorMsg}</p>}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={teacherLoginData.email}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  value={teacherLoginData.password}
                  minLength="6"
                  required
                />
              </div>
              {/* <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="rememberme"
                    id="rememberme"
                  />
                  <label className="form-check-label" htmlFor="rememberme">
                    Remember Me
                  </label>
                </div> */}
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Login
              </button>
              {/* </form> */}
              <p className="mt-3">
                Don't have an account?
                <Link to="/signup" className="text-secondary">
                  Sign Up
                </Link>
              </p>
              <p className="mt-3">
                Forgot your Password?
                <Link to="/reset-password" className="text-secondary">
                  Reset Password
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// const mapStateToProps = (state) => {
//   // is authenticated?
// };

export default TeacherLogin1;
