import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// const baseURL = "http://127.0.0.1:8000/api";
// const baseURL1 = "http://127.0.0.1:8000/api/popular-teachers/?all=1";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;
const baseURL1 = `${process.env.REACT_APP_API_BASE_URL}/popular-teachers/?all=1`;

function PopularTeachers() {
  const [teacherData, setteacherData] = useState(null);
  const [nextURL, setnextURL] = useState();
  const [previousURL, setpreviousURL] = useState();
  // ----------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // ----------------------------------------------
  const [loading, setLoading] = useState(true); // Track the loading state

  // Fetch teachers when the page loads
  useEffect(() => {
    fetchData(baseURL + "/popular-teachers/?all=1");
    // axios.get(baseURL + "/popular-teachers/?all=1").then((response) => {
    //   setteacherData(response.data);
    // });
  }, []);

  const paginationHandler = (url, page) => {
    fetchData(url);
    setCurrentPage(page);
  };

  function fetchData(url) {
    try {
      axios.get(url).then((res) => {
        setnextURL(res.data.next);
        setpreviousURL(res.data.previous);
        setteacherData(res.data);
        setTotalPages(Math.ceil(res.data.count / 8)); // Assuming 8 items per page
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
            onClick={() => paginationHandler(`${baseURL1}?page=${i}`, i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  // ---------------------------------------
  // console.log(teacher);
  useEffect(() => {
    document.title = "Popular Teachers";
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
      {/* Popular Teachers */}
      <h3 className="pb-1 mb-4">Popular Teachers</h3>
      <div className="row mb-4">
        {teacherData &&
          teacherData.map((teacher, index) => (
            <div className="col-md-3 mb-4">
              <div className="card">
                <Link to={`/teacher-detail/${teacher.id}`}>
                  <img
                    src={teacher.profile_img}
                    className="card-img-top"
                    alt={teacher.fullName}
                  />
                </Link>
                <div className="card-body text-bg-primary py-1">
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
      </div>
      {/* End Popular Teachers */}
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

export default PopularTeachers;
