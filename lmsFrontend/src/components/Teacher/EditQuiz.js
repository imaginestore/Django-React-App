import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function EditQuiz() {
  const [loading, setLoading] = useState(true); // Track the loading state
  const [quizData, setquizData] = useState({
    title: "",
    detail: "",
  });

  const teacherId = localStorage.getItem("teacherId");
  const { quiz_id } = useParams();
  useEffect(() => {
    // Fetch current quiz data
    try {
      axios.get(baseURL + "/teacher-quiz-detail/" + quiz_id).then((res) => {
        setquizData({
          title: res.data.title,
          detail: res.data.detail,
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    // End
  }, []);

  const handleChange = (event) => {
    setquizData({
      ...quizData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("teacher", teacherId);
    _formData.append("title", quizData.title);
    _formData.append("detail", quizData.detail);

    try {
      axios
        .put(baseURL + "/teacher-quiz-detail/" + quiz_id, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
            <h5 className="card-header">Edit Quiz</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  onChange={handleChange}
                  value={quizData.title}
                  type="text"
                  className="form-control"
                  name="title"
                  id="title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="detail" className="form-label">
                  Detail
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  value={quizData.detail}
                  name="detail"
                  id="detail"
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
              <Link type="button" to={"/quiz"} className="btn btn-warning ms-2">
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

export default EditQuiz;
