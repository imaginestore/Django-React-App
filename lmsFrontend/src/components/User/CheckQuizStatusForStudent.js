import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CheckQuizStatusForStudent(props) {
  const [quizData, setquizData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    // Fetch courses when page loads
    try {
      axios
        .get(
          `${baseURL}/fetch-quiz-attempt-status/${props.quiz}/${props.student}`
        )
        .then((res) => {
          setquizData(res.data);
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
    <td>
      {quizData.bool === true && (
        <span className="text-success">Attempted</span>
      )}
      {quizData.bool === false && (
        <Link
          to={`/take-quiz/${props.quiz}`}
          className="btn btn-success btn-sm ms-1"
        >
          Take Quiz
        </Link>
      )}
    </td>
  );
}

export default CheckQuizStatusForStudent;
