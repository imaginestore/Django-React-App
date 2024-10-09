import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Carousel.module.css";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Home() {
  const [courseData, setCourseData] = useState([]);
  const [popularCourseData, setpopularCourseData] = useState([]);
  const [popularTeacherData, setpopularTeacherData] = useState([]);
  const [testimonialData, settestimonialData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state

  // Fetch courses when page loads
  useEffect(() => {
    // ======================= fetch all course data =======================

    const fetchAllData = async () => {
      let allData = [];
      let url = `${baseURL}/course/`;

      while (url) {
        const response = await axios.get(url);
        allData = [...allData, ...response.data.results];
        url = response.data.next; // URL of the next page, or null if there are no more pages
      }

      setCourseData(allData);
    };

    //fetchAllData();

    // ======================= fetch all course data end ===================

    const fetchPopularCourseData = async () => {
      let allPopularCourseData = [];
      let url = `${baseURL}/popular-course/?all=1`;

      while (url) {
        const response = await axios.get(url);
        allPopularCourseData = [
          ...allPopularCourseData,
          ...response.data.results,
        ];
        url = response.data.next; // URL of the next page, or null if there are no more pages
      }

      setpopularCourseData(allPopularCourseData);
    };

    //fetchPopularCourseData();
    // ************* popular courses end *********************
    // Fetch Popular Teachers

    const fetchPopularTeachersData = async () => {
      let allPopularTeacherData = [];
      let url = `${baseURL}/popular-teachers/?all=1`;

      while (url) {
        const response = await axios.get(url);
        allPopularTeacherData = [...allPopularTeacherData, ...response.data];
        url = response.data.next; // URL of the next page, or null if there are no more pages
      }

      setpopularTeacherData(allPopularTeacherData);
    };

    //fetchPopularTeachersData();

    // Fetch Students Testimonials

    const fetchTestimonials = async () => {
      const response = await axios.get(`${baseURL}/student-testimonial/`);
      settestimonialData(response.data);
    };

    const fetchAll = async () => {
      try {
        await Promise.all([
          fetchAllData(),
          fetchPopularCourseData(),
          fetchPopularTeachersData(),
          fetchTestimonials(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after all data is fetched
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    document.title = "LMS | Home Page";
  });

  const chunkData = (array, size) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  };

  const dataChunks = chunkData(courseData, 4);
  const dataChunksPopularCourse = chunkData(popularCourseData, 4);
  const dataChunksPopularTeacher = chunkData(popularTeacherData, 4);

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
    <div className="container mt-4">
      {/* ====================================================================================== */}
      {/* Jumbotron start */}
      <h3 className="pb-1 mb-4">
        Latest Courses
        <Link to="/all-courses" className="btn btn-outline-primary float-end">
          See All
        </Link>
      </h3>
      {courseData.length > 0 && (
        <div className="row">
          <div id="carouselExampleControls" className="carousel slide">
            <div className="carousel-inner">
              {dataChunks.map((chunk, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="row">
                    {chunk.map((item, idx) => (
                      <div key={idx} className="col-md-3 mb-4">
                        <div className="card">
                          <Link to={`/detail/${item.id}`}>
                            <img
                              src={item.featured_img}
                              className="card-img-top"
                              alt={item.title}
                            />
                          </Link>
                          <div className="card-body text-bg-primary py-1">
                            <h5 className="card-title text-center">
                              <Link
                                className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                to={`/detail/${item.id}`}
                              >
                                {item.title}
                              </Link>
                              <span style={{ fontSize: 15 }}>
                                {" "}
                                (
                                {item.category && item.category.title
                                  ? item.category.title
                                  : "No Category"}
                                )
                              </span>
                            </h5>
                          </div>
                          {/* <div className="card-footer">
                            <div className="title text-center">
                              {item.category && item.category.title
                                ? item.category.title
                                : "No Category"}
                            </div>
                          </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              // className="carousel-control-prev"
              className={`carousel-control-prev ${styles.carouselControlPrev}`}
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
              style={{ paddingLeft: 0 }}
            >
              <span
                // className="carousel-control-prev-icon"
                className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              // className="carousel-control-next"
              className={`carousel-control-next ${styles.carouselControlNext}`}
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
              style={{ paddingRight: 0 }}
            >
              <span
                // className="carousel-control-next-icon"
                className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
      {/* Jumbotron end ---- Latest Courses ----- */}
      {/* ====================================================================================== */}
      {/* ----------------- Popular Courses ------------------------- */}
      {popularCourseData && (
        <h3 className="pb-1 mb-4 mt-4">
          Popular Courses{" "}
          <Link
            to="/popular-courses"
            className="btn btn-outline-primary float-end"
          >
            See All
          </Link>
        </h3>
      )}
      {popularCourseData.length > 0 && (
        <div className="row">
          <div id="carouselExampleControls1" className="carousel slide">
            <div className="carousel-inner">
              {dataChunksPopularCourse.map((chunk, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="row">
                    {chunk.map((item, idx) => (
                      <div key={idx} className="col-md-3 mb-4">
                        <div className="card">
                          <Link to={`/detail/${item.id}`}>
                            <img
                              src={item.featured_img}
                              className="card-img-top"
                              alt={item.title}
                            />
                          </Link>
                          <div className="card-body text-bg-primary py-1">
                            <h5 className="card-title text-center">
                              <Link
                                className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                to={`/detail/${item.id}`}
                              >
                                {item.title}
                              </Link>
                              <span style={{ fontSize: 15 }}>
                                {" "}
                                (
                                {item.category && item.category.title
                                  ? item.category.title
                                  : "No Category"}
                                )
                              </span>
                            </h5>
                          </div>
                          <div className="card-footer">
                            <div className="title">
                              <span>
                                Rating:{" "}
                                {item.avg_rating
                                  ? item.avg_rating / 5
                                  : "Not yet rated"}
                              </span>
                              <span className="float-end">
                                Views: {item.course_views}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              // className="carousel-control-prev"
              className={`carousel-control-prev ${styles.carouselControlPrev}`}
              type="button"
              data-bs-target="#carouselExampleControls1"
              data-bs-slide="prev"
              style={{ paddingLeft: 0 }}
            >
              <span
                // className="carousel-control-prev-icon"
                className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              // className="carousel-control-next"
              className={`carousel-control-next ${styles.carouselControlNext}`}
              type="button"
              data-bs-target="#carouselExampleControls1"
              data-bs-slide="next"
              style={{ paddingRight: 0 }}
            >
              <span
                // className="carousel-control-next-icon"
                className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
      {/* -------------- End Popular Courses ----------*/}
      {/* ---------------------- Popular Teachers ----------------------- */}
      <h3 className="pb-1 mb-4 mt-4">
        Popular Teachers{" "}
        <Link
          to="/popular-teachers"
          className="btn btn-outline-primary float-end"
        >
          See All
        </Link>
      </h3>
      {/* <div className="row mb-2">
        {popularTeacherData &&
          popularTeacherData.map((teacher, index) => (
            <div className="col-md-3">
              <div className="card">
                <Link to={`/teacher-detail/${teacher.id}`}>
                  <img
                    src={teacher.profile_img}
                    className="card-img-top"
                    alt={teacher.fullName}
                  />
                </Link>
                <div className="card-body text-bg-secondary py-1">
                  <h5 className="card-title text-center">
                    <Link
                      className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                      to={`/teacher-detail/${teacher.id}`}
                    >
                      {teacher.fullName}
                    </Link>
                  </h5>
                </div>
                <div className="card-footer">
                  <div className="title text-center">
                    <span>Total Courses: {teacher.totalTeacherCourses}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div> */}
      {popularTeacherData.length > 0 && (
        <div className="row">
          <div id="carouselExampleControls2" className="carousel slide">
            <div className="carousel-inner">
              {dataChunksPopularTeacher.map((chunk, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="row">
                    {chunk.map((item, idx) => (
                      <div key={idx} className="col-md-3 mb-4">
                        <div className="card">
                          <Link to={`/teacher-detail/${item.id}`}>
                            <img
                              src={item.profile_img}
                              className="card-img-top"
                              alt={item.fullName}
                            />
                          </Link>
                          <div className="card-body text-bg-primary py-1">
                            <h5 className="card-title text-center">
                              <Link
                                className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                to={`/teacher-detail/${item.id}`}
                              >
                                {item.fullName}
                              </Link>
                            </h5>
                          </div>
                          <div className="card-footer">
                            <div className="title text-center">
                              <span>
                                Total Courses: {item.totalTeacherCourses}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              // className="carousel-control-prev"
              className={`carousel-control-prev ${styles.carouselControlPrev}`}
              type="button"
              data-bs-target="#carouselExampleControls2"
              data-bs-slide="prev"
              style={{ paddingLeft: 0 }}
            >
              <span
                // className="carousel-control-prev-icon"
                className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              // className="carousel-control-next"
              className={`carousel-control-next ${styles.carouselControlNext}`}
              type="button"
              data-bs-target="#carouselExampleControls2"
              data-bs-slide="next"
              style={{ paddingRight: 0 }}
            >
              <span
                // className="carousel-control-next-icon"
                className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
      {/* End Popular Teachers */}
      {/* Student Testimonials */}
      <h3 className="pb-1 mb-4 mt-4">Students' Testimonials </h3>
      <div
        id="carouselExampleIndicators"
        className="carousel slide bg-dark text-white py-5"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {testimonialData &&
            testimonialData.map((row, index) => (
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                // aria-current="true"
                // aria-label="Slide 1"
              ></button>
            ))}
        </div>
        <div className="carousel-inner">
          {testimonialData &&
            testimonialData.map((row, i) => (
              <div
                className={i === 0 ? "carousel-item active" : "carousel-item"}
              >
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>{row.reviews}</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    {row.course.title}
                    <cite title="Source Title">, {row.student.fullName}</cite>
                  </figcaption>
                </figure>
              </div>
            ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* End Student Testimonials */}
    </div>
  );
}

export default Home;
