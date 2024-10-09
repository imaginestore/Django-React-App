import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeToken, storeUserInfo } from "../LocalStorageService";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
//import Swal from "sweetalert2";
//const baseURL = "http://127.0.0.1:8000/api/teacher/";
// const baseURL1 = "http://127.0.0.1:8000/api/user/";
const baseURL1 = `${process.env.REACT_APP_API_BASE_URL}/user/`;

function TeacherRegister() {
  //const [date, setDate] = useState(new Date());
  const [server_error, setServerError] = useState({});
  const [delayDuration, setDelayDuration] = useState(5000);
  // const [nonFieldErrors, setNonFieldErrors] = useState([]);
  const navigate = useNavigate();
  const [teacherData, setteacherData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    status: "",
    tc: null,
    // fullName: "",
    // detail: "",
    // qualification: "",
    // skills: "",
    // dateOfBirth: "",
    // gender: "",
    // mobileNo: "",
    // address: "",
    // cityTown: "",
    // country: "",
    // status: "",
    // otp_digits: "",
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
    teacherFormData.append("username", teacherData.username);
    teacherFormData.append("email", teacherData.email);
    teacherFormData.append("password", teacherData.password);
    teacherFormData.append("password2", teacherData.password2);
    teacherFormData.append("usertype", "teacher");
    teacherFormData.append("tc", teacherData.tc);
    // teacherFormData.append("fullName", teacherData.fullName);
    // teacherFormData.append("detail", teacherData.detail);
    // teacherFormData.append("qualification", teacherData.qualification);
    // teacherFormData.append("skills", teacherData.skills);
    // teacherFormData.append("dateOfBirth", teacherData.dateOfBirth);
    // teacherFormData.append("gender", teacherData.gender);
    // teacherFormData.append("mobileNo", teacherData.mobileNo);
    // teacherFormData.append("address", teacherData.address);
    // teacherFormData.append("cityTown", teacherData.cityTown);
    // teacherFormData.append("country", teacherData.country);
    // teacherFormData.append("otp_digits", otp_digits);
    //try {
    // axios.post(baseURL, teacherFormData).then((response) => {
    //   navigate("/verify-teacher/" + response.data.id);
    axios
      .post(baseURL1 + "register/", teacherFormData)
      .then((response) => {
        //console.log("Server Response: ", response.data);
        storeToken(response.data.token);
        storeUserInfo(
          response.data.user_id,
          response.data.user_name,
          response.data.user_type
        );
        setteacherData({
          username: "",
          email: "",
          password: "",
          password2: "",
          tc: null,
          status: "success",
        });
        // if (response.status === 200 || response.status === 201) {
        //   Swal.fire({
        //     title:
        //       "Registration successful! You are being directed to another page to complete registration process.",
        //     icon: "success",
        //     toast: true,
        //     timer: 4000,
        //     position: "top-right",
        //     timerProgressBar: true,
        //     showConfirmButton: false,
        //   });
        // }
        setTimeout(() => {
          navigate("/teacher-personal-info-register/");
        }, delayDuration);
        //navigate("/teacher-personal-info-register/");
        // navigate("/teacher-dashboard");
        // setteacherData({
        //   username: "",
        //   email: "",
        //   password: "",
        //   password2: "",
        //   tc: null,
        //   status: "success",
        // });
        // setServerError({});
        //navigate("/teacher-personal-info-register/" + response.data.user_id);
        // navigate("/verify-teacher/" + response.data.id);
        // window.location.href = "/verify-teacher/" + response.data.id;

        //navigate("/teacher-dashboard");
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
    document.title = "Teacher Register";
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
                Registration successful!
              </span>
              <br /> You will be redirected to another page to complete the
              registration process.
            </div>
          )}
          {teacherData.status === "error" && (
            <p className="text-danger">Something went wrong!</p>
          )}
          <div className="card">
            <h5 className="card-header">Teacher Register</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
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
                  Email address
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
              </div>

              {/* {nonFieldErrors.length > 0 && (
                <small className="text-danger">
                  {nonFieldErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </small>
              )} */}
              {/* <div className="mb-3">
                <label htmlFor="fullname_1" className="form-label">
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="fullName"
                  id="fullname_1"
                  value={teacherData.fullName}
                />
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
                <label htmlFor="qualification_1" className="form-label">
                  Qualification
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="qualification"
                  id="qualification_1"
                  value={teacherData.qualification}
                />
                <div name="qualificationHelp" className="form-text">
                  B.E., M.Sc., B.Com etc.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="skills_1" className="form-label">
                  Skills
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  name="skills"
                  id="skills_1"
                  value={teacherData.skills}
                ></textarea>
                <div name="skillsHelp" className="form-text">
                  Maths, Physics, Computers etc.
                </div>
              </div>
              <div className="mb-3"> */}
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
              {/* <label htmlFor="dob_1" className="form-label">
                  Date of Birth
                </label> */}
              {/* --- not to be included --- <DatePicker
                      className="form-control"
                      name="dateofbirth"
                      selected={date}
                      onChange={(date) => setDate(date)}
                    /> */}
              {/* <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="dateOfBirth"
                  id="dob_1"
                  placeholder="yyyy-mm-dd"
                  value={teacherData.dateOfBirth}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gender_1" className="form-label">
                  Gender
                </label>
                <select
                  className="form-select"
                  name="gender"
                  onChange={handleChange}
                  id="gender_1"
                  value={teacherData.gender}
                >
                  <option default>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="mobilenumber_1" className="form-label">
                  Mobile Number
                </label>
                <input
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  name="mobileNo"
                  id="mobilenumber_1"
                  value={teacherData.mobileNo}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address_1" className="form-label">
                  Address
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  name="address"
                  id="address_1"
                  value={teacherData.address}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="citytown_1" className="form-label">
                  City/Town
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="cityTown"
                  id="citytown_1"
                  value={teacherData.cityTown}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="country_1" className="form-label">
                  Country
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="country"
                  id="country_1"
                  value={teacherData.country}
                />
              </div> */}
              <button
                type="button"
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

export default TeacherRegister;
