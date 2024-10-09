import React from "react";
import TeacherSidebar from "./TeacherSidebar";
import QuizResult from "./QuizResult";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AttemptedStudents() {
  const [studentData, setstudentData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const { quiz_id } = useParams();

  useEffect(() => {
    // Fetch students who attempted quiz when page loads
    try {
      axios.get(baseURL + "/attempted-quiz/" + quiz_id).then((res) => {
        setstudentData(res.data);
        console.log(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

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
            <h5 className="card-header">Students List</h5>
            <div className="card-body">
              {studentData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email Address</th>
                      <th>Username</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((row, index) => (
                      <tr>
                        <td>{row.student.fullName}</td>
                        <td>{row.student.email}</td>
                        <td>{row.student.userName}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target={`#resultModal${row.id}`}
                          >
                            Quiz Result
                          </button>

                          <div
                            className="modal fade"
                            id={`resultModal${row.id}`}
                            tabindex="-1"
                            aria-labelledby="resultModalLabel"
                            aria-hidden="true"
                          >
                            <QuizResult
                              quiz={row.quiz.id}
                              student={row.student.id}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AttemptedStudents;
