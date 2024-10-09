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
import { Redirect } from "react-router-dom";

import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
// const baseURL1 = "http://127.0.0.1:8000/api/user/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;
const baseURL1 = `${process.env.REACT_APP_API_BASE_URL}/user/`;

function TeacherLogin() {
  const [teacherData, setteacherData] = useState([]);
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const [server_detail, setServerDetail] = useState({});
  const [teacher_status, setTeacherStatus] = useState("");
  const [teacherLoginData, setteacherLoginData] = useState({
    email: "",
    password: "",
  });

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

    //try {
    axios
      .post(baseURL1 + "login/", teacherFormData)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          storeToken(res.data.token);
          storeUserInfo(
            res.data.user_id,
            res.data.user_name,
            res.data.user_type
          );
        }

        ////////////////////////////////////////////////////////////////////
        // try {
        //   const access_token = getToken();
        //   if (!access_token) {
        //     throw new Error("No token found");
        //   }
        //   const userId = res.data.user_id;
        //   console.log("---------- user_id --------------");
        // const response = axios.get(baseURL + "/teacher/" + userId);
        // const response = axios.get(baseURL + "/teacher/" + userId, {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //     "content-type": "application/json",
        //   },
        // });
        ////////////////////////////////////////////////////////////////////////////////
        //   const response = axios.get(baseURL + "/teacher/" + userId);
        //   console.log("###########################################");
        //   if (!response) {
        //     console.log("----- no response -----");
        //   }
        //   if (response.data) {
        //     console.log("----- response.data -------", response.data);
        //     setteacherData(response.data);
        //   }
        //   console.log("user_id", teacherData.user);
        //   console.log("teacher_id", teacherData.id);
        // } catch (err) {
        //   console.log("<------------- err ------------>", err);
        // }

        ////////////////////////////////////////////////////////////////////////////
        // Fetch teacherId
        // try {
        //const { user_id } = getUserInfo();
        // ----------------------------- try catch start ----------------------------
        if (res.data.user_type === "teacher") {
          axios
            .get(baseURL + "/teacher/" + res.data.user_id)
            .then((res) => {
              setteacherData(res.data);
              localStorage.setItem("teacherId", res.data.id);
              localStorage.setItem("first_name", res.data.names);
              localStorage.setItem(
                "profile_image",
                res.data.profile_img
                  ? res.data.profile_img
                  : "media/teacher_profile_imgs/default.jpg"
              );

              // console.log("id:", res.data.id);
              // console.log("teacher data", teacherData);
              const access_token = getToken();
              if (access_token !== "" && res.data) {
                localStorage.setItem("teacherLoginStatus", true);
                //navigate("/teacher-dashboard");
                window.location.href = "/teacher-dashboard";
                //window.location.reload();
              } else {
                console.log("teacherData could not be obtained", teacherData);
              }
            })
            .catch(function (error) {
              if (error.response) {
                console.log(
                  "-------------- error.response ---------------------"
                );
                // The request was made and the server responded with a status code out of the range of 2xx
                if (error.response.data) {
                  console.log("error.response.data: ", error.response.data);
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
          setteacherLoginData({
            email: "",
            password: "",
            status: "",
          });
          removeToken();
          removeUserInfo();
          setTeacherStatus("Teacher not found!------");
        }
        // ---------------------- end try catch ------------------------------
        // } catch (error) {
        //   console.log(error);
        // }
        // if (res.data.bool === true) {
        //   if (res.data.login_via_otp === true) {
        //     navigate("/verify-teacher/" + res.data.teacher_id);
        //   } else {
        //     localStorage.setItem("teacherLoginStatus", true);
        //     localStorage.setItem("teacherId", res.data.teacher_id);
        //     //navigate("/teacher-dashboard");
        //     window.location.href = "/teacher-dashboard";
        //   }
        // } else {
        //   seterrorMsg(res.data.msg);
        // }
      })
      .catch(function (error) {
        if (error.response) {
          console.log("-------------- error.response ---------------------");
          // The request was made and the server responded with a status code out of the range of 2xx
          if (error.response.data) {
            console.log(
              "-------------- error.response.data ---------------------"
            );
            setServerDetail(error.response.data);
            setServerError(error.response.data.errors);
          }
        } else if (error.request) {
          console.log("-------------- error.request ---------------------");
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
  };
  // const access_token = getToken();
  // //const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  // if (access_token !== "") {
  //   //navigate("/teacher-dashboard");
  //   window.location.href = "/teacher-dashboard";
  // }

  // let { access_token } = getToken()
  useEffect(() => {
    document.title = "Teacher Login";

    // if (access_token) {
    //   navigate("/teacher-dashboard");
    //   //window.location.reload();
    // }
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
            <h5 className="card-header">Teacher Login</h5>
            <div className="card-body">
              {/* {errorMsg && <p className="text-danger">{errorMsg}</p>} */}
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
                  name="password"
                  className="form-control"
                  id="password"
                  value={teacherLoginData.password}
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
              <div className="mb-3">
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
                {server_detail.detail && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i class="bi bi-exclamation-triangle-fill me-2"></i>
                      {server_detail.detail ? server_detail.detail : ""}
                    </div>
                  </div>
                )}
                {server_msg.msg && (
                  <div className="mt-3 alert alert-success" role="alert">
                    <div>
                      <i class="bi bi-check-circle-fill me-2"></i>
                      {server_msg.msg ? server_msg.msg : ""}
                    </div>
                  </div>
                )}
                {teacher_status !== "" && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i class="bi bi-exclamation-triangle-fill me-2"></i>
                      {teacher_status ? teacher_status : ""}
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

export default TeacherLogin;
