import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getToken, getUserInfo } from "./LocalStorageService";

function Header() {
  const [user, setUser] = useState([]);

  const [searchString, setsearchString] = useState({
    search: "",
  });
  const [profileImageUrl, setProfileImageUrl] = useState("");
  //const profile_image = localStorage.getItem("profile_image");
  let baseURL = process.env.REACT_APP_API_BASE_URL;
  if (baseURL.endsWith("/api")) {
    baseURL = baseURL.slice(0, -4); // Removes the last 5 characters ('/api/')
  }
  console.log("baseURL -----> header --->", baseURL);

  useEffect(() => {
    const profile_image = localStorage.getItem("profile_image");
    if (profile_image) {
      // Construct the full URL for the profile image
      // const fullUrl = `http://localhost:8000${profile_image}`;
      const fullUrl = `${baseURL}${profile_image}`;
      setProfileImageUrl(fullUrl);
    }
  }, []);

  useEffect(() => {
    const handleUserLogin = () => {
      const { access_token } = getToken();
      const { user_id, user_name, user_type } = getUserInfo();
      const first_name = localStorage.getItem("first_name");
      const adminLoginStatus = localStorage.getItem("adminLoginStatus");
      const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
      const studentLoginStatus = localStorage.getItem("studentLoginStatus");

      setUser({
        access_token: access_token,
        user_id: user_id,
        user_name: user_name,
        user_type: user_type,
        first_name: first_name,
        adminLoginStatus: adminLoginStatus,
        teacherLoginStatus: teacherLoginStatus,
        studentLoginStatus: studentLoginStatus,
      });
    };

    // Check localStorage on component mount to restore user data
    handleUserLogin();

    // Listen for the custom event
    window.addEventListener("userLogin", handleUserLogin);

    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
    };
  }, []);

  const handleChange = (event) => {
    setsearchString({
      ...searchString,
      [event.target.name]: event.target.value,
    });
  };
  const searchCourse = () => {
    if (searchString.search !== "") {
      window.location.href = "/search/" + searchString.search;
    }
  };

  const displayfont = {
    fontSize: 10,
  };

  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  // const myString = "hello world";

  // e.g.  <div>
  //         <p>{capitalizeFirstLetter(myString)}</p>
  //       </div>

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          Learn Online
        </Link>
        <button
          className="navbar-toggler mb-2 mt-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <form className="d-flex me-3" role="search">
              <input
                onChange={handleChange}
                className="form-control me-2"
                type="search"
                placeholder="Search by course title"
                aria-label="Search"
                name="search"
              />
              <button
                onClick={searchCourse}
                className="btn btn-info"
                type="button"
              >
                Search
              </button>
            </form>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/all-courses">
                Courses
              </Link>
            </li>
            {user.adminLoginStatus && user.user_type === "admin" ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={profileImageUrl}
                    className="rounded-circle"
                    height="22"
                    alt="Avatar"
                    loading="lazy"
                  />
                  <span
                    className="text-primary ms-1"
                    style={{ textTransform: "capitalize" }}
                  >
                    {user.user_type}
                  </span>
                </Link>
                <ul className="dropdown-menu" data-bs-theme="light">
                  <li>
                    <Link className="dropdown-item" to="/admin-dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin-logout">
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item dropdown">
                  {user.teacherLoginStatus && user.user_type === "teacher" ? (
                    <>
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src={
                            profileImageUrl
                            // || "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
                          }
                          className="rounded-circle"
                          height="22"
                          alt="Avatar"
                          loading="lazy"
                        />
                        <span
                          className="text-primary ms-1"
                          // style={{ fontSize: 15 }}
                        >
                          {/* {user_name} */}
                          {user.first_name}
                        </span>
                      </Link>
                      <ul className="dropdown-menu" data-bs-theme="light">
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/teacher-dashboard"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/teacher-profile-settings"
                          >
                            Profile Settings
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/teacher-logout">
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Teacher
                      </Link>
                      <ul className="dropdown-menu" data-bs-theme="light">
                        <li>
                          <Link className="dropdown-item" to="/teacher-login">
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/teacher-register"
                          >
                            Register
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </li>
                <li className="nav-item dropdown">
                  {user.studentLoginStatus && user.user_type === "student" ? (
                    <>
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src={
                            profileImageUrl
                            // || "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (30).webp"
                          }
                          className="rounded-circle"
                          height="22"
                          alt="Avatar"
                          loading="lazy"
                        />
                        <span
                          className="text-primary ms-1"
                          // style={{ fontSize: 15 }}
                        >
                          {user.first_name}
                        </span>
                      </Link>
                      <ul className="dropdown-menu" data-bs-theme="light">
                        <li>
                          <Link className="dropdown-item" to="/user-dashboard">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/profile-settings"
                          >
                            Profile Settings
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/user-logout">
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        User
                      </Link>
                      <ul className="dropdown-menu" data-bs-theme="light">
                        <li>
                          <Link className="dropdown-item" to="/user-login">
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/user-register">
                            Register
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
