import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherForgotPassword() {
  const navigate = useNavigate();
  const [teacherData, setteacherData] = useState({
    email: "",
    status: "",
  });

  const [successMsg, setsuccessMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});

  const handleChange = (event) => {
    setteacherData({
      ...teacherData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const teacherFormData = new FormData();
    teacherFormData.append("email", teacherData.email);

    // sendPasswordResetEmail: builder.mutation({
    //   query: (user) => {
    //     return {
    //       url: '/user/send-reset-password-email/',
    //       method: 'POST',
    //       body: user,
    //       headers: {
    //         'content-type': 'application/json',
    //       }
    //     }
    //   }
    // })

    // const res = sendPasswordResetEmail(teacherData);
    // if (res.data) {
    //   console.log(data);
    //   setServerError({})
    //   setServerMsg(res.msg);
    //   setteacherData({
    //     email: "",
    //     status: "success",
    //   });
    // }
    // if (res.error) {
    //   setServerMsg({})
    //   setServerError(res.error.data.errors);
    // }

    // try {
    axios
      .post(baseURL + "/forgot-password/", teacherFormData, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) =>
        // .post(baseURL + "/teacher-forgot-password/", teacherFormData)
        {
          console.log(res.data);
          setServerError({});
          setServerMsg(res.data);
          setteacherData({
            email: "",
            status: "success",
          });
          // if (res.data.bool === true) {
          //   seterrorMsg("");
          //   setsuccessMsg(res.data.msg);
          // } else {
          //   setsuccessMsg("");
          //   seterrorMsg(res.data.msg);
          // }
        }
      )
      .catch(function (error) {
        if (error.response) {
          console.log("-------------- error.response ---------------------");
          // The request was made and the server responded with a status code out of the range of 2xx
          if (error.response.data) {
            console.log("error.response.data: ", error.response.data);
            setServerMsg({});
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
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    document.title = "Teacher Forgot Password";
  });
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-6 offset-3">
          {/* {console.log("Local State: ", server_error)} */}
          {/* {server_error.non_field_errors
            ? console.log(server_error.non_field_errors[0])
            : ""}
          {server_error.email ? console.log(server_error.email[0]) : ""}*/}
          <div className="card">
            <h5 className="card-header">Forgot Password</h5>
            <div className="card-body">
              {successMsg && <p className="text-success">{successMsg}</p>}
              {errorMsg && <p className="text-danger">{errorMsg}</p>}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Enter your registered email address:
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={teacherData.email}
                />
                {server_error.email && (
                  <small className="text-danger ms-2">
                    {server_error.email ? server_error.email[0] : ""}
                  </small>
                )}
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Send
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
              {server_msg.msg && (
                <div className="mt-3 alert alert-success" role="alert">
                  <div>
                    <i class="bi bi-check-circle-fill me-2"></i>
                    {server_msg.msg ? server_msg.msg : ""}
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

export default TeacherForgotPassword;
