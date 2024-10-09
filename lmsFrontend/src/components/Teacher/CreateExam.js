import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CreateExam() {
  const teacherId = localStorage.getItem("teacherId");
  const [server_error, setServerError] = useState({});
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (event) => {
    setExamData({
      ...examData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("teacher", teacherId);
    if (examData.title) {
      _formData.append("title", examData.title);
    }
    if (examData.description) {
      _formData.append("description", examData.description);
    }
    if (examData.start_time) {
      _formData.append("start_time", examData.start_time);
    }
    if (examData.end_time) {
      _formData.append("end_time", examData.end_time);
    }

    axios
      .post(baseURL + "/exams/", _formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Exam created successfully",
            icon: "success",
            toast: true,
            timer: 5000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        setExamData({
          title: "",
          description: "",
          start_time: "",
          end_time: "",
        });
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

  useEffect(() => {
    document.title = "Create Online Exam";
  });

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Create Online Exam</h5>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="title"
                    id="title"
                    className="form-control"
                    value={examData.title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    onChange={handleChange}
                    name="description"
                    id="description"
                    className="form-control"
                    value={examData.description}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="start_time" className="form-label">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    onChange={handleChange}
                    name="start_time"
                    id="start_time"
                    className="form-control"
                    value={examData.start_time}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="start_time" className="form-label">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    onChange={handleChange}
                    name="end_time"
                    id="end_time"
                    className="form-control"
                    value={examData.end_time}
                  />
                </div>
                <button
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary"
                >
                  Create Exam
                </button>
                {/* <Link
                  type="button"
                  to={"/all-chapters/" + courseId}
                  className="btn btn-secondary ms-3"
                >
                  Back to all Chapters
                </Link> */}
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CreateExam;
