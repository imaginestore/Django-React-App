import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function QuizQuestions() {
  const [questionData, setquestionData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const { quiz_id } = useParams();
  // Fetch quiz questions when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/quiz-questions/" + quiz_id).then((res) => {
        settotalResult(res.data.length);
        setquestionData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  // Delete data
  const handleDeleteClick = (question_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this data?",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(baseURL + "/update-quiz-question/" + question_id)
            .then((res) => {
              Swal.fire("success", "Data has been deleted.");
              try {
                axios
                  .get(baseURL + "/quiz-questions/" + quiz_id)
                  .then((res) => {
                    settotalResult(res.data.length);
                    setquestionData(res.data);
                  });
              } catch (error) {
                console.log(error);
              }
            });
        } catch (error) {
          Swal.fire("error", "Data has not been deleted!!");
        }
      } else {
        Swal.fire("error", "Data has not been deleted!!");
      }
    });
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
            <h5 className="card-header">
              <span className="text-dark">
                Quiz Questions{" "}
                <span className="badge text-bg-primary">{totalResult}</span>
              </span>
              <Link
                className="btn btn-success btn-sm float-end"
                to={"/add-question/" + quiz_id}
              >
                Add Question
              </Link>
            </h5>
            <div className="card-body">
              {loading ? ( // Check if loading is true
                <div>Loading...</div> // Display loading indicator
              ) : totalResult > 0 ? (
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Questions</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionData.map((row, index) => (
                        <tr>
                          <td>
                            <Link to={"/edit-question/" + row.id}>
                              {row.question}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={"/edit-question/" + row.id}
                              className="btn btn-sm text-white btn-info"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(row.id)}
                              to={"/delete-question/" + row.id}
                              className="btn btn-sm btn-danger ms-1"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Link
                    role="button"
                    to={"/quiz"}
                    className="btn btn-sm btn-secondary ms-2"
                  >
                    Back to Quiz
                  </Link>
                </div>
              ) : (
                <div className="mt-3 alert alert-danger" role="alert">
                  <div>
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span className="ms-2">No records found!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default QuizQuestions;
