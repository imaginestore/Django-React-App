import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  removeUserInfo,
  removeToken,
} from "../LocalStorageService";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api/";
//const baseURL1 = "http://127.0.0.1:8000/api/user/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/`;

function UserPersonalInformationRegister() {
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const [delayDuration, setDelayDuration] = useState(5000);
  let { user_id, user_name, user_type } = getUserInfo();
  const [studentData, setstudentData] = useState({
    fullName: "",
    gender: "",
    mobileNo: "",
    interestedCategories: "",
    status: "",
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
    studentFormData.append("user", user_id);
    studentFormData.append("fullName", studentData.fullName);
    studentFormData.append("gender", studentData.gender);
    studentFormData.append("mobileNo", studentData.mobileNo);
    studentFormData.append(
      "interestedCategories",
      studentData.interestedCategories
    );
    // studentFormData.append("otp_digits", otp_digits);
    // try {
    //   axios.post(baseURL, studentFormData).then((response) => {
    //     navigate("/verify-student/" + response.data.id);
    axios
      .post(baseURL + "user-personal-info-register/", studentFormData)
      .then((response) => {
        //storeToken(response.data.token);
        setstudentData({
          fullName: "",
          gender: "",
          mobileNo: "",
          interestedCategories: "",
          status: "success",
        });
        removeToken();
        removeUserInfo();
        setTimeout(() => {
          navigate("/user-login");
        }, delayDuration);
        //navigate("/user-login");
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data) {
            setServerError(error.response.data.errors);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          setServerError(error.message);
        }
        console.log(error.config);
      });
  };
  // End
  useEffect(() => {
    document.title = "User Personal Information Register";
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
                Your information is saved. Thank you!
              </span>
              <br />
              You will be redirected to login page to get going.
            </div>
          )}
          {studentData.status === "error" && (
            <p className="text-danger">Something went wrong!</p>
          )}
          <div className="card">
            <h5 className="card-header">User Personal Information Register</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="form-control"
                  value={studentData.fullName}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Gender <span className="text-danger">*</span>
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
                <label htmlFor="mobileNo" className="form-label">
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  name="mobileNo"
                  id="mobileNo"
                  value={studentData.mobileNo}
                />
                {server_error.mobileNo && (
                  <small className="text-danger ms-2">
                    {server_error.mobileNo ? server_error.mobileNo[0] : ""}
                  </small>
                )}
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
                  Maths, Physics, Geography etc.
                </div>
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Save
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

export default UserPersonalInformationRegister;
