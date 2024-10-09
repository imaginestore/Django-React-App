import React from "react";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { getToken, getUserInfo, storeToken } from "../LocalStorageService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function ChangePassword() {
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const [teacherData, setteacherData] = useState({
    password: "",
    password2: "",
    status: "",
  });
  const { access_token } = getToken();
  const { user_id, user_type } = getUserInfo();
  const teacherId = localStorage.getItem("teacherId");
  const [delayDuration, setDelayDuration] = useState(5000);
  const navigate = useNavigate();

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
    const teacherFormData = new FormData();
    teacherFormData.append("password", teacherData.password);
    teacherFormData.append("password2", teacherData.password2);

    // changeUserPassword: builder.mutation({
    //   query: ({ actualData, access_token }) => {
    //     return {
    //       url: 'changepassword/',
    //       method: 'POST',
    //       body: actualData,
    //       headers: {
    //         'authorization': `Bearer ${access_token}`,
    //       }
    //     }
    //   }
    // })

    // const res = changeUserPassword({actualData, access_token})
    // if (res.data) {
    //   console.log(data);
    //   setServerError({})
    //   setServerMsg(res.msg);
    //   setteacherData({
    //     password: "",
    //     password2: "",
    //     status: "success",
    //   });
    // }
    // if (res.error) {
    //   setServerMsg({});
    //   setServerError(res.error.data.errors);
    // }

    // try {
    axios
      // .post(
      //   baseURL + "/teacher/change-password/" + teacherId + "/",
      //   teacherFormData
      // )
      .post(baseURL + "/user/changepassword/", teacherFormData, {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setServerError({});
        setServerMsg(response.data);
        setteacherData({
          password: "",
          password2: "",
          status: "success",
        });
        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            title: "Your password has been changed",
            icon: "success",
            toast: true,
            timer: 4000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => {
            navigate("/teacher-logout");
          }, delayDuration);
          //window.location.href = "/teacher-logout";
        } else {
          alert("Oops!...some error occured!");
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data) {
            console.log("---------------error.response.data-------------");
            console.log(error.response.data.errors);
            setServerError(error.response.data.errors);
            console.log(error.response.data.errors.messages);
            // if (error.response.data.errors.messages) {
            //   setServerErrorMessages(error.response.data.errors.messages);
            // }
          }
        } else if (error.request) {
          console.log("---------------error.request-------------");
          console.log(error.request);
        } else {
          console.log("---------------error.message-------------");
          setServerError(error.message);
        }
        console.log(error.config);
      });
    // } catch (error) {
    //   console.log(error);
    //   setteacherData({ status: "error" });
    // }
  };
  // End
  useEffect(() => {
    document.title = "Teacher Change Password";
  });
  // const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  // if (teacherLoginStatus !== "true") {
  //   window.location.href = "/teacher-login";
  // }
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          {/* {console.log("Local State: ", server_error)} */}
          {/* {server_error.non_field_errors
            ? console.log(server_error.non_field_errors[0])
            : ""}
          {server_error.password ? console.log(server_error.password[0]) : ""}
          {server_error.password2 ? console.log(server_error.password2[0]) : ""}*/}
          <div className="card">
            <h5 className="card-header">Change Password</h5>
            <div className="card-body">
              <div className="mb-3 row">
                <label htmlFor="password" className="col-sm-2 col-form-label">
                  New Password
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                    className="form-control"
                    name="password"
                    value={teacherData.password}
                  />
                  {server_error.password && (
                    <small className="text-danger ms-2">
                      {server_error.password ? server_error.password[0] : ""}
                    </small>
                  )}
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="password2" className="col-sm-2 col-form-label">
                  Re-type New Password
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    id="password2"
                    onChange={handleChange}
                    className="form-control"
                    name="password2"
                    value={teacherData.password2}
                  />
                  {server_error.password2 && (
                    <small className="text-danger ms-2">
                      {server_error.password2 ? server_error.password2[0] : ""}
                    </small>
                  )}
                </div>
              </div>
              <hr />
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitForm}
              >
                Update
              </button>
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
              {server_msg.msg && (
                <div className="mt-3 alert alert-success" role="alert">
                  <div>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {server_msg.msg ? server_msg.msg : ""}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ChangePassword;
