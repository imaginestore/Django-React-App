import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import CheckQuizinCourse from "./CheckQuizinCourse";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AssignQuiz() {
  const [quizData, setquizData] = useState([]);
  const [courseData, setcourseData] = useState([]);
  const teacherId = localStorage.getItem("teacherId");
  const { course_id } = useParams();

  useEffect(() => {
    // Fetch courses when page loads
    try {
      axios.get(baseURL + "/teacher-quiz/" + teacherId).then((res) => {
        setquizData(res.data);
      });
    } catch (error) {
      console.log(error);
    }

    // Fetch course
    try {
      axios.get(baseURL + "/course/" + course_id).then((res) => {
        console.log(res);
        setcourseData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Assign quiz to a course
  //   const assignQuiz = (quiz_id) => {
  //     const _formData = new FormData();
  //     _formData.append("teacher", teacherId);
  //     _formData.append("course", course_id);
  //     _formData.append("quiz", quiz_id);
  //     try {
  //       axios
  //         .post(baseURL + "/quiz-assign-course/", _formData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         })
  //         .then((res) => {
  //           if (res.status === 200 || res.status === 201) {
  //             window.location.reload();
  //           }
  //           Swal.fire({
  //             title: "Quiz is successfully assigned to this course",
  //             icon: "success",
  //             toast: true,
  //             timer: 5000,
  //             position: "top-right",
  //             timerProgressBar: true,
  //             showConfirmButton: false,
  //           });
  //         });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              Assign Quiz{" "}
              <span className="text-primary">({courseData.title})</span>
            </h5>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Action / Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quizData.map((row, index) => (
                    <tr>
                      <td>
                        <Link to={`/all-questions/` + row.id}>{row.title}</Link>
                      </td>
                      <CheckQuizinCourse quiz={row.id} course={course_id} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AssignQuiz;
