import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const siteURL = "http://127.0.0.1:8000/";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CourseDetail() {
  const [courseData, setcourseData] = useState([]);
  const [courseViews, setcourseViews] = useState(0);
  const [chapterData, setchapterData] = useState([]);
  const [teacherData, setteacherData] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
  // const [relatedcourseData, setrelatedcourseData] = useState([]);
  const [techListData, settechListData] = useState([]);
  const [relatedCoursesByTech, setRelatedCoursesByTech] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [userLoginStatus, setuserLoginStatus] = useState([]);
  const [enrollStatus, setenrollStatus] = useState([]);
  const [ratingStatus, setratingStatus] = useState([]);
  const [averageRating, setaverageRating] = useState(0);
  const [favouriteStatus, setfavouriteStatus] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  let { course_id } = useParams();
  const studentId = localStorage.getItem("studentId");
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/course/" + course_id).then((res) => {
        setcourseData(res.data);
        setchapterData(res.data.course_chapters);
        setteacherData(res.data.teacher);
        setcategoryData(res.data.category);
        // setrelatedcourseData(JSON.parse(res.data.related_videos));
        // setrelatedcourseData(JSON.parse(res.data.related_subjects));
        settechListData(res.data.tech_list);
        if (res.data.courseRating !== "" && res.data.courseRating !== null) {
          setaverageRating(res.data.courseRating);
        }
      });

      axios.get(baseURL + "/update-view/" + course_id).then((res) => {
        setcourseViews(res.data.views);
      });
    } catch (error) {
      console.log("Error fetching course data", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }

    // Fetch enroll status
    if (studentId) {
      try {
        axios
          .get(baseURL + "/fetch-enroll-status/" + studentId + "/" + course_id)
          .then((res) => {
            if (res.data.bool === true) {
              setenrollStatus("success");
            }
          });
      } catch (error) {
        console.log(error);
      }

      // Fetch rating status
      try {
        axios
          .get(baseURL + "/fetch-rating-status/" + studentId + "/" + course_id)
          .then((res) => {
            if (res.data.bool === true) {
              setratingStatus("success");
            }
          });
      } catch (error) {
        console.log(error);
      }

      // Fetch favourite status
      try {
        axios
          .get(
            baseURL + "/fetch-favourite-status/" + studentId + "/" + course_id
          )
          .then((res) => {
            if (res.data.bool === true) {
              setfavouriteStatus("success");
            } else {
              setfavouriteStatus("");
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    const studentLoginStatus = localStorage.getItem("studentLoginStatus");
    if (studentLoginStatus === "true") {
      setuserLoginStatus("success");
    }
  }, []);

  // Enroll in this course
  const enrollCourse = () => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    _formData.append("student", studentId);
    try {
      axios
        .post(baseURL + "/student-enroll-course/", _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: "You have successfully enrolled in this course",
              icon: "success",
              toast: true,
              timer: 3000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
            setenrollStatus("success");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Mark as favourite course
  const markAsFavourite = () => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    _formData.append("student", studentId);
    _formData.append("status", true);

    try {
      axios
        .post(baseURL + "/student-add-favourite-course/", _formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: "This course has been added in your wish list",
              icon: "success",
              toast: true,
              timer: 5000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
            setfavouriteStatus("success");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  // End

  // Remove from favourite course
  const removeFavourite = (pk) => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    _formData.append("student", studentId);
    _formData.append("status", false);

    try {
      axios
        .get(
          baseURL +
            "/student-remove-favourite-course/" +
            course_id +
            "/" +
            studentId,
          _formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: "This course has been removed from your wish list",
              icon: "success",
              toast: true,
              timer: 5000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
            setfavouriteStatus("");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  // End

  // Add Rating
  const [ratingData, setratingData] = useState({
    rating: "",
    reviews: "",
  });

  const handleChange = (event) => {
    setratingData({
      ...ratingData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const _formRatingData = new FormData();
    _formRatingData.append("course", course_id);
    _formRatingData.append("student", studentId);
    _formRatingData.append("rating", ratingData.rating);
    _formRatingData.append("reviews", ratingData.reviews);

    try {
      axios.post(baseURL + "/course-rating/", _formRatingData).then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Rating has been saved",
            icon: "success",
            toast: true,
            timer: 5000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
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

  // const findCourseByTech = (tech) => {
  //   if (Array.isArray(courseData.related_courses)) {
  //     return courseData.related_courses.find(
  //       (course) =>
  //         course.title.trim().toLowerCase() === tech.trim().toLowerCase()
  //     );
  //   }
  //   console.error(
  //     "courseData.related_courses is not an array:",
  //     courseData.related_courses
  //   );
  //   return null;
  // };

  return (
    <div className="container mt-3 mb-3">
      <div className="row">
        <div className="col-4">
          <img
            src={courseData.featured_img}
            className="img-thumbnail"
            alt={courseData.title}
          />
          <h5 className="img-thumbnail text-center text-bg-primary py-2  mt-1">
            {categoryData.title}
          </h5>
        </div>
        <div className="col-8">
          <h3>{courseData.title}</h3>
          <p>{courseData.description}</p>
          <p className="fw-bold">
            Course By:{" "}
            <Link to={`/teacher-detail/${teacherData.id}`}>
              {teacherData.fullName}
            </Link>
          </p>
          <p>
            <span className="fw-bold">Related Subjects:&nbsp;</span>
            {techListData.map((tech, index) => (
              <>
                <Link
                  key={index}
                  to={`/courses-by-tech/${tech.trim()}`}
                  className="badge badge-pill text-dark bg-warning"
                >
                  {tech.trim()}
                </Link>
                &nbsp;
              </>
            ))}
          </p>
          <p>
            <span className="fw-bold">Total Enrolled:</span>{" "}
            {courseData.totalEnrolledStudents} Student(s)
          </p>
          <p>
            <span className="fw-bold">Views:</span> {courseViews}
          </p>
          <p>
            <span className="fw-bold">Rating:</span> {averageRating}/5
            {enrollStatus === "success" && userLoginStatus === "success" && (
              <>
                {ratingStatus !== "success" && (
                  <button
                    className="btn btn-success btn-sm ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#ratingModal"
                  >
                    Rating
                  </button>
                )}
                {ratingStatus === "success" && (
                  <small className="badge bg-info text-dark ms-2">
                    You've already rated this course
                  </small>
                )}
                <div
                  className="modal fade"
                  id="ratingModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ratingModalLabel">
                          Rate for {courseData.title}
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <label htmlFor="rating" class="form-label">
                              Rating
                            </label>
                            <select
                              onChange={handleChange}
                              className="form-control"
                              name="rating"
                              id="rating"
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="reviews" className="form-label">
                              Review
                            </label>
                            <textarea
                              onChange={handleChange}
                              className="form-control"
                              name="reviews"
                              id="reviews"
                              rows="10"
                            ></textarea>
                          </div>
                          <button
                            onClick={submitForm}
                            type="button"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </p>
          {enrollStatus === "success" && userLoginStatus === "success" && (
            <p>
              <span className="text-success">
                You are already enrolled in this course
              </span>
            </p>
          )}
          {userLoginStatus === "success" && enrollStatus !== "success" && (
            <p>
              {/* <button
                type="button"
                onClick={enrollCourse}
                className="btn btn-success"
              >
                Enroll in this course
              </button> */}
              <span className="text-danger">
                You are not enrolled in this course
              </span>
            </p>
          )}
          {userLoginStatus === "success" && favouriteStatus !== "success" && (
            <p>
              <button
                type="button"
                onClick={markAsFavourite}
                className="btn btn-outline-danger"
                title="Add in your favourite course list"
              >
                <i className="bi bi-heart-fill"></i>
              </button>
            </p>
          )}
          {userLoginStatus === "success" && favouriteStatus === "success" && (
            <p>
              <button
                type="button"
                onClick={removeFavourite}
                className="btn btn-danger"
                title="Remove from your favourite course list"
              >
                <i className="bi bi-heart-fill"></i>
              </button>
            </p>
          )}
          {/* {userLoginStatus !== "success" && (
            <p>
              <Link to="/user-login">
                Please login to enroll in this course
              </Link>
            </p>
          )} */}
        </div>
      </div>
      {/* Course Videos */}
      {userLoginStatus === "success" && enrollStatus === "success" && (
        <div className="card mt-4">
          <h5 className="card-header">
            In this course{" "}
            <span className="float-end">
              {/* <Link
                to={`/student-course-chapters/${course_id}`}
                className="btn btn-sm btn-primary"
              >
                Start this course
              </Link> */}
              <Link
                to={`/chapters-index/${course_id}`}
                className="btn btn-sm btn-primary"
              >
                Start this course
              </Link>
            </span>
          </h5>
          <ul className="list-group list-group-flush">
            {chapterData.map((chapter, index) => (
              <li className="list-group-item" key={chapter.id}>
                {chapter.title}
                <span className="float-end">
                  <span className="me-3">{chapter.remarks}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target={`#videoModal${index}`}
                    title="Click to watch"
                  >
                    <i className="bi-youtube"></i>
                  </button>
                </span>
                {/* -- Video Modal Start -- */}
                <div
                  className="modal fade"
                  id={`videoModal${index}`}
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          {chapter.remarks}
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="ratio ratio-16x9">
                          <video key={chapter.video} controls>
                            <source
                              src={chapter.video}
                              title={chapter.remarks}
                              type="video/webm"
                            />
                            <source
                              src={chapter.video}
                              title={chapter.remarks}
                              type="video/mp4"
                            />
                            Sorry, your browser doesn't support embedded videos!
                          </video>
                          {/* <iframe
                            src={chapter.video}
                            title={chapter.title}
                            allowFullscreen
                          ></iframe> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* -- Video Modal End -- */}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 className="pb-1 mb-4 mt-5">Related Courses </h3>
      <div className="row mb-4">
        {/* {relatedcourseData.map((rcourse, index) => ( */}
        {courseData.related_subjects &&
        courseData.related_subjects.length > 0 ? (
          courseData.related_subjects.map((rcourse) => (
            <div className="col-md-3" key={rcourse.id}>
              <div className="card">
                <Link target="__blank" to={`/detail/${rcourse.id}`}>
                  <img
                    // src={`${siteURL}media/${rcourse.featured_img}`}
                    src={rcourse.featured_img}
                    className="card-img-top"
                    alt={rcourse.title}
                  />
                </Link>
                <div className="card-body text-bg-primary py-1">
                  <h5 className="card-title text-center">
                    <Link
                      target="__blank"
                      className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                      to={`/detail/${rcourse.id}`}
                    >
                      {rcourse.title}
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No related courses found.</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
