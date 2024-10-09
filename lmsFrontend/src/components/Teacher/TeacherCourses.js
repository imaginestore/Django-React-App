import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherCourses() {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const teacherId = localStorage.getItem("teacherId");
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/teacher-courses/" + teacherId).then((res) => {
        setCourseData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  // Delete data
  const handleDeleteClick = (course_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this data?",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(baseURL + "/course/" + course_id).then((res) => {
            Swal.fire("success", "Data has been deleted.");
            try {
              axios
                .get(baseURL + "/teacher-courses/" + teacherId)
                .then((res) => {
                  setCourseData(res.data);
                });
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          Swal.fire("error", "Data has not been deleted!!");
        }
      } else {
        Swal.fire("error", "Data has not been deleted!!");
      }
    });
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
            <h5 className="card-header">My Courses</h5>
            <div className="card-body">
              {courseData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Total Enrolled</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.map((course, index) => (
                      <tr>
                        <td>
                          <Link to={`/all-chapters/` + course.id}>
                            {course.title}
                          </Link>
                          <br />
                          {course.courseRating && (
                            <small className="text-secondary">
                              Rating: {course.courseRating}/5
                            </small>
                          )}
                          {!course.courseRating && (
                            <small className="text-secondary">
                              Rating: 0/5
                            </small>
                          )}
                        </td>
                        <td>
                          <img
                            src={course.featured_img}
                            width="80"
                            className="rounded"
                            alt={course.title}
                          />
                        </td>
                        <td>
                          <Link to={`/enrolled-students/` + course.id}>
                            {course.totalEnrolledStudents}
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="btn btn-info btn-sm me-2 mb-2"
                            to={`/edit-course/` + course.id}
                          >
                            Edit Course
                          </Link>
                          <Link
                            className="btn btn-success btn-sm me-2 mb-2"
                            to={`/add-chapter/` + course.id}
                          >
                            Add Chapter
                          </Link>
                          <Link
                            className="btn btn-primary btn-sm me-2 mb-2"
                            to={`/study-materials/` + course.id}
                          >
                            Study Material
                          </Link>
                          <Link
                            className="btn btn-warning btn-sm me-2 mb-2"
                            to={`/assign-quiz/` + course.id}
                          >
                            Assign Quiz
                          </Link>
                          <Link
                            className="btn btn-secondary btn-sm me-2 mb-2"
                            to={`/assign-exam/` + course.id}
                          >
                            Assign Exam
                          </Link>
                          <button
                            className="btn btn-danger btn-sm mb-2"
                            onClick={() => handleDeleteClick(course.id)}
                            to={"/delete-course/" + course.id}
                          >
                            Delete Course
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeacherCourses;
