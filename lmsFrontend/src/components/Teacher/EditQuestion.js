import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function EditQuestion() {
  const [quizId, setquizId] = useState(0);
  const [loading, setLoading] = useState(true); // Track the loading state
  const [questionData, setquestionData] = useState({
    title: "",
    detail: "",
  });

  const { question_id } = useParams();
  useEffect(() => {
    // Fetch current quiz data
    try {
      axios
        .get(baseURL + "/update-quiz-question/" + question_id)
        .then((res) => {
          setquestionData({
            quiz: res.data.quiz.id,
            question: res.data.question,
            answer1: res.data.answer1,
            answer2: res.data.answer2,
            answer3: res.data.answer3,
            answer4: res.data.answer4,
            rightAnswer: res.data.rightAnswer,
          });
          setquizId(res.data.quiz.id);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    // End
  }, []);

  const handleChange = (event) => {
    setquestionData({
      ...questionData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("quiz", questionData.quiz);
    _formData.append("question", questionData.question);
    _formData.append("answer1", questionData.answer1);
    _formData.append("answer2", questionData.answer2);
    _formData.append("answer3", questionData.answer3);
    _formData.append("answer4", questionData.answer4);
    _formData.append("rightAnswer", questionData.rightAnswer);

    try {
      axios
        .put(baseURL + "/update-quiz-question/" + question_id, _formData)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Data has been updated",
              icon: "success",
              toast: true,
              timer: 4000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
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
            <h5 className="card-header">Edit Question</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <input
                  onChange={handleChange}
                  value={questionData.question}
                  type="text"
                  name="question"
                  id="question"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="answer1" className="form-label">
                  Answer1
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={questionData.answer1}
                  name="answer1"
                  id="answer1"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="answer2" className="form-label">
                  Answer2
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={questionData.answer2}
                  name="answer2"
                  id="answer2"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="answer3" className="form-label">
                  Answer3
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={questionData.answer3}
                  name="answer3"
                  id="answer3"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="answer4" className="form-label">
                  Answer4
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={questionData.answer4}
                  name="answer4"
                  id="answer4"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="rightAnswer" className="form-label">
                  Correct Answer
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={questionData.rightAnswer}
                  name="rightAnswer"
                  id="rightAnswer"
                  className="form-control"
                />
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Update
              </button>
              <Link
                type="button"
                to={"/all-questions/" + quizId}
                className="btn btn-warning ms-2"
              >
                Cancel
              </Link>
              <Link
                type="button"
                to={"/all-questions/" + quizId}
                className="btn btn-secondary ms-2"
              >
                Back to Quiz Questions
              </Link>
              {/* </form> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EditQuestion;
