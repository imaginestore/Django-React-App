import React from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function ViewMarksFeedback() {
  // const query = useQuery();
  // const studentExamId = query.get("student_exam_id");
  // const { studentExamId } = useParams();
  const { exam_id } = useParams(); // Get the exam_id from the URL parameters
  const [answers, setAnswers] = useState([]);
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Track the loading state
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    fetchExamDetails();
  }, []);

  const fetchExamDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/student-exams/${exam_id}/`);
      console.log("Exam Details------>", response.data);
      setExamDetails(response.data);
      setAnswers(response.data.answers);
    } catch (error) {
      console.error("Error fetching exam details:", error);
      setServerError(error.response?.data || "Something went wrong");
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    document.title = "View Marks and Feedback";
  });

  if (loading) {
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-md-12 text-center my-5">
          <div>Loading...</div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Marks and Feedback</h5>
            <div className="card-body">
              {answers.length > 0 ? (
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td className="fw-bold bg-dark-subtle">
                        {examDetails.exam.title}
                      </td>
                    </tr>
                    {answers.map((answer) => (
                      // <span key={answer.id}>
                      <>
                        <tr key={answer.id}>
                          <td className="bg-body-secondary">
                            <span className="text-secondary-emphasis">
                              Question:
                            </span>{" "}
                            {answer.question.text}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="text-secondary-emphasis">
                              Your Answer:
                            </span>{" "}
                            {answer.answer_text}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="text-secondary-emphasis">
                              Marks:
                            </span>{" "}
                            {answer.marks}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="text-secondary-emphasis">
                              Feedback:
                            </span>{" "}
                            {answer.feedback}
                          </td>
                        </tr>
                      </>
                    ))}
                    {serverError && (
                      <p className="text-danger">
                        Error fetching answers: {serverError.message}
                      </p>
                    )}
                    <tr>
                      <td className="bg-success text-white">
                        <span className="fw-bold">Total Marks:</span>{" "}
                        {examDetails.total_marks}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No exams-marks found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewMarksFeedback;
