import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AddQuizQuestion() {
  const [questionData, setquestionData] = useState({
    quiz: "",
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    rightAnswer: "",
  });

  const handleChange = (event) => {
    setquestionData({
      ...questionData,
      [event.target.name]: event.target.value,
    });
  };

  const { quiz_id } = useParams();

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("quiz", quiz_id);
    _formData.append("question", questionData.question);
    _formData.append("answer1", questionData.answer1);
    _formData.append("answer2", questionData.answer2);
    _formData.append("answer3", questionData.answer3);
    _formData.append("answer4", questionData.answer4);
    _formData.append("rightAnswer", questionData.rightAnswer);

    try {
      axios
        .post(baseURL + "/quiz-questions/" + quiz_id, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: "Data has been added",
              icon: "success",
              toast: true,
              timer: 3000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
          //window.location.href = "/add-chapter/1";
          window.location.reload();
          //console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              Add Quiz Question{" "}
              <Link
                className="btn btn-success btn-sm float-end"
                to={"/all-questions/" + quiz_id}
              >
                All Questions
              </Link>
            </h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <input
                  type="text"
                  onChange={handleChange}
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
                Save
              </button>
              <Link
                role="button"
                to={"/all-questions/" + quiz_id}
                className="btn btn-warning ms-2"
              >
                Cancel
              </Link>
              {/* </form> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddQuizQuestion;
