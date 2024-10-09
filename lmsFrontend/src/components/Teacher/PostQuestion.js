import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function PostQuestion() {
  const [server_error, setServerError] = useState({});
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);
  const [questionData, setQuestionData] = useState({
    text: "",
  });

  const handleChange = (event) => {
    setQuestionData({
      ...questionData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExamChange = (e) => {
    const exam_Id = e.target.value;
    setExamId(exam_Id);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(baseURL + "/exams/");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("exam", examId);
    if (questionData.text) {
      _formData.append("text", questionData.text);
    }

    axios
      .post(baseURL + "/questions/", _formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Question posted successfully!",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        setQuestionData({
          text: "",
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
    document.title = "Post Question";
  });

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Post Questions</h5>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="exam" className="form-label">
                    Exam
                  </label>
                  <select
                    value={examId}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                    onChange={handleExamChange}
                    name="exam"
                    id="exam"
                    className="form-select"
                  >
                    <option value="">Select Exam</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="text" className="form-label">
                    Question Text
                  </label>
                  <textarea
                    onChange={handleChange}
                    name="text"
                    id="text"
                    className="form-control"
                    value={questionData.text}
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary"
                >
                  Post Question
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

export default PostQuestion;
