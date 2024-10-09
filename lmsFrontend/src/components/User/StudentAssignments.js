import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function StudentAssignments() {
  const [assignmentData, setassignmentData] = useState([]);
  const [assignmentStatusData, setassignmentStatusData] = useState("");
  const [loading, setLoading] = useState(true); // Track the loading state
  const studentId = localStorage.getItem("studentId");
  // Fetch students when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/my-assignments/" + studentId).then((res) => {
        setassignmentData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  const markAsComplete = (assignment_id, title, detail, student, teacher) => {
    const _formData = new FormData();
    _formData.append("assignmentStatus", true);
    _formData.append("title", title);
    _formData.append("detail", detail);
    _formData.append("student", student);
    _formData.append("teacher", teacher);
    try {
      axios
        .put(baseURL + "/update-assignment/" + assignment_id, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            window.location.reload();
          }
        });
    } catch (error) {
      console.log(error);
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
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">My Assignments</h5>
            <div className="card-body">
              {assignmentData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Detail</th>
                      <th>Teacher</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentData.map((row, index) => (
                      <tr>
                        <td>{row.title}</td>
                        <td>{row.detail}</td>
                        <td>
                          <Link to={`/teacher-detail/` + row.teacher.id}>
                            {row.teacher.fullName}
                          </Link>
                        </td>
                        <td>
                          {row.assignmentStatus === false && (
                            <button
                              onClick={() =>
                                markAsComplete(
                                  row.id,
                                  row.title,
                                  row.detail,
                                  row.student.id,
                                  row.teacher.id
                                )
                              }
                              className="btn btn-success btn-sm"
                            >
                              Mark as Complete
                            </button>
                          )}
                          {row.assignmentStatus === true && (
                            <span className="badge bg-primary">Completed</span>
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

export default StudentAssignments;
