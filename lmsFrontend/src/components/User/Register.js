import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeToken, storeUserInfo } from "../LocalStorageService";
import axios from "axios";
//const baseURL = "http://127.0.0.1:8000/api/student/";
// const baseURL1 = "http://127.0.0.1:8000/api/user/";
const baseURL1 = `${process.env.REACT_APP_API_BASE_URL}/user/`;

function Register() {
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const [delayDuration, setDelayDuration] = useState(5000);
  const [studentData, setstudentData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    status: "",
    tc: null,
    // fullName: "",
    // email: "",
    // userName: "",
    // password: "",
    // gender: "",
    // interestedCategories: "",
    // status: "",
    // otp_digits: "",
  });
  // Change Element Value
  const handleChange = (event) => {
    setstudentData({
      ...studentData,
      [event.target.name]: event.target.value,
    });
  };
  // End

  // Submit form
  const submitForm = () => {
    //const otp_digits = Math.floor(Math.floor(100000 + Math.random() * 900000));
    const studentFormData = new FormData();
    studentFormData.append("username", studentData.username);
    studentFormData.append("email", studentData.email);
    studentFormData.append("password", studentData.password);
    studentFormData.append("password2", studentData.password2);
    studentFormData.append("usertype", "student");
    studentFormData.append("tc", studentData.tc);
    // studentFormData.append("fullName", studentData.fullName);
    // studentFormData.append("email", studentData.email);
    // studentFormData.append("userName", studentData.userName);
    // studentFormData.append("password", studentData.password);
    // studentFormData.append("usertype", "teacher");
    // studentFormData.append("gender", studentData.gender);
    // studentFormData.append(
    //   "interestedCategories",
    //   studentData.interestedCategories
    // );
    // studentFormData.append("otp_digits", otp_digits);
    // try {
    //   axios.post(baseURL, studentFormData).then((response) => {
    //     navigate("/verify-student/" + response.data.id);
    axios
      .post(baseURL1 + "register/", studentFormData)
      .then((response) => {
        //console.log("Server Response: ", response);
        storeToken(response.data.token);
        storeUserInfo(
          response.data.user_id,
          response.data.user_name,
          response.data.user_type
        );
        setstudentData({
          username: "",
          email: "",
          password: "",
          password2: "",
          status: "success",
          tc: null,
        });
        setTimeout(() => {
          navigate("/user-personal-info-register/");
        }, delayDuration);
        //navigate("/user-personal-info-register/");
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data) {
            // Handle field errors (assuming error.response.data has non_field_errors key)
            // console.log(typeof error.response.data.errors);
            // console.log(error.response.data.errors);
            setServerError(error.response.data.errors);
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log("Error", error.message);
          // Handle any other errors
          setServerError(error.message);
        }
        console.log(error.config);
      });
    // } catch (error) {
    //   console.log(error);
    //   setstudentData({ status: "error" });
    // }
  };
  // End
  useEffect(() => {
    document.title = "Student Register";
  });
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-6 offset-3">
          {/* {console.log("Local State: ", server_error)} */}
          {/* {server_error.non_field_errors
            ? console.log(server_error.non_field_errors[0])
            : ""}
          {server_error.username ? console.log(server_error.username[0]) : ""}
          {server_error.email ? console.log(server_error.email[0]) : ""}
          {server_error.password ? console.log(server_error.password[0]) : ""}
          {server_error.password2 ? console.log(server_error.password2[0]) : ""}
          {server_error.tc ? console.log(server_error.tc[0]) : ""} */}
          {studentData.status === "success" && (
            <div class="alert alert-success" role="alert">
              <span className="alert-link text-success">
                Registration successful!
              </span>
              <br /> You will be redirected to another page to complete the
              registration process.
            </div>
          )}
          {studentData.status === "error" && (
            <p className="text-danger">Something went wrong!</p>
          )}
          <div className="card">
            <h5 className="card-header">User Register</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="username"
                  id="username"
                  className="form-control"
                  value={studentData.username}
                />
                {server_error.username && (
                  <small className="text-danger ms-2">
                    {server_error.username ? server_error.username[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={studentData.email}
                />
                {server_error.email && (
                  <small className="text-danger ms-2">
                    {server_error.email ? server_error.email[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  value={studentData.password}
                />
                {server_error.password && (
                  <small className="text-danger ms-2">
                    {server_error.password ? server_error.password[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password2" className="form-label">
                  Confirm Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  className="form-control"
                  name="password2"
                  id="password2"
                  value={studentData.password2}
                />
                {server_error.password2 && (
                  <small className="text-danger ms-2">
                    {server_error.password2 ? server_error.password2[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    onChange={handleChange}
                    className="form-check-input"
                    type="checkbox"
                    name="tc"
                    value={true}
                    id="tc"
                  />
                  <label className="form-check-label" htmlFor="tc">
                    <small>I agree to terms and conditions</small>
                  </label>
                  <span>
                    {server_error.tc && (
                      <small className="text-danger ms-2">
                        {server_error.tc
                          ? "You must agree to terms and conditions."
                          : ""}
                      </small>
                    )}
                  </span>
                </div>
              </div>
              {/* <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="form-control"
                  value={studentData.fullName}
                />
              </div> */}
              {/* <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  onChange={handleChange}
                  className="form-select"
                  name="gender"
                  id="gender"
                  value={studentData.gender}
                >
                  <option default>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="interests" className="form-label">
                  Interests
                </label>
                <textarea
                  onChange={handleChange}
                  name="interestedCategories"
                  id="interests"
                  className="form-control"
                  value={studentData.interestedCategories}
                ></textarea>
                <div id="interestsHelp" className="form-text">
                  Python, Django, Javascript etc.
                </div>
              </div> */}
              <button
                type="submit"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Register
              </button>
              {/* </form> */}
              {server_error.non_field_errors && (
                <div className="mt-3 alert alert-danger" role="alert">
                  <div>
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <small className="ms-2">
                      {server_error.non_field_errors
                        ? server_error.non_field_errors[0]
                        : ""}
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
