import React from "react";
import { Link, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function MarkExam() {
  const { studentExamId } = useParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const [server_error, setServerError] = useState({});

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(
        baseURL + `/answers/?student_exam=${studentExamId}`
      );
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching answers:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  const handleInputChange = (answerId, marks, feedback) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.id === answerId ? { ...answer, marks, feedback } : answer
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Promise.all(
        answers.map((answer) =>
          axios.patch(baseURL + `/answers/${answer.id}/`, {
            marks: answer.marks,
            feedback: answer.feedback,
          })
        )
      );
      Swal.fire({
        title: "Marks and feedback submitted successfully!",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      // alert('Marks and feedback submitted successfully!');
    } catch (error) {
      console.error("Error submitting marks and feedback:", error);
    }
  };

  useEffect(() => {
    document.title = "Mark Exam";
  });

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
            <h5 className="card-header">Mark Exam</h5>
            <div className="card-body">
              {answers.length > 0 ? (
                <form>
                  {answers.map((answer) => (
                    <div key={answer.id}>
                      <h5>{answer.question.text}</h5>
                      <p>{answer.answer_text}</p>
                      <div className="mb-3">
                        <label htmlFor="marks" className="form-label">
                          Marks
                        </label>
                        <input
                          type="number"
                          onChange={(e) =>
                            handleInputChange(
                              answer.id,
                              e.target.value,
                              answer.feedback
                            )
                          }
                          name="marks"
                          id="marks"
                          className="form-control"
                          value={answer.marks}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="feedback" className="form-label">
                          Feedback
                        </label>
                        <textarea
                          onChange={(e) =>
                            handleInputChange(
                              answer.id,
                              answer.marks,
                              e.target.value
                            )
                          }
                          name="feedback"
                          id="feedback"
                          className="form-control"
                          value={answer.feedback}
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-primary"
                      >
                        Submit Marks and Feedback
                      </button>
                    </div>
                  ))}
                </form>
              ) : (
                <p>No exam found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MarkExam;
