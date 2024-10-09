import React from "react";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo } from "../LocalStorageService";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function UserExamForm() {
  const [server_error, setServerError] = useState({});
  let { user_id, user_name, user_type } = getUserInfo();

  // const { examId } = useParams();
  const { examId } = 1;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentExamId, setStudentExamId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [partialSuccessMessage, setPartialSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    createStudentExam();
    fetchQuestions();
    document.title = "User Online Exam";
  }, []);

  const createStudentExam = async () => {
    try {
      const response = await axios.post(baseURL + "/student-exams/", {
        student: studentId,
        exam: examId,
      });
      setStudentExamId(response.data.id);
      console.log("response.data----->", response.data);
    } catch (error) {
      //console.error("Error creating student exam:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("error.response.data------>:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("error.request----->:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("error.message----->:", error.message);
      }
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(baseURL + `/questions/?exam=${examId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleInputChange = (questionId, answerText) => {
    setAnswers({
      ...answers,
      [questionId]: answerText,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const submissionResponses = await Promise.all(
        Object.entries(answers).map(([questionId, answerText]) =>
          axios.post(baseURL + "/answers/", {
            student_exam: studentExamId,
            question: questionId,
            answer_text: answerText,
            student: studentId,
          })
        )
      );
      await axios.patch(baseURL + `/student-exams/${studentExamId}/`, {
        submitted_time: new Date().toISOString(),
      });
      const allSuccessful = submissionResponses.every(
        (response) => response.data.status === "success"
      );

      if (allSuccessful) {
        setSuccessMessage("All answers submitted successfully!");
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 6000);
      } else {
        setPartialSuccessMessage(
          "Some answers were not submitted successfully. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      setErrorMessage(
        "There was an error submitting your answers. Please try again."
      );
    }
  };

  // Submit form - another way of posting data
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     await Promise.all(
  //       Object.entries(answers).map(([questionId, answerText]) =>
  //         axios.post(baseURL + "/answers/", {
  //           student_exam: studentExamId,
  //           question: questionId,
  //           answer_text: answerText,
  //           student: studentId,
  //         })
  //       )
  //     );
  // await axios.patch(baseURL + `/student-exams/${studentExamId}/`, {
  //   submitted_time: new Date().toISOString(),
  // });
  //     Swal.fire({
  //       title: "Answers submitted successfully",
  //       icon: "success",
  //       toast: true,
  //       timer: 5000,
  //       position: "top-right",
  //       timerProgressBar: true,
  //       showConfirmButton: false,
  //     });
  //     setTimeout(() => {
  //       navigate("/user-dashboard");
  //     }, 6000);
  //   } catch (error) {
  //     console.error("Error submitting answers:", error);
  //     setErrorMessage("Error submitting answers");
  //   }
  // };
  // End
  console.log("student_exam----->", studentExamId);
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <div className="col-md-9">
          {/* {server_error.non_field_errors
            ? console.log(server_error.non_field_errors[0])
            : ""}
           */}
          <div className="card">
            <h5 className="card-header">User Exam Form</h5>
            <div className="card-body">
              {/* <form> */}
              {questions.map((question) => (
                <div className="mb-3" key={question.id}>
                  <label htmlFor="question" className="form-label">
                    {question.text}
                  </label>
                  <textarea
                    onChange={(e) =>
                      handleInputChange(question.id, e.target.value)
                    }
                    className="form-control"
                    value={answers[question.id] || ""}
                  ></textarea>
                </div>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Submit Exam
              </button>
              {/* </form> */}
              {successMessage && (
                <div className="mt-3 alert alert-success" role="alert">
                  <div>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                </div>
              )}
              {partialSuccessMessage && (
                <div className="mt-3 alert alert-warning" role="alert">
                  <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {partialSuccessMessage}
                  </div>
                </div>
              )}
              {errorMessage && (
                <div className="mt-3 alert alert-danger" role="alert">
                  <div>
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserExamForm;
