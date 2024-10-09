import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function ShowAssignment() {
  const [assignmentData, setassignmentData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [loading, setLoading] = useState(true); // Track the loading state
  const { student_id } = useParams();
  const { teacher_id } = useParams();

  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios
        .get(baseURL + "/student-assignment/" + teacher_id + "/" + student_id)
        .then((res) => {
          settotalResult(res.data.length);
          setassignmentData(res.data);
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
            <h5 className="card-header">
              All Assignments ({totalResult})
              <Link
                className="btn btn-success btn-sm float-end"
                to={`/add-assignment/${student_id}/${teacher_id}`}
              >
                Add Assignment
              </Link>
            </h5>
            <div className="card-body">
              {assignmentData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Assignment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentData.map((row, index) => (
                      <tr>
                        <td>{row.title}</td>
                        <td>
                          {row.assignmentStatus === false && (
                            <span className="badge bg-warning">Pending</span>
                          )}
                          {row.assignmentStatus === true && (
                            <span className="badge bg-success">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No assignments found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default ShowAssignment;
