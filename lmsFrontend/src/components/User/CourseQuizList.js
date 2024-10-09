import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import CheckQuizStatusForStudent from "./CheckQuizStatusForStudent";
import axios from "axios";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CourseQuizList() {
  const [quizData, setquizData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const studentId = localStorage.getItem("studentId");
  const { course_id } = useParams();
  // Fetch assigned quiz list when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/fetch-assigned-quiz/" + course_id).then((res) => {
        setquizData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    document.title = "Quiz List";
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
          <Sidebar />
        </aside>
        <section className="col-md-9">
          {quizData.length > 0 ? (
            <>
              <div className="card">
                <h5 className="card-header">Quiz List</h5>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Quiz</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizData.map((row, index) => (
                        <tr>
                          <td>{row.quiz.title}</td>
                          <CheckQuizStatusForStudent
                            quiz={row.quiz.id}
                            student={studentId}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-danger">No quiz found</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CourseQuizList;
