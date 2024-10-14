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

function AdministratorLogin() {
  const navigate = useNavigate();
  const [teacherData, setteacherData] = useState([]);
  const [studentData, setstudentData] = useState([]);
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const [server_detail, setServerDetail] = useState({});
  const [administrator_status, setAdministratorStatus] = useState("");
  const [administratorLoginData, setAdministratorLoginData] = useState({
    email: "",
    password: "",
    status: "",
  });

  const handleChange = (event) => {
    setAdministratorLoginData({
      ...administratorLoginData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const administratorFormData = new FormData();
    administratorFormData.append("email", administratorLoginData.email);
    administratorFormData.append("password", administratorLoginData.password);

    //try {
    axios
      .post(baseURL1 + "login/", administratorFormData)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          storeToken(res.data.token);
          storeUserInfo(
            res.data.user_id,
            res.data.user_name,
            res.data.user_type
          );
          localStorage.setItem(
            "profile_image",
            "/media/admin_profile_imgs/adminAvtar1.jpg"
          );
        }

        // ----------------------------- try catch start ----------------------------
        const access_token = getToken();
        if (access_token !== "" && res.data.user_type === "admin") {
          localStorage.setItem("adminLoginStatus", true);
          navigate("/admin-dashboard");
        } else {
          setAdministratorLoginData({
            email: "",
            password: "",
            status: "error",
          });
          setAdministratorStatus("Login credentials not found!");
        }
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
    document.title = "Administrator Login";
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
            <h5 className="card-header">Administrator Login</h5>
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
                  value={administratorLoginData.email}
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
                  value={administratorLoginData.password}
                />
                {server_error.password && (
                  <small className="text-danger ms-2">
                    {server_error.password ? server_error.password[0] : ""}
                  </small>
                )}
              </div>
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
                {administrator_status !== "" && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i class="bi bi-exclamation-triangle-fill me-2"></i>
                      {administrator_status ? administrator_status : ""}
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

export default AdministratorLogin;
