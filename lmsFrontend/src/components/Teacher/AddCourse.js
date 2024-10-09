import React from "react";
import { Link, useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AddCourse() {
  const [Cats, setCats] = useState([]);
  const [server_error, setServerError] = useState({});
  const navigate = useNavigate();
  const [courseData, setcourseData] = useState({
    category: "",
    title: "",
    description: "",
    f_img: "",
    techs: "",
    status: "",
  });

  useEffect(() => {
    try {
      axios.get(baseURL + "/category").then((res) => {
        setCats(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleChange = (event) => {
    setcourseData({
      ...courseData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setcourseData({
      ...courseData,
      [event.target.name]: event.target.files[0],
    });
  };

  const submitForm = () => {
    const teacherId = localStorage.getItem("teacherId");
    const _formData = new FormData();
    _formData.append("category", courseData.category);
    _formData.append("teacher", teacherId);
    if (courseData.title) {
      _formData.append("title", courseData.title);
    }
    if (courseData.description) {
      _formData.append("description", courseData.description);
    }
    if (courseData.f_img) {
      _formData.append("featured_img", courseData.f_img, courseData.f_img.name);
    }
    if (courseData.techs) {
      _formData.append("techs", courseData.techs);
    }

    axios
      .post(baseURL + "/course/", _formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setcourseData({
          category: "",
          title: "",
          description: "",
          f_img: "",
          techs: "",
          status: "success",
        });
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Course added successfully!",
            icon: "success",
            toast: true,
            timer: 7000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => {
            navigate("/add-course");
          }, 10000);
          //window.location.href = "/teacher-logout";
        } else {
          alert("Oops!...some error occured!");
        }
        //console.log(res.data);
        window.location.href = "/add-course";
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data) {
            console.log("---------------error.response.data-------------");
            console.log(error.response.data);
            setServerError(error.response.data);
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
    //   setcourseData({
    //     status: "error",
    //   });
    //   console.log(error);
    // }
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Add Course</h5>
            <div className="card-body">
              {courseData.status === "success" && (
                <div className="alert alert-success" role="alert">
                  <div>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Course added successfully!
                  </div>
                </div>
              )}
              {courseData.status === "error" && (
                <div className="alert alert-danger" role="alert">
                  <div>
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    Something went wrong!
                  </div>
                </div>
              )}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  onChange={handleChange}
                  name="category"
                  id="category"
                  className="form-select"
                >
                  <option selected>-------- Select Grade --------</option>
                  {Cats.map((category, index) => {
                    return (
                      <option key={index} value={category.id}>
                        {category.title}
                      </option>
                    );
                  })}
                </select>
                {server_error.category && (
                  <small className="text-danger ms-2">
                    {server_error.category ? "Please select a grade." : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="title"
                  id="title"
                />
                {server_error.title && (
                  <small className="text-danger ms-2">
                    {server_error.title ? server_error.title[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  onChange={handleChange}
                  name="description"
                  id="description"
                  className="form-control"
                ></textarea>
                {server_error.description && (
                  <small className="text-danger ms-2">
                    {server_error.description
                      ? server_error.description[0]
                      : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="featured_img" className="form-label">
                  Featured Image
                </label>
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="form-control"
                  name="f_img"
                  id="featured_img"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="techs" className="form-label">
                  Technologies
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Php, Python, HTML, Javascript, CSS"
                  name="techs"
                  id="techs"
                ></textarea>
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Submit
              </button>
              {/* </form> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddCourse;
