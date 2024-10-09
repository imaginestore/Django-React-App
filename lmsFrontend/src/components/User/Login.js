import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  storeToken,
  getToken,
  storeUserInfo,
  getUserInfo,
  removeToken,
  removeUserInfo,
} from "../LocalStorageService";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
// const baseURL1 = "http://127.0.0.1:8000/api/user/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;
const baseURL1 = `${process.env.REACT_APP_API_BASE_URL}/user/`;

function Login() {
  const navigate = useNavigate();
  const [studentData, setstudentData] = useState([]);
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const [server_detail, setServerDetail] = useState({});
  const [student_status, setStudentStatus] = useState("");
  const [studentLoginData, setstudentLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, seterrorMsg] = useState("");

  const handleChange = (event) => {
    setstudentLoginData({
      ...studentLoginData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const studentFormData = new FormData();
    studentFormData.append("email", studentLoginData.email);
    studentFormData.append("password", studentLoginData.password);

    // try {
    axios
      .post(baseURL1 + "login/", studentFormData)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          storeToken(res.data.token);
          storeUserInfo(
            res.data.user_id,
            res.data.user_name,
            res.data.user_type
          );
          //navigate("/user-dashboard");
        }
        // Fetch studentId
        // try {
        //const { user_id } = getUserInfo();
        // ---------------- if start -------------------
        if (res.data.user_type === "student") {
          axios
            .get(baseURL + "/student/" + res.data.user_id)
            .then((res) => {
              setstudentData(res.data);
              localStorage.setItem("studentId", res.data.id);
              localStorage.setItem("first_name", res.data.names);
              localStorage.setItem(
                "profile_image",
                res.data.profile_img
                  ? res.data.profile_img
                  : "media/student_profile_imgs/default.jpg"
              );
              // console.log("id:", res.data.id);
              // console.log("student data", studentData);
              const access_token = getToken();
              if (access_token !== "" && res.data) {
                localStorage.setItem("studentLoginStatus", true);
                //navigate("/access-check");
                window.location.href = "/user-dashboard";
                // navigate("/user-dashboard");
                //window.location.reload();
              } else {
                console.log("studentData could not be obtained", studentData);
              }
            })
            .catch(function (error) {
              if (error.response) {
                console.log(
                  "-------------- error.response ---------------------"
                );
                // The request was made and the server responded with a status code out of the range of 2xx
                if (error.response.data) {
                  console.log(
                    "-------------- error.response.data ---------------------"
                  );
                  setServerMsg({});
                  setServerDetail(error.response.data);
                  setServerError(error.response.data.errors);
                }
              } else if (error.request) {
                console.log(
                  "-------------- error.request ---------------------"
                );
                console.log(error.request);
              } else {
                console.log("-------------- else ---------------------");
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
                // Handle any other errors
                setServerError(error.message);
              }
              console.log(error.config);
            });
        } else {
          setstudentLoginData({
            email: "",
            password: "",
            status: "",
          });
          removeToken();
          removeUserInfo();
          setStudentStatus("Student not found!");
        }
        // ------------------- end if ---------------------
        // } catch (error) {
        //   console.log(error);
        // }
        // if (res.data.bool === true) {
        //   if (res.data.login_via_otp === true) {
        //     navigate("/verify-student/" + res.data.student_id);
        //   } else {
        //     localStorage.setItem("studentLoginStatus", true);
        //     localStorage.setItem("studentId", res.data.student_id);
        //     //navigate("/user-dashboard");
        //     window.location.href = "/user-dashboard";
        //   }
        // } else {
        //   seterrorMsg(res.data.msg);
        // }
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data) {
            // Handle field errors (assuming error.response.data has non_field_errors key)
            // console.log(typeof error.response.data.errors);
            // console.log(error.response.data.errors);
            setServerDetail(error.response.data);
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
    // }

    // set time for error messages
    // setTimeout(() => {
    //   setError('');
    // }, 3000); // Clear error after 3 seconds
  };

  // const studentLoginStatus = localStorage.getItem("studentLoginStatus");
  // if (studentLoginStatus === "true") {
  //   //navigate("/user-dashboard");
  //   window.location.href = "/user-dashboard";
  // }

  useEffect(() => {
    document.title = "Student Login";
  });

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-6 offset-3">
          {/* {server_error.non_field_errors
            ? console.log(server_error.non_field_errors[0])
            : ""}
          {server_error.email ? console.log(server_error.email[0]) : ""}
          {server_error.password ? console.log(server_error.password[0]) : ""} */}
          <div className="card">
            <h5 className="card-header">User Login</h5>
            <div className="card-body">
              {/* {errorMsg && <p className="text-danger">{errorMsg}</p>} */}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  className="form-control"
                  value={studentLoginData.email}
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
                  type="password"
                  onChange={handleChange}
                  className="form-control"
                  name="password"
                  value={studentLoginData.password}
                  id="password"
                />
                {server_error.password && (
                  <small className="text-danger ms-2">
                    {server_error.password ? server_error.password[0] : ""}
                  </small>
                )}
              </div>
              {/* <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  Remember Me
                </label>
              </div> */}
              <button
                type="submit"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Login
              </button>
              {/* </form> */}
              <div className="mb-3">
                {server_error.non_field_errors && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <small className="ms-2">
                        {server_error.non_field_errors
                          ? server_error.non_field_errors[0]
                          : ""}
                      </small>
                    </div>
                  </div>
                )}
                {server_detail.detail && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i class="bi bi-exclamation-triangle-fill me-2"></i>
                      <small>
                        {server_detail.detail ? server_detail.detail : ""}
                      </small>
                    </div>
                  </div>
                )}
                {server_msg.msg && (
                  <div className="mt-3 alert alert-success" role="alert">
                    <div>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <small>{server_msg.msg ? server_msg.msg : ""}</small>
                    </div>
                  </div>
                )}
                {student_status !== "" && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <small>{student_status ? student_status : ""}</small>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3">
                <Link to="/forgot-password" className="text-secondary">
                  Forgot Password?
                </Link>
                {/* <Link to="/sendpasswordresetemail" className="text-primary">
                  Forgot Password?
                </Link> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
