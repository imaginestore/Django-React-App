import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function RecommendedCourses() {
  const [courseData, setcourseData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const studentId = localStorage.getItem("studentId");
  // Fetch students when page loads
  useEffect(() => {
    try {
      axios
        .get(baseURL + "/fetch-recommended-courses/" + studentId)
        .then((res) => {
          setcourseData(res.data.results);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    document.title = "Recommended Courses";
  }, []);

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
          <Sidebar />
        </aside>
        <section className="col-md-9">
          {courseData.length > 0 ? (
            <div className="card">
              <h5 className="card-header">Recommended Courses</h5>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Technologies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.map((row, index) => (
                      <tr>
                        <td>
                          <Link to={`/detail/` + row.id}>{row.title}</Link>
                        </td>
                        <td>{row.techs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-danger">No recommended courses found</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default RecommendedCourses;
