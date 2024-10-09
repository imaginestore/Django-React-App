import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TakeQuiz() {
  const [questionData, setquestionData] = useState([]);
  const { quiz_id } = useParams();
  const studentId = localStorage.getItem("studentId");
  // Fetch quiz questions when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/quiz-questions/" + quiz_id + "/1").then((res) => {
        setquestionData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
    document.title = "Attempt Quiz";
  }, []);

  const submitAnswer = (question_id, rightAnswer) => {
    const _formData = new FormData();
    _formData.append("student", studentId);
    _formData.append("quiz", quiz_id);
    _formData.append("question", question_id);
    _formData.append("rightAnswer", rightAnswer);

    try {
      axios
        .post(baseURL + "/attempt-quiz/", _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            try {
              axios
                .get(
                  baseURL +
                    "/quiz-questions/" +
                    quiz_id +
                    "/next-question/" +
                    question_id
                )
                .then((res) => {
                  setquestionData(res.data);
                });
            } catch (error) {
              console.log(error);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <h4 className="mb-3 border-bottom pb-1">Quiz Title</h4>
          {questionData !== "" &&
            questionData.map((row, index) => (
              <div className="card">
                <h5 className="card-header">{row.question}</h5>
                <div className="card-body">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <button
                            onClick={() => submitAnswer(row.id, row.answer1)}
                            className="btn btn-outline-secondary"
                          >
                            {row.answer1}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <button
                            onClick={() => submitAnswer(row.id, row.answer2)}
                            className="btn btn-outline-secondary"
                          >
                            {row.answer2}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <button
                            onClick={() => submitAnswer(row.id, row.answer3)}
                            className="btn btn-outline-secondary"
                          >
                            {row.answer3}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <button
                            onClick={() => submitAnswer(row.id, row.answer4)}
                            className="btn btn-outline-secondary"
                          >
                            {row.answer4}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          {questionData === "" && (
            <h3 className="text-primary text-center fw-semibold">
              <br />
              No more questions!!
            </h3>
          )}
        </section>
      </div>
    </div>
  );
}

export default TakeQuiz;
