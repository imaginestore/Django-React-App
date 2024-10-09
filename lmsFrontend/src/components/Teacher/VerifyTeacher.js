import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/`;

function VerifyTeacher() {
  const navigate = useNavigate();
  const [teacherData, setteacherData] = useState({
    otp_digits: "",
  });

  const [errorMsg, seterrorMsg] = useState("");

  const handleChange = (event) => {
    setteacherData({
      ...teacherData,
      [event.target.name]: event.target.value,
    });
  };

  const { teacher_id } = useParams();

  const submitForm = () => {
    const teacherFormData = new FormData();
    teacherFormData.append("otp_digits", teacherData.otp_digits);
    try {
      axios
        .post(baseURL + "verify-teacher/" + teacher_id + "/", teacherFormData)
        .then((res) => {
          if (res.data.bool === true) {
            localStorage.setItem("teacherLoginStatus", true);
            localStorage.setItem("teacherId", res.data.teacher_id);
            navigate("/teacher-dashboard");
          } else {
            seterrorMsg(res.data.msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  if (teacherLoginStatus === "true") {
    navigate("/teacher-dashboard");
  }

  useEffect(() => {
    document.title = "Verify Teacher";
  });
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-6 offset-3">
          <div className="card">
            <h5 className="card-header">Enter 6 Digit OTP</h5>
            <div className="card-body">
              {errorMsg && <p className="text-danger">{errorMsg}</p>}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="otp_digits" className="form-label">
                  OTP
                </label>
                <input
                  onChange={handleChange}
                  type="number"
                  name="otp_digits"
                  id="otp_digits"
                  className="form-control"
                  value={teacherData.otp_digits}
                />
              </div>
              <button
                type="submit"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Verify
              </button>
              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyTeacher;
