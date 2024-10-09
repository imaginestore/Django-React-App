import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../LocalStorageService";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function ProfileSettings() {
  const [studentData, setstudentData] = useState({
    fullName: "",
    gender: "",
    mobileNo: "",
    profile_img: "",
    p_img: "",
    interestedCategories: "",
    status: "",
    // login_via_otp: "",
  });
  const { user_id } = getUserInfo();
  const studentId = localStorage.getItem("studentId");
  const [server_error, setServerError] = useState({});
  const [loading, setLoading] = useState(true); // Track the loading state
  useEffect(() => {
    // Fetch current teacher data
    try {
      axios.get(baseURL + "/student-profile/" + studentId).then((res) => {
        setstudentData({
          fullName: res.data.fullName,
          gender: res.data.gender,
          mobileNo: res.data.mobileNo,
          profile_img: res.data.profile_img,
          p_img: "",
          interestedCategories: res.data.interestedCategories,
          // login_via_otp: res.data.login_via_otp,
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    // End
  }, []);

  // Change Element Value
  const handleChange = (event) => {
    setstudentData({
      ...studentData,
      [event.target.name]: event.target.value,
    });
  };
  // End
  const handleFileChange = (event) => {
    setstudentData({
      ...studentData,
      [event.target.name]: event.target.files[0],
    });
  };
  // Submit form
  const submitForm = () => {
    const studentFormData = new FormData();
    studentFormData.append("fullName", studentData.fullName);
    studentFormData.append("gender", studentData.gender);
    studentFormData.append("mobileNo", studentData.mobileNo);
    if (studentData.p_img !== "") {
      studentFormData.append(
        "profile_img",
        studentData.p_img,
        studentData.p_img.name
      );
    }
    if (studentData.interestedCategories) {
      studentFormData.append(
        "interestedCategories",
        studentData.interestedCategories
      );
    }
    // if (studentData.login_via_otp) {
    //   studentFormData.append("login_via_otp", studentData.login_via_otp);
    // }

    axios
      .patch(baseURL + "/student-profile/" + studentId + "/", studentFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            title: "Your profile has been updated",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data) {
            // Handle field errors (assuming error.response.data has non_field_errors key)
            console.log("---------------error.response.data-------------");
            console.log(error.response.data);
            setServerError(error.response.data);
          }
        } else if (error.request) {
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
    // } catch (error) {
    //   console.log(error);
    //   setstudentData({ status: "error" });
    // }
  };
  // End
  useEffect(() => {
    document.title = "Student Profile";
  });
  const studentLoginStatus = localStorage.getItem("studentLoginStatus");
  if (studentLoginStatus !== "true") {
    window.location.href = "/user-login";
  }

  if (loading) {
    return (
      <div className="container mt-4 mb-4">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">My Profile Settings</h5>
            <div className="card-body">
              <div className="mb-3 row">
                {/* {console.log("Local State: ", server_error)} */}
                <label htmlFor="fullName" className="col-sm-2 col-form-label">
                  Full Name
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="fullName"
                    id="fullName"
                    value={studentData.fullName}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="gender" className="col-sm-2 col-form-label">
                  Gender
                </label>
                <div className="col-sm-10">
                  <select
                    className="form-select"
                    name="gender"
                    onChange={handleChange}
                    id="gender"
                    value={studentData.gender}
                  >
                    <option default>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="mobileNo" className="col-sm-2 col-form-label">
                  Mobile Number
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    name="mobileNo"
                    id="mobileNo"
                    value={studentData.mobileNo}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="p_img" className="col-sm-2 col-form-label">
                  Profile Picture
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleFileChange}
                    type="file"
                    className="form-control"
                    name="p_img"
                    id="p_img"
                  />
                  {studentData.profile_img && (
                    <p className="mt-2">
                      <img
                        src={studentData.profile_img}
                        width="300"
                        alt={studentData.fullName}
                      />
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor="interestedCategories"
                  className="col-sm-2 col-form-label"
                >
                  Interests
                </label>
                <div className="col-sm-10">
                  <textarea
                    onChange={handleChange}
                    className="form-control"
                    name="interestedCategories"
                    id="interestedCategories"
                    value={studentData.interestedCategories}
                  ></textarea>
                  <div id="interestedCategoriesHelp" className="form-text">
                    Maths, Physics, Computers etc.
                  </div>
                </div>
              </div>
              {/* <div className="mb-3 row">
                <label
                  htmlFor="login_via_otp"
                  className="col-sm-2 col-form-label"
                >
                  Login Via OTP
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="login_via_otp"
                    id="login_via_otp"
                    value={studentData.login_via_otp}
                  />
                </div>
              </div> */}
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary mt-2"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfileSettings;
