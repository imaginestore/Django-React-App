import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../LocalStorageService";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherProfileSettings() {
  const [teacherData, setteacherData] = useState({
    fullName: "",
    detail: "",
    qualification: "",
    skills: "",
    dateOfBirth: "",
    gender: "",
    mobileNo: "",
    profile_img: "",
    p_img: "",
    address: "",
    cityTown: "",
    country: "",
    facebookURL: "",
    twitterURL: "",
    instagramURL: "",
    websiteURL: "",
    status: "",
    login_via_otp: "",
  });
  const { user_id } = getUserInfo();
  const teacherId = localStorage.getItem("teacherId");
  const [server_error, setServerError] = useState({});
  const [loading, setLoading] = useState(true); // Track the loading state
  useEffect(() => {
    // Fetch current teacher data. "teacherId" is replaced with user_id
    try {
      axios.get(baseURL + "/teacher-profile/" + teacherId).then((res) => {
        setteacherData({
          fullName: res.data.fullName,
          detail: res.data.detail,
          qualification: res.data.qualification,
          skills: res.data.skills,
          dateOfBirth: res.data.dateOfBirth,
          gender: res.data.gender,
          mobileNo: res.data.mobileNo,
          profile_img: res.data.profile_img,
          p_img: "",
          address: res.data.address,
          cityTown: res.data.cityTown,
          country: res.data.country,
          facebookURL: res.data.facebookURL,
          twitterURL: res.data.twitterURL,
          instagramURL: res.data.instagramURL,
          websiteURL: res.data.websiteURL,
          login_via_otp: res.data.login_via_otp,
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
    setteacherData({
      ...teacherData,
      [event.target.name]: event.target.value,
    });
  };
  // End
  const handleFileChange = (event) => {
    setteacherData({
      ...teacherData,
      [event.target.name]: event.target.files[0],
    });
  };
  // Submit form
  const submitForm = () => {
    const teacherFormData = new FormData();
    teacherFormData.append("fullName", teacherData.fullName);
    if (teacherData.detail) {
      teacherFormData.append("detail", teacherData.detail);
    }
    // teacherFormData.append("detail", teacherData.detail);
    teacherFormData.append("qualification", teacherData.qualification);
    if (teacherData.skills) {
      teacherFormData.append("skills", teacherData.skills);
    }
    // teacherFormData.append("skills", teacherData.skills);
    teacherFormData.append("dateOfBirth", teacherData.dateOfBirth);
    teacherFormData.append("gender", teacherData.gender);
    teacherFormData.append("mobileNo", teacherData.mobileNo);
    if (teacherData.p_img !== "") {
      teacherFormData.append(
        "profile_img",
        teacherData.p_img,
        teacherData.p_img.name
      );
    }
    teacherFormData.append("address", teacherData.address);
    teacherFormData.append("cityTown", teacherData.cityTown);
    teacherFormData.append("country", teacherData.country);
    if (teacherData.facebookURL) {
      teacherFormData.append("facebookURL", teacherData.facebookURL);
    }
    if (teacherData.twitterURL) {
      teacherFormData.append("twitterURL", teacherData.twitterURL);
    }
    if (teacherData.instagramURL) {
      teacherFormData.append("instagramURL", teacherData.instagramURL);
    }
    if (teacherData.websiteURL) {
      teacherFormData.append("websiteURL", teacherData.websiteURL);
    }
    if (teacherData.login_via_otp) {
      teacherFormData.append("login_via_otp", teacherData.login_via_otp);
    }
    // teacherFormData.append("facebookURL", teacherData.facebookURL);
    // teacherFormData.append("twitterURL", teacherData.twitterURL);
    // teacherFormData.append("instagramURL", teacherData.instagramURL);
    // teacherFormData.append("websiteURL", teacherData.websiteURL);
    // teacherFormData.append("login_via_otp", teacherData.login_via_otp);

    // try {
    axios
      .patch(baseURL + "/teacher-profile/" + teacherId + "/", teacherFormData, {
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
            console.log(error.response.data.errors);
            setServerError(error.response.data.errors);
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
    //   setteacherData({ status: "error" });
    // }
  };
  // End
  useEffect(() => {
    document.title = "Teacher Profile";
  });
  const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
  if (teacherLoginStatus !== "true") {
    window.location.href = "/teacher-login";
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
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Teacher Profile Settings</h5>
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
                    value={teacherData.fullName}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="detail" className="col-sm-2 col-form-label">
                  Detail (about yourself)
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="detail"
                    id="detail"
                    value={teacherData.detail}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor="qualification_1"
                  className="col-sm-2 col-form-label"
                >
                  Qualification
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="qualification"
                    id="qualification_1"
                    value={teacherData.qualification}
                  />
                  <div id="qualificationlHelp" className="form-text">
                    MCA, BE, B.Sc, M.Sc. etc.
                  </div>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="skills" className="col-sm-2 col-form-label">
                  Skills
                </label>
                <div className="col-sm-10">
                  <textarea
                    onChange={handleChange}
                    className="form-control"
                    name="skills"
                    id="skills"
                    value={teacherData.skills}
                  ></textarea>
                  <div id="skillsHelp" className="form-text">
                    Maths, Physics, Computers etc.
                  </div>
                </div>
              </div>
              <div className="mb-3 row">
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
                <label htmlFor="dob_1" className="col-sm-2 col-form-label">
                  Date of Birth
                </label>
                {/* <DatePicker
                      className="form-control"
                      name="dateofbirth"
                      selected={date}
                      onChange={(date) => setDate(date)}
                    /> */}
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="dateOfBirth"
                    id="dob_1"
                    value={teacherData.dateOfBirth}
                  />
                  <div id="dobHelp" className="form-text">
                    yyyy-mm-dd
                  </div>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="gender_1" className="col-sm-2 col-form-label">
                  Gender
                </label>
                <div className="col-sm-10">
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
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor="mobilenumber_1"
                  className="col-sm-2 col-form-label"
                >
                  Mobile Number
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    name="mobileNo"
                    id="mobilenumber_1"
                    value={teacherData.mobileNo}
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
                  {teacherData.profile_img && (
                    <p className="mt-2">
                      <img
                        src={teacherData.profile_img}
                        width="300"
                        alt={teacherData.fullName}
                      />
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="address_1" className="col-sm-2 col-form-label">
                  Address
                </label>
                <div className="col-sm-10">
                  <textarea
                    onChange={handleChange}
                    className="form-control"
                    name="address"
                    id="address_1"
                    value={teacherData.address}
                  ></textarea>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="citytown_1" className="col-sm-2 col-form-label">
                  City/Town
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="cityTown"
                    id="citytown_1"
                    value={teacherData.cityTown}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="country_1" className="col-sm-2 col-form-label">
                  Country
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="country"
                    id="country_1"
                    value={teacherData.country}
                  />
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
                    value={teacherData.login_via_otp}
                  />
                </div>
              </div> */}
              <hr />
              <h4 className="mb-4">Social Accounts</h4>
              <div className="mb-3 row">
                <label
                  htmlFor="facebookURL"
                  className="col-sm-2 col-form-label"
                >
                  Facebook
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="facebookURL"
                    id="facebookURL"
                    value={teacherData.facebookURL}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="twitterURL" className="col-sm-2 col-form-label">
                  Twitter
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="twitterURL"
                    id="twitterURL"
                    value={teacherData.twitterURL}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor="instagramURL"
                  className="col-sm-2 col-form-label"
                >
                  Instagram
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="instagramURL"
                    id="instagramURL"
                    value={teacherData.instagramURL}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="websiteURL" className="col-sm-2 col-form-label">
                  Website
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="websiteURL"
                    id="websiteURL"
                    value={teacherData.websiteURL}
                  />
                </div>
              </div>
              <hr />
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeacherProfileSettings;
