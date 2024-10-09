import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CheckQuizinCourse(props) {
  const [quizData, setquizData] = useState([]);
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    // Fetch courses when page loads
    try {
      axios
        .get(
          `${baseURL}/fetch-quiz-assign-status/${props.quiz}/${props.course}`
        )
        .then((res) => {
          setquizData(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Assign quiz to a course
  const assignQuiz = (quiz_id) => {
    const _formData = new FormData();
    _formData.append("teacher", teacherId);
    _formData.append("course", props.course);
    _formData.append("quiz", props.quiz);
    try {
      axios
        .post(baseURL + "/quiz-assign-course/", _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            window.location.reload();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <td>
      {quizData.bool === false && (
        <button
          onClick={() => assignQuiz(props.quiz)}
          className="btn btn-success btn-sm ms-1"
        >
          Assign Quiz
        </button>
      )}
      {quizData.bool === true && (
        <>
          <span className="btn btn-outline-secondary btn-sm">Assigned</span>
          <Link
            className="btn btn-info btn-sm ms-2"
            to={`/attempted-students/` + props.quiz}
          >
            Attempted Students
          </Link>
        </>
      )}
    </td>
  );
}

export default CheckQuizinCourse;
