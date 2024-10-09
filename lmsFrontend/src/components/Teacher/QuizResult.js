import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function QuizResult(props) {
  const [resultData, setresultData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    // Fetch courses when page loads
    try {
      axios
        .get(`${baseURL}/fetch-quiz-result/${props.quiz}/${props.student}`)
        .then((res) => {
          setresultData(res.data);
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
    <>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 text-primary" id="resultModalLabel">
              Quiz Result
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td className="fw-bolder">Total Questions: </td>
                  <td>{resultData.total_questions}</td>
                </tr>
                <tr>
                  <td className="fw-bolder">Attempted Questions: </td>
                  <td>{resultData.total_attempted_questions}</td>
                </tr>
                <tr>
                  <td className="fw-bolder">Correct Answers: </td>
                  <td>{resultData.total_correct_questions}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizResult;
