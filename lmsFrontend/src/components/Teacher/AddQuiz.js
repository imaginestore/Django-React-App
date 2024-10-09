import React from "react";
import TeacherSidebar from "./TeacherSidebar";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AddQuiz() {
  const [server_error, setServerError] = useState({});
  const navigate = useNavigate();
  const [quizData, setquizData] = useState({
    title: "",
    detail: "",
  });

  const handleChange = (event) => {
    setquizData({
      ...quizData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const teacherId = localStorage.getItem("teacherId");
    const _formData = new FormData();
    _formData.append("teacher", teacherId);
    _formData.append("title", quizData.title);
    _formData.append("detail", quizData.detail);

    axios
      .post(baseURL + "/quiz/", _formData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Quiz has been added successfully",
            icon: "success",
            toast: true,
            timer: 4000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setquizData({
            title: "",
            detail: "",
          });
        }
        //window.location.href = "/add-quiz";
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data) {
            console.log("---------------error.response.data-------------");
            console.log(error.response.data);
            setServerError(error.response.data);
          }
        } else if (error.request) {
          console.log("---------------error.request-------------");
          console.log(error.request);
        } else {
          console.log("---------------error.message-------------");
          setServerError(error.message);
        }
        console.log(error.config);
      });
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Add Quiz</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="title"
                  id="title"
                  value={quizData.title}
                />
                {server_error.title && (
                  <small className="text-danger ms-2">
                    {server_error.title ? server_error.title[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="detail" className="form-label">
                  Detail
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="detail"
                  id="detail"
                  className="form-control"
                  value={quizData.detail}
                />
                {server_error.detail && (
                  <small className="text-danger ms-2">
                    {server_error.detail ? server_error.detail[0] : ""}
                  </small>
                )}
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Submit
              </button>
              <Link
                role="button"
                to={"/teacher-dashboard"}
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

export default AddQuiz;
