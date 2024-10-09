import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/`;

function VerifyStudent() {
  const navigate = useNavigate();
  const [studentData, setstudentData] = useState({
    otp_digits: "",
  });

  const [errorMsg, seterrorMsg] = useState("");

  const handleChange = (event) => {
    setstudentData({
      ...studentData,
      [event.target.name]: event.target.value,
    });
  };

  const { student_id } = useParams();

  const submitForm = () => {
    const studentFormData = new FormData();
    studentFormData.append("otp_digits", studentData.otp_digits);
    try {
      axios
        .post(baseURL + "verify-student/" + student_id + "/", studentFormData)
        .then((res) => {
          if (res.data.bool === true) {
            localStorage.setItem("studentLoginStatus", true);
            localStorage.setItem("studentId", res.data.student_id);
            navigate("/user-dashboard");
          } else {
            seterrorMsg(res.data.msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const studentLoginStatus = localStorage.getItem("studentLoginStatus");
  if (studentLoginStatus === "true") {
    navigate("/user-dashboard");
  }

  useEffect(() => {
    document.title = "Verify Student";
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
                  value={studentData.otp_digits}
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

export default VerifyStudent;
