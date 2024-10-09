import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function MyExams() {
  const [assignedExams, setAssignedExams] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const studentId = localStorage.getItem("studentId");
  console.log("student id--->", studentId);
  // Fetch exams when page loads
  useEffect(() => {
    fetchAssignedExams();
  }, []);

  const fetchAssignedExams = async () => {
    try {
      const response = await axios.get(
        baseURL + `/student-assigned-exams/${studentId}/`
      );
      setAssignedExams(response.data);
      console.log("assigned exams----->", response.data);
    } catch (error) {
      console.error("Error fetching assigned exams:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  const isExamPastEndDate = (endTime) => {
    const now = new Date();
    const examEndTime = new Date(endTime);
    return now > examEndTime;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!assignedExams) {
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-md-12 text-center my-5">
          <div>Loading...</div>
        </div>
      </div>
    </div>;
  }

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
            <h5 className="card-header">Assigned Exams</h5>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Description</th>
                    <th>Exam Dates and Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedExams.length > 0 ? (
                    assignedExams.map((row) => (
                      <tr key={row.exam.id}>
                        <td>{row.exam.title}</td>
                        <td>{row.exam.description}</td>
                        <td>
                          {formatDate(row.exam.start_time)} -{" "}
                          {formatDate(row.exam.end_time)}
                        </td>
                        <td>
                          {row.submitted_time ? (
                            <span className="text-success">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Attempted
                            </span>
                          ) : isExamPastEndDate(row.exam.end_time) ? ( // Use nested exam's end_time
                            <span className="text-danger">
                              <i class="bi bi-x-circle-fill me-1"></i>
                              Exam Ended
                            </span>
                          ) : (
                            <Link
                              className="btn btn-primary btn-sm"
                              to={`/take-exam/${row.exam.id}`}
                            >
                              Take this exam
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-danger">No exams assigned</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyExams;
