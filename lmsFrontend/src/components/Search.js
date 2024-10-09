import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Search() {
  const [courseData, setCourseData] = useState([]);
  const { searchstring } = useParams();
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/search-courses/" + searchstring).then((res) => {
        setCourseData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="container mt-3 mb-5">
      {/* Latest Courses */}
      <h3 className="pb-1 mb-4">
        {courseData !== "" && (
          <p>
            Searched for{" "}
            <span className="text-primary fw-semibold fst-italic">
              {searchstring}
            </span>
          </p>
        )}
        {courseData == "" && (
          <p className="text-danger text-center fw-semibold">
            <br />
            Sorry!! No results found.
          </p>
        )}
      </h3>
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
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/detail/${course.id}`}>{course.title}</Link>
                  </h5>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* End Latest Courses */}
      {/* Pagination Start */}
      <nav aria-label="Page navigation example">
        <ul className="pagination mt-3 justify-content-center">
          <li className="page-item">
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
      {/* Pagination End */}
    </div>
  );
}

export default Search;
