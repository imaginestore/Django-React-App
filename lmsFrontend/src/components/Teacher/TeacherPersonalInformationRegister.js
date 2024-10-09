import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  removeUserInfo,
  removeToken,
} from "../LocalStorageService";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
//import Swal from "sweetalert2";
//import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api/";
//const baseURL1 = "http://127.0.0.1:8000/api/user/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/`;

function TeacherPersonalInformationRegister() {
  //const [date, setDate] = useState(new Date());
  const [server_error, setServerError] = useState({});
  const [delayDuration, setDelayDuration] = useState(5000);
  const navigate = useNavigate();
  let { user_id, user_name, user_type } = getUserInfo();
  const [teacherData, setteacherData] = useState({
    fullName: "",
    detail: "",
    qualification: "",
    skills: "",
    dateOfBirth: "",
    gender: "",
    mobileNo: "",
    address: "",
    cityTown: "",
    country: "",
    status: "",
  });
  // Change Element Value

  const handleChange = (event) => {
    setteacherData({
      ...teacherData,
      [event.target.name]: event.target.value,
    });
  };
  // End

  // Submit form
  const submitForm = () => {
    // const otp_digits = Math.floor(Math.floor(100000 + Math.random() * 900000));
    const teacherFormData = new FormData();
    teacherFormData.append("user", user_id);
    teacherFormData.append("fullName", teacherData.fullName);
    teacherFormData.append("detail", teacherData.detail);
    teacherFormData.append("qualification", teacherData.qualification);
    teacherFormData.append("skills", teacherData.skills);
    teacherFormData.append("dateOfBirth", teacherData.dateOfBirth);
    teacherFormData.append("gender", teacherData.gender);
    teacherFormData.append("mobileNo", teacherData.mobileNo);
    teacherFormData.append("address", teacherData.address);
    teacherFormData.append("cityTown", teacherData.cityTown);
    teacherFormData.append("country", teacherData.country);
    //try {
    // axios.post(baseURL, teacherFormData).then((response) => {
    //   navigate("/verify-teacher/" + response.data.id);
    console.log("Teacher form data: ", teacherData);
    axios
      //.post(baseURL + "register/", teacherFormData)
      .post(baseURL + "teacher-personal-info-register/", teacherFormData)
      .then((response) => {
        // navigate("/verify-teacher/" + TypeError: Cannot read properties of undefined (reading 'fullName'));
        // window.location.href = "/verify-teacher/" + response.data.id;
        setteacherData({
          fullName: "",
          detail: "",
          qualification: "",
          skills: "",
          dateOfBirth: "",
          gender: "",
          mobileNo: "",
          address: "",
          cityTown: "",
          country: "",
          status: "success",
        });
        // if (response.status === 200 || response.status === 201) {
        //   Swal.fire({
        //     title:
        //       "Your data is saved successfully. Registration process is now complete. Now, you are being redirected to login page",
        //     icon: "success",
        //     toast: true,
        //     timer: 4000,
        //     position: "top-right",
        //     timerProgressBar: true,
        //     showConfirmButton: false,
        //   });
        // }
        removeToken();
        removeUserInfo();
        setTimeout(() => {
          navigate("/teacher-login");
        }, delayDuration);
        //navigate("/teacher-login");
        // setServerError({});
        //localStorage.setItem("teacherId", response.data.id);
        //*********************************************************************
        // setteacherData({
        //   fullName: "",
        //   detail: "",
        //   qualification: "",
        //   skills: "",
        //   dateOfBirth: "",
        //   gender: "",
        //   mobileNo: "",
        //   email: "",
        //   password: "",
        //   address: "",
        //   cityTown: "",
        //   country: "",
        // status: "success",
        // });
        //navigate("/teacher-dashboard");
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data) {
            // Handle field errors (assuming error.response.data has non_field_errors key)
            // console.log(typeof error.response.data.errors);
            console.log("---------------error.response.data-------------");
            console.log(error.response.data.errors);
            setServerError(error.response.data.errors);
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("---------------error.request-------------");
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log("Error", error.message);
          // Handle any other errors
          console.log("---------------error.message-------------");
          setServerError(error.message);
        }
        console.log(error.config);
      });
    //} catch (error) {
    // setteacherData({ status: "error" });
    // if (error.response) {
    //   console.log(
    //     "Server responded with status code:",
    //     error.response.status
    //   );
    //   console.log("Response data:", error.response.data);
    // } else if (error.request) {
    //   console.log("No response received:", error.request);
    // } else {
    //   console.log("Error creating request:", error.message);
    // }
    //if (error.response) {
    // if (error.response.data) {
    //   // Handle field errors (assuming error.response.data has non_field_errors key)
    //   const fieldErrors = error.response.data || {};
    //   // Handle non-field errors (assuming error.response.data has field errors)
    //   const nonFieldErrors =
    //     error.response.data.non_field_errors || "Something went wrong!";

    //   setErrors({
    //     fieldErrors,
    //     nonFieldErrors,
    //   });
    // } else {
    //   // Handle any other errors
    //   setErrors({
    //     fieldErrors: {},
    //     nonFieldErrors: "An unexpected error occured",
    //   });
    // }
    //}
  };
  // End
  useEffect(() => {
    document.title = "Teacher Personal Information Register";
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
          {teacherData.status === "success" && (
            <div class="alert alert-success" role="alert">
              <span className="alert-link text-success">
                Your information is saved. Thank you!
              </span>
              <br />
              You will be redirected to login page to get going.
            </div>
          )}
          {teacherData.status === "error" && (
            <p className="text-danger">Something went wrong!</p>
          )}
          <div className="card">
            <h5 className="card-header">
              Teacher Personal Information Register
            </h5>
            <div className="card-body">
              {/* <form> */}

              {/* <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  value={teacherData.username}
                />
                {server_error.username && (
                  <small className="text-danger ms-2">
                    {server_error.username ? server_error.username[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email_1" className="form-label">
                  Email
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  className="form-control"
                  name="email"
                  id="email_1"
                  value={teacherData.email}
                />
                {server_error.email && (
                  <small className="text-danger ms-2">
                    {server_error.email ? server_error.email[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password_1" className="form-label">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  className="form-control"
                  name="password"
                  id="password_1"
                  value={teacherData.password}
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
                  value={teacherData.password2}
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
              </div> */}

              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="fullName"
                  id="fullName"
                  value={teacherData.fullName}
                />
                {server_error.fullName && (
                  <small className="text-danger ms-2">
                    {server_error.fullName ? server_error.fullName[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="detail" className="form-label">
                  Detail (about yourself)
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="detail"
                  id="detail"
                  value={teacherData.detail}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="qualification" className="form-label">
                  Qualification <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="qualification"
                  id="qualification"
                  value={teacherData.qualification}
                />
                <div name="qualificationHelp" className="form-text">
                  B.E., M.Sc., B.Com etc.
                </div>
                {server_error.qualification && (
                  <small className="text-danger ms-2">
                    {server_error.qualification
                      ? server_error.qualification[0]
                      : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="skills" className="form-label">
                  Skills
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  name="skills"
                  id="skills"
                  value={teacherData.skills}
                ></textarea>
                <div name="skillsHelp" className="form-text">
                  Maths, Physics, Computers etc.
                </div>
              </div>
              <div className="mb-3">
                {/* <label htmlFor="datepicker" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    onChange={handleDateChange}
                    type="text"
                    className="form-control"
                    name="datepicker"
                    name="datepicker"
                  /> */}
                {/* --- not to be included --- <DatePicker
                      className="form-control"
                      name="dateofbirth"
                      selected={date}
                      onChange={(date) => setDate(date)}
                    /> */}
                <label htmlFor="dob_1" className="form-label">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="dateOfBirth"
                  id="dob_1"
                  placeholder="yyyy-mm-dd"
                  value={teacherData.dateOfBirth}
                />
                {server_error.dateOfBirth && (
                  <small className="text-danger ms-2">
                    {server_error.dateOfBirth
                      ? server_error.dateOfBirth[0]
                      : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Gender <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="gender"
                  onChange={handleChange}
                  id="gender"
                  value={teacherData.gender}
                >
                  <option default>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {server_error.gender && (
                  <small className="text-danger ms-2">
                    {server_error.gender ? server_error.gender[0] : ""}
                  </small>
                )}
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
                  value={teacherData.mobileNo}
                />
                {server_error.mobileNo && (
                  <small className="text-danger ms-2">
                    {server_error.mobileNo ? server_error.mobileNo[0] : ""}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address <span className="text-danger">*</span>
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  name="address"
                  id="address"
                  value={teacherData.address}
                ></textarea>
                {server_error.address && (
                  <small className="text-danger ms-2">
                    {server_error.address ? server_error.address[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="citytown" className="form-label">
                  City/Town <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="cityTown"
                  id="citytown"
                  value={teacherData.cityTown}
                />
                {server_error.cityTown && (
                  <small className="text-danger ms-2">
                    {server_error.cityTown ? server_error.cityTown[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="country"
                  id="country"
                  value={teacherData.country}
                />
                {server_error.country && (
                  <small className="text-danger ms-2">
                    {server_error.country ? server_error.country[0] : ""}
                  </small>
                )}
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

export default TeacherPersonalInformationRegister;
