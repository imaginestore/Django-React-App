import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api/course/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/course/`;

function AllCourses() {
  const [courseData, setCourseData] = useState([]);
  const [nextURL, setnextURL] = useState();
  const [previousURL, setpreviousURL] = useState();
  // ----------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // ----------------------------------------------
  const [loading, setLoading] = useState(true); // Track the loading state

  // Fetch courses when page loads
  useEffect(() => {
    fetchData(baseURL);
  }, []);

  const paginationHandler = (url, page) => {
    fetchData(url);
    setCurrentPage(page); // ------------------------
  };

  function fetchData(url) {
    try {
      axios.get(url).then((res) => {
        setnextURL(res.data.next);
        setpreviousURL(res.data.previous);
        setCourseData(res.data.results);
        // -------------------------------------
        setTotalPages(Math.ceil(res.data.count / 8)); // Assuming 8 items per page
        // -------------------------------------
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }

  // ---------------------------------------
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => paginationHandler(`${baseURL}?page=${i}`, i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  // ---------------------------------------

  useEffect(() => {
    document.title = "All Courses";
  });

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
    <div className="container mt-3 mb-5">
      {/* Latest Courses */}
      <h3 className="pb-1 mb-4">Latest Courses</h3>
      <div className="row mb-4">
        {courseData &&
          courseData.map((course, index) => (
            <div className="col-md-3 mb-4">
              <div className="card">
                <Link to={`/detail/${course.id}`}>
                  <img
                    src={course.featured_img}
                    className="card-img-top"
                    alt={course.title}
                  />
                </Link>
                <div className="card-body text-bg-primary py-1">
                  <h5 className="card-title text-center">
                    <Link
                      className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                      to={`/detail/${course.id}`}
                    >
                      {course.title}
                    </Link>
                    <span style={{ fontSize: 15 }}>
                      {" "}
                      (
                      {course.category && course.category.title
                        ? course.category.title
                        : "No Category"}
                      )
                    </span>
                  </h5>
                </div>
                {/* <div className="card-footer">
                  <div className="title text-center">
                    {course.category && course.category.title
                      ? course.category.title
                      : "No Category"}
                  </div>
                </div> */}
              </div>
            </div>
          ))}
      </div>
      {/* End Latest Courses */}
      {/* Pagination Start */}
      <nav aria-label="Page navigation example">
        <ul className="pagination mt-3 justify-content-center">
          {previousURL && (
            <li className="page-item">
              <button
                className="page-link"
                // onClick={() => paginationHandler(previousURL)}
                onClick={() => paginationHandler(previousURL, currentPage - 1)}
              >
                <i class="bi bi-arrow-left-circle-fill"></i> Previous
              </button>
            </li>
          )}
          {renderPageNumbers()}
          {nextURL && (
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => paginationHandler(nextURL, currentPage + 1)}
              >
                Next <i className="bi bi-arrow-right-circle-fill"></i>
              </button>
            </li>
          )}
        </ul>
      </nav>
      {/* Pagination End */}
    </div>
  );
}

export default AllCourses;
