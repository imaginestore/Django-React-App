import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CategoryCourses() {
  const [courseData, setCourseData] = useState([]);
  const [nextURL, setnextURL] = useState();
  const [previousURL, setpreviousURL] = useState();
  const { category_id, category_slug } = useParams();
  const [loading, setLoading] = useState(true); // Track the loading state
  // Fetch courses when page loads
  useEffect(() => {
    fetchData(baseURL + "/course/?category=" + category_id);
  }, []);

  const paginationHandler = (url) => {
    fetchData(url);
  };

  function fetchData(url) {
    try {
      axios.get(url).then((res) => {
        setnextURL(res.data.next);
        setpreviousURL(res.data.previous);
        setCourseData(res.data.results);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
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
    <div className="container mt-3 mb-5">
      {/* Latest Courses */}
      <h3 className="pb-1 mb-4">{category_slug}</h3>
      <div className="row mb-4">
        {courseData.length > 0 ? (
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
          ))
        ) : (
          <p>No category courses found.</p>
        )}
        {/* End Latest Courses */}
        {/* Pagination Start */}
        <nav aria-label="Page navigation example">
          <ul className="pagination mt-3 justify-content-center">
            {previousURL && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginationHandler(previousURL)}
                >
                  <i class="bi bi-arrow-left"></i> Previous
                </button>
              </li>
            )}
            {nextURL && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginationHandler(nextURL)}
                >
                  Next <i class="bi bi-arrow-right"></i>
                </button>
              </li>
            )}
          </ul>
        </nav>
        {/* Pagination End */}
      </div>
    </div>
  );
}

export default CategoryCourses;
