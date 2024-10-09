import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AllQuizzes() {
  const [quizData, setquizData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const teacherId = localStorage.getItem("teacherId");
  // Fetch courses when page loads
  useEffect(() => {
    try {
      setLoading(true); // Set loading to true before fetching data
      axios.get(baseURL + "/teacher-quiz/" + teacherId).then((res) => {
        settotalResult(res.data.length);
        setquizData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  // Delete data
  const handleDeleteClick = (quiz_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this data?",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(baseURL + "/quiz/" + quiz_id).then((res) => {
            Swal.fire("success", "Data has been deleted.");
            try {
              axios.get(baseURL + "/teacher-quiz/" + teacherId).then((res) => {
                settotalResult(res.data.length);
                setquizData(res.data);
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
                All Quizzes{" "}
                <span className="badge text-bg-primary">{totalResult}</span>
              </span>
            </h5>
            <div className="card-body">
              {loading ? ( // Check if loading is true
                <div>Loading...</div> // Display loading indicator
              ) : totalResult > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Total Questions</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData.map((row, index) => (
                      <tr>
                        <td>
                          <Link to={`/all-questions/` + row.id}>
                            {row.title}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/all-questions/` + row.id}>
                            {row.total_questions}
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="btn btn-info btn-sm"
                            to={`/edit-quiz/` + row.id}
                          >
                            Edit
                          </Link>
                          <Link
                            className="btn btn-success btn-sm ms-2"
                            to={`/add-question/` + row.id}
                          >
                            Add question
                          </Link>
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => handleDeleteClick(row.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="mt-3 alert alert-danger" role="alert">
                  <div>
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span className="ms-2">No quiz created!</span>
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

export default AllQuizzes;
