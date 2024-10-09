import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherSkillsCourses() {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const { skill_name, teacher_id } = useParams();
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios
        .get(
          baseURL +
            "/course/?skill_name=" +
            skill_name +
            "&teacher=" +
            teacher_id
        )
        .then((res) => {
          setCourseData(res.data);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
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
    <div className="container mt-3 mb-5">
      {/* Latest Courses */}
      <h3 className="pb-1 mb-4">{skill_name}</h3>
      <div className="row mb-4">
        <div className="col-md-3 mb-4">
          <div className="card">
            <Link to="/detail/1">
              <img src="/python.png" className="card-img-top" alt="..." />
            </Link>
            <div className="card-body">
              <h5 className="card-title">
                <Link to="/detail/1">Course Title</Link>
              </h5>
            </div>
          </div>
        </div>
      </div>
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
        <p>No courses found.</p>
      )}
      {/* End Latest Courses */}
    </div>
  );
}

export default TeacherSkillsCourses;
