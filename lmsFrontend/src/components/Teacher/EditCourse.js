import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function EditCourse() {
  const [Cats, setCats] = useState([]);
  const [server_error, setServerError] = useState({});
  const [loading, setLoading] = useState(true); // Track the loading state
  const [courseData, setcourseData] = useState({
    category: "",
    title: "",
    description: "",
    prev_img: "",
    f_img: "",
    techs: "",
  });

  // TeacherId is added
  const teacherId = localStorage.getItem("teacherId");
  const { course_id } = useParams();
  const courseId = parseInt(course_id, 10); // Convert course_id to an integer

  useEffect(() => {
    try {
      axios.get(baseURL + "/category").then((res) => {
        setCats(res.data);
      });
    } catch (error) {
      console.log(error);
    }

    // Fetch current course data
    try {
      axios.get(baseURL + "/teacher-course-detail/" + courseId).then((res) => {
        setcourseData({
          category: res.data.category.id,
          title: res.data.title,
          description: res.data.description,
          prev_img: res.data.featured_img,
          f_img: "",
          techs: res.data.techs,
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    // End
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
    const _formData = new FormData();
    _formData.append("category", courseData.category.id);
    _formData.append("teacher", teacherId); // teacherId add on 25-03-2024
    _formData.append("title", courseData.title);
    _formData.append("description", courseData.description);
    if (courseData.f_img !== "") {
      _formData.append("featured_img", courseData.f_img, courseData.f_img.name);
    }
    _formData.append("techs", courseData.techs);

    // try {
    if (!isNaN(courseId)) {
      axios
        .patch(baseURL + "/teacher-course-detail/" + courseId, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Data has been updated",
              icon: "success",
              toast: true,
              timer: 4000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
          // Update the courseData state with the new image URL
          if (res.data.featured_img) {
            setcourseData((prevData) => ({
              ...prevData,
              prev_img: res.data.featured_img,
            }));
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data) {
              console.log("---------------error.response.data-------------");
              console.log(error.response);
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
    }
    // } catch (error) {
    //   console.log(error);
    // }
    console.log(server_error);
  };

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
            <h5 className="card-header">Edit Course</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  onChange={handleChange}
                  value={courseData.category}
                  name="category"
                  id="category"
                  className="form-control"
                >
                  {Cats.map((category, index) => {
                    return (
                      <option key={index} value={category.id}>
                        {category.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  onChange={handleChange}
                  value={courseData.title}
                  type="text"
                  className="form-control"
                  name="title"
                  id="title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  onChange={handleChange}
                  value={courseData.description}
                  name="description"
                  id="description"
                  className="form-control"
                ></textarea>
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
                {courseData.prev_img && (
                  <p className="mt-2">
                    <img
                      src={courseData.prev_img}
                      width="300"
                      alt="{courseData.title}"
                    />
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="techs" className="form-label">
                  Technologies
                </label>
                <textarea
                  onChange={handleChange}
                  value={courseData.techs}
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

export default EditCourse;
