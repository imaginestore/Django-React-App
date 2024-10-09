import React from "react";
import { Link, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function ExamSummary() {
  const teacherId = localStorage.getItem("teacherId");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    if (teacherId) {
      fetchExams();
    } else {
      console.error("No teacherId found in localStorage");
    }
    document.title = "Exams Summary";
  }, [teacherId]);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        baseURL + "/teacher-exams/" + teacherId + "/"
      ); // Fetch exams for the logged-in teacher
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
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
            <h5 className="card-header">Exam(s) Summary</h5>
            <div className="card-body">
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <div className="mb-3" key={exam.id}>
                    <table class="table table-bordered">
                      <tbody>
                        <tr>
                          <td className="table-light">
                            <h6 className="text-primary">{exam.title}</h6>
                            {exam.description}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              Start Time:{" "}
                              <span class="badge text-bg-secondary">
                                {new Date(exam.start_time).toLocaleString()}
                              </span>
                            </p>
                            <p>
                              End Time:{" "}
                              <span class="badge text-bg-secondary">
                                {new Date(exam.end_time).toLocaleString()}
                              </span>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>Questions</h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <ul>
                              {exam.questions.map((question) => (
                                <li key={question.id}>{question.text}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <div className="mb-3">No exams found!</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ExamSummary;
