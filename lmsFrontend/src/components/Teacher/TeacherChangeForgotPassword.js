import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherChangeForgotPassword() {
  const navigate = useNavigate();
  // const { teacher_id } = useParams();
  const [teacherData, setteacherData] = useState({
    password: "",
    password2: "",
  });

  const [successMsg, setsuccessMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const { uid, token } = useParams();

  const handleChange = (event) => {
    setteacherData({
      ...teacherData,
      [event.target.name]: event.target.value,
    });
  };

  // resetPassword: builder.mutation({
  //   query: ({ actualData, id, token }) => {  // actualData be replaced with teacherData
  //     return {
  //       url: `/reset-password/${id}/${token}/`,
  //       method: 'POST',
  //       body: actualData,
  //       headers: {
  //         'Content-type': 'application/json',
  //       }
  //     }
  //   }
  // })

  const submitForm = () => {
    const teacherFormData = new FormData();
    teacherFormData.append("password", teacherData.password);
    teacherFormData.append("password2", teacherData.password2);

    // const res = resetPassword({actualData, id, token})
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
    //   setServerMsg({})
    //   setServerError(res.error.data.errors);
    // }

    axios
      .post(
        baseURL + "/change-forgot-password/" + uid + "/" + token + "/",
        teacherFormData,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setServerError({});
        setServerMsg(res.data);
        setteacherData({
          password: "",
          password2: "",
          status: "success",
        });
        setTimeout(() => {
          navigate("/teacher-login");
        }, 4000);
      })
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

  //   try {
  //     axios
  //       .post(
  //         baseURL + "user/reset-password/" + id + "/" + token + "/",
  //         teacherFormData
  //       )
  //       // .post(
  //       //   baseURL + "/teacher-change-forgot-password/" + teacher_id + "/",
  //       //   teacherFormData
  //       // )
  //       .then((res) => {
  //         if (res.data.bool === true) {
  //           seterrorMsg("");
  //           setsuccessMsg(res.data.msg);
  //         } else {
  //           setsuccessMsg("");
  //           seterrorMsg(res.data.msg);
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  // if (teacherLoginStatus === "true") {
  //   navigate("/teacher-dashboard");
  // }

  useEffect(() => {
    document.title = "Teacher Change Forgot Password";
  });

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-6 offset-3">
          {/* {console.log("Local State: ", server_error)} */}
          {/* {server_error.non_field_errors
            ? console.log(server_error.non_field_errors[0])
            : ""}
          {server_error.password ? console.log(server_error.password[0]) : ""}
          {server_error.password2 ? console.log(server_error.password2[0]) : ""}*/}
          <div className="card">
            <h5 className="card-header">Change Forgot Password</h5>
            <div className="card-body">
              {successMsg && <p className="text-success">{successMsg}</p>}
              {errorMsg && <p className="text-danger">{errorMsg}</p>}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Enter your new password:
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
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
                  Re-enter your new password:
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password2"
                  id="password2"
                  className="form-control"
                  value={teacherData.password2}
                />
                {server_error.password2 && (
                  <small className="text-danger ms-2">
                    {server_error.password2 ? server_error.password2[0] : ""}
                  </small>
                )}
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Update
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

export default TeacherChangeForgotPassword;
